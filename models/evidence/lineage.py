"""Hash-chained evidence lineage — every solver run gets a tamper-evident record.

Follows merlinaineuralplus2/backend/app/patents/rtp/lineage.py pattern:
SHA-256 chain over (prev_hash, problem_spec, answer_values, timestamp).
"""
from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, field
from typing import Any

import numpy as np


def _serialize(obj: Any) -> str:
    """Deterministic JSON serialization with 6-decimal float rounding."""
    if isinstance(obj, np.ndarray):
        return json.dumps(np.round(obj, 6).tolist(), sort_keys=True)
    if isinstance(obj, dict):
        return json.dumps(
            {k: round(v, 6) if isinstance(v, float) else v for k, v in sorted(obj.items())},
            sort_keys=True,
            default=str,
        )
    return json.dumps(obj, sort_keys=True, default=str)


def _sha256(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


@dataclass
class EvidenceRecord:
    """One immutable record in the evidence chain."""
    record_id: str
    problem_spec: dict[str, Any]
    answer_values: dict[str, Any]
    timestamp: float = field(default_factory=time.time)
    prev_hash: str = ""
    record_hash: str = ""

    def __post_init__(self):
        if not self.record_hash:
            self.record_hash = self.compute_hash()

    def compute_hash(self) -> str:
        payload = "|".join([
            self.prev_hash,
            self.record_id,
            _serialize(self.problem_spec),
            _serialize(self.answer_values),
            f"{self.timestamp:.6f}",
        ])
        return _sha256(payload)

    def verify(self) -> bool:
        return self.record_hash == self.compute_hash()

    def to_dict(self) -> dict:
        return {
            "record_id": self.record_id,
            "problem_spec": self.problem_spec,
            "answer_values": {
                k: v.tolist() if isinstance(v, np.ndarray) else v
                for k, v in self.answer_values.items()
            },
            "timestamp": self.timestamp,
            "prev_hash": self.prev_hash,
            "record_hash": self.record_hash,
        }


class LineageChain:
    """Append-only hash chain of evidence records."""

    def __init__(self):
        self._records: list[EvidenceRecord] = []

    def append(
        self,
        record_id: str,
        problem_spec: dict,
        answer_values: dict,
    ) -> EvidenceRecord:
        prev_hash = self._records[-1].record_hash if self._records else ""
        record = EvidenceRecord(
            record_id=record_id,
            problem_spec=problem_spec,
            answer_values=answer_values,
            prev_hash=prev_hash,
        )
        self._records.append(record)
        return record

    def verify_chain(self) -> bool:
        for i, rec in enumerate(self._records):
            if not rec.verify():
                return False
            if i > 0 and rec.prev_hash != self._records[i - 1].record_hash:
                return False
        return True

    @property
    def head_hash(self) -> str:
        return self._records[-1].record_hash if self._records else ""

    def __len__(self) -> int:
        return len(self._records)

    def export(self) -> list[dict]:
        return [r.to_dict() for r in self._records]
