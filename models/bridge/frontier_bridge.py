"""Frontier bridge — governed routing between narrow model and frontier LLMs.

The bridge decides per-query whether the narrow foundation model has
sufficient data and confidence, or whether to defer to a frontier LLM
(Claude, etc.) for reasoning over the governed evidence.

Three components:
    GovernedRouter:     data-sufficiency gating (narrow vs frontier)
    EvidenceSerializer: converts model outputs → structured evidence JSON
    FrontierAdapter:    abstract interface for frontier model calls

The bridge enforces the governed evidence discipline on both paths:
    - Narrow model outputs carry hash-chained lineage
    - Frontier model prompts include the evidence context and constraints
    - Frontier model responses are parsed back into the governed format
    - Species firewall is enforced before serialization
"""
from __future__ import annotations

import hashlib
import json
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Protocol

import numpy as np
import torch


class RoutingDecision(Enum):
    FOUNDATION = "foundation"
    FRONTIER = "frontier"
    INSUFFICIENT = "insufficient"


@dataclass
class EvidenceRecord:
    """Hash-chained evidence record for any model output."""
    source: str
    task: str
    species: str
    regime: str
    timestamp: float
    content: dict[str, Any]
    parent_hash: str = ""
    confidence: float = 0.0

    def content_hash(self) -> str:
        payload = json.dumps(
            {
                "source": self.source,
                "task": self.task,
                "species": self.species,
                "regime": self.regime,
                "content": self.content,
                "parent_hash": self.parent_hash,
            },
            sort_keys=True,
            default=str,
        )
        return hashlib.sha256(payload.encode()).hexdigest()


@dataclass
class RoutingContext:
    """Context for a routing decision."""
    task: str
    species: str
    n_modalities: int
    n_samples: int
    confidence: float
    available_modalities: list[str] = field(default_factory=list)
    expression_genes: int = 0
    regime: str = ""


@dataclass
class FrontierQuery:
    """Structured query for a frontier model, with governed constraints."""
    system_prompt: str
    evidence_context: str
    question: str
    constraints: dict[str, Any]
    max_tokens: int = 2048


@dataclass
class FrontierResponse:
    """Parsed response from a frontier model."""
    content: str
    structured: dict[str, Any]
    model_id: str
    usage: dict[str, int] = field(default_factory=dict)
    evidence_record: EvidenceRecord | None = None


# ---------------------------------------------------------------------------
# Evidence serializer
# ---------------------------------------------------------------------------

class EvidenceSerializer:
    """Converts model outputs and governed metadata into structured evidence.

    Produces JSON that frontier models can reason over, and that the
    governed evidence chain can verify.
    """

    def __init__(self, species_firewall: bool = True):
        self.species_firewall = species_firewall
        self._chain_head: str = ""

    def serialize_prediction(
        self,
        task: str,
        species: str,
        regime: str,
        prediction: dict[str, Any],
        metadata: dict[str, Any] | None = None,
        confidence: float = 0.0,
    ) -> EvidenceRecord:
        """Wrap a model prediction in a hash-chained evidence record."""
        if self.species_firewall:
            if species not in ("human", "mouse"):
                raise ValueError(
                    f"Species firewall: '{species}' not in allowed set. "
                    f"Declare 'human' or 'mouse', or refuse."
                )

        content = {
            "prediction": _numpy_safe(prediction),
            "metadata": _numpy_safe(metadata or {}),
        }

        record = EvidenceRecord(
            source="neurohybrid:foundation",
            task=task,
            species=species,
            regime=regime,
            timestamp=time.time(),
            content=content,
            parent_hash=self._chain_head,
            confidence=confidence,
        )
        self._chain_head = record.content_hash()
        return record

    def serialize_for_frontier(
        self,
        task: str,
        species: str,
        regime: str,
        foundation_output: dict[str, Any],
        question: str,
        constraints: dict[str, Any] | None = None,
    ) -> FrontierQuery:
        """Build a structured query for a frontier model.

        The prompt includes the evidence context so the frontier model
        reasons within the governed constraints, not in a vacuum.
        """
        evidence_context = json.dumps(
            {
                "task": task,
                "species": species,
                "regime": regime,
                "foundation_output": _numpy_safe(foundation_output),
                "evidence_chain_head": self._chain_head,
            },
            indent=2,
            default=str,
        )

        system_prompt = (
            "You are a governed evidence analysis layer. "
            "You reason over the provided foundation model outputs and "
            "biological evidence within the stated constraints. "
            f"Species: {species}. Regime: {regime}. "
            "Do not speculate beyond the evidence. "
            "If the evidence is insufficient, say so explicitly."
        )

        return FrontierQuery(
            system_prompt=system_prompt,
            evidence_context=evidence_context,
            question=question,
            constraints=constraints or {
                "species": species,
                "regime": regime,
                "require_evidence": True,
            },
        )

    def parse_frontier_response(
        self,
        raw_response: str,
        task: str,
        species: str,
        regime: str,
        model_id: str,
    ) -> FrontierResponse:
        """Parse a frontier model's text response into governed format."""
        try:
            structured = json.loads(raw_response)
        except json.JSONDecodeError:
            structured = {"text": raw_response, "parsed": False}

        record = EvidenceRecord(
            source=f"frontier:{model_id}",
            task=task,
            species=species,
            regime=regime,
            timestamp=time.time(),
            content=structured,
            parent_hash=self._chain_head,
        )
        self._chain_head = record.content_hash()

        return FrontierResponse(
            content=raw_response,
            structured=structured,
            model_id=model_id,
            evidence_record=record,
        )


# ---------------------------------------------------------------------------
# Governed router
# ---------------------------------------------------------------------------

TASK_REQUIREMENTS: dict[str, dict[str, Any]] = {
    "perturbation_prediction": {
        "min_samples": 30,
        "required_modalities": ["expression"],
        "min_confidence": 0.7,
    },
    "disease_classification": {
        "min_samples": 1,
        "required_modalities": [],
        "min_confidence": 0.6,
    },
    "evidence_synthesis": {
        "min_samples": 0,
        "required_modalities": [],
        "min_confidence": 0.0,
        "prefer_frontier": True,
    },
    "gene_regulatory_inference": {
        "min_samples": 30,
        "required_modalities": ["expression"],
        "min_confidence": 0.8,
    },
}


class GovernedRouter:
    """Routes queries to narrow model or frontier based on data sufficiency.

    Decision logic:
        1. Check task-specific minimum requirements (samples, modalities)
        2. Check foundation model confidence estimate
        3. If both pass: FOUNDATION (fast, governed, no API cost)
        4. If confidence low but data present: FRONTIER (augmented reasoning)
        5. If data insufficient for either: INSUFFICIENT (refuse)
    """

    def __init__(
        self,
        confidence_threshold: float = 0.8,
        min_modalities: int = 1,
    ):
        self.confidence_threshold = confidence_threshold
        self.min_modalities = min_modalities

    def route(self, ctx: RoutingContext) -> tuple[RoutingDecision, dict[str, Any]]:
        """Decide routing for a given context.

        Returns (decision, rationale_dict).
        """
        task_reqs = TASK_REQUIREMENTS.get(ctx.task, {})
        rationale: dict[str, Any] = {"task": ctx.task, "checks": []}

        # Tasks that always prefer frontier
        if task_reqs.get("prefer_frontier", False):
            rationale["checks"].append("task prefers frontier model")
            return RoutingDecision.FRONTIER, rationale

        # Check required modalities
        required = set(task_reqs.get("required_modalities", []))
        available = set(ctx.available_modalities)
        missing = required - available
        if missing:
            rationale["checks"].append(f"missing required modalities: {missing}")
            return RoutingDecision.INSUFFICIENT, rationale

        # Check minimum samples
        min_samples = task_reqs.get("min_samples", 0)
        if ctx.n_samples < min_samples:
            rationale["checks"].append(
                f"insufficient samples: {ctx.n_samples} < {min_samples}"
            )
            # Below sample threshold but have some data → frontier can help
            if ctx.n_samples > 0 and ctx.n_modalities >= 1:
                rationale["checks"].append("deferring to frontier with available data")
                return RoutingDecision.FRONTIER, rationale
            return RoutingDecision.INSUFFICIENT, rationale

        # Check minimum modalities
        if ctx.n_modalities < self.min_modalities:
            rationale["checks"].append(
                f"below min modalities: {ctx.n_modalities} < {self.min_modalities}"
            )
            return RoutingDecision.FRONTIER, rationale

        # Check confidence
        task_min_conf = task_reqs.get("min_confidence", self.confidence_threshold)
        if ctx.confidence < task_min_conf:
            rationale["checks"].append(
                f"confidence {ctx.confidence:.3f} < threshold {task_min_conf:.3f}"
            )
            return RoutingDecision.FRONTIER, rationale

        rationale["checks"].append("all checks passed → foundation model")
        return RoutingDecision.FOUNDATION, rationale


# ---------------------------------------------------------------------------
# Frontier adapter (abstract interface)
# ---------------------------------------------------------------------------

class FrontierAdapter(ABC):
    """Abstract interface for calling frontier models."""

    @abstractmethod
    def call(self, query: FrontierQuery) -> str:
        """Send a governed query to the frontier model and return raw text."""
        ...

    @abstractmethod
    def model_id(self) -> str:
        ...


class StubFrontierAdapter(FrontierAdapter):
    """Stub for testing — returns a fixed response."""

    def __init__(self, response: str = '{"answer": "stub", "confidence": 0.5}'):
        self._response = response

    def call(self, query: FrontierQuery) -> str:
        return self._response

    def model_id(self) -> str:
        return "stub-frontier-v0"


class ClaudeFrontierAdapter(FrontierAdapter):
    """Adapter for calling Claude via the Anthropic API.

    Requires ANTHROPIC_API_KEY in the environment. Uses the governed
    system prompt from EvidenceSerializer.
    """

    def __init__(self, model: str = "claude-sonnet-4-6", max_tokens: int = 2048):
        self._model = model
        self._max_tokens = max_tokens

    def call(self, query: FrontierQuery) -> str:
        try:
            import anthropic
        except ImportError:
            raise ImportError(
                "anthropic package required for ClaudeFrontierAdapter. "
                "Install with: pip install anthropic"
            )

        client = anthropic.Anthropic()
        message = client.messages.create(
            model=self._model,
            max_tokens=query.max_tokens or self._max_tokens,
            system=query.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Evidence context:\n{query.evidence_context}\n\n"
                        f"Question: {query.question}\n\n"
                        f"Constraints: {json.dumps(query.constraints)}"
                    ),
                }
            ],
        )
        return message.content[0].text

    def model_id(self) -> str:
        return self._model


# ---------------------------------------------------------------------------
# Integrated bridge
# ---------------------------------------------------------------------------

class FrontierBridge:
    """Integrates routing, serialization, and frontier model calls.

    Usage:
        bridge = FrontierBridge(model=hybrid_model, adapter=ClaudeFrontierAdapter())
        result = bridge.query(
            task="perturbation_prediction",
            species="human",
            expression=expr_tensor,
            question="What genes are most affected by this perturbation?",
        )
    """

    def __init__(
        self,
        router: GovernedRouter | None = None,
        serializer: EvidenceSerializer | None = None,
        adapter: FrontierAdapter | None = None,
    ):
        self.router = router or GovernedRouter()
        self.serializer = serializer or EvidenceSerializer()
        self.adapter = adapter or StubFrontierAdapter()

    def query(
        self,
        task: str,
        species: str,
        regime: str = "data-driven",
        foundation_output: dict[str, Any] | None = None,
        question: str = "",
        n_modalities: int = 1,
        n_samples: int = 0,
        confidence: float = 0.0,
        available_modalities: list[str] | None = None,
    ) -> dict[str, Any]:
        """Execute a governed query, routing to foundation or frontier.

        Returns:
            {
                "decision": "foundation" | "frontier" | "insufficient",
                "evidence_record": EvidenceRecord,
                "rationale": dict,
                "response": dict (from frontier) or None,
            }
        """
        ctx = RoutingContext(
            task=task,
            species=species,
            n_modalities=n_modalities,
            n_samples=n_samples,
            confidence=confidence,
            available_modalities=available_modalities or [],
        )

        decision, rationale = self.router.route(ctx)

        result: dict[str, Any] = {
            "decision": decision.value,
            "rationale": rationale,
        }

        if decision == RoutingDecision.FOUNDATION:
            record = self.serializer.serialize_prediction(
                task=task,
                species=species,
                regime=regime,
                prediction=foundation_output or {},
                confidence=confidence,
            )
            result["evidence_record"] = record
            result["response"] = None

        elif decision == RoutingDecision.FRONTIER:
            frontier_query = self.serializer.serialize_for_frontier(
                task=task,
                species=species,
                regime=regime,
                foundation_output=foundation_output or {},
                question=question,
            )

            raw = self.adapter.call(frontier_query)
            response = self.serializer.parse_frontier_response(
                raw_response=raw,
                task=task,
                species=species,
                regime=regime,
                model_id=self.adapter.model_id(),
            )
            result["evidence_record"] = response.evidence_record
            result["response"] = response

        else:
            result["evidence_record"] = None
            result["response"] = None

        return result


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def _numpy_safe(obj: Any) -> Any:
    """Recursively convert numpy types to JSON-serializable Python types."""
    if isinstance(obj, dict):
        return {k: _numpy_safe(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_numpy_safe(v) for v in obj]
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        v = float(obj)
        if not np.isfinite(v):
            return None
        return v
    if isinstance(obj, torch.Tensor):
        return obj.detach().cpu().numpy().tolist()
    return obj
