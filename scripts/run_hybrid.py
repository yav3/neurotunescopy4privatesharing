#!/usr/bin/env python3
"""Run the foundational-frontier hybrid model end-to-end.

Usage:
    python scripts/run_hybrid.py                  # train + infer (mock frontier)
    python scripts/run_hybrid.py --frontier real   # train + infer (real Claude)
    python scripts/run_hybrid.py --infer-only PATH # load checkpoint, infer

Steps:
    1. Load pooled GEO expression data from Merlin
    2. Pretrain via Masked Gene Modeling (self-supervised)
    3. Finetune on perturbation pairs (supervised)
    4. Evaluate against mean-baseline (4-criterion protocol)
    5. Save checkpoint + trial record
    6. Run governed inference with frontier reasoning
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import numpy as np
import torch

from models.foundation.gene_foundation import GeneFoundationConfig
from models.foundation.hybrid_model import HybridFoundationModel, HybridModelConfig
from models.foundation.frontier_bridge import QueryType
from models.foundation.frontier_caller import (
    ClaudeFrontierCaller,
    FrontierCallerConfig,
    MockFrontierCaller,
)
from models.training.hybrid_trainer import (
    HybridTrainConfig,
    HybridTrainingPipeline,
    GEOExpressionDataset,
)
from models.training.checkpoint import save_checkpoint, load_checkpoint


def train_and_evaluate(
    max_genes: int = 2000,
    species: str = "human",
    study_id: str = "NT-006",
    pretrain: bool = True,
    train_config: HybridTrainConfig | None = None,
) -> tuple[HybridFoundationModel, dict]:
    """Train the foundation model on real GEO data.

    Returns (trained_model, trial_record_dict).
    """
    config = train_config or HybridTrainConfig(
        pretrain_epochs=50,
        finetune_epochs=30,
        pretrain_lr=1e-4,
        finetune_lr=5e-5,
        patience=8,
    )

    pipeline = HybridTrainingPipeline(config=config)
    print(f"[{study_id}] Loading pooled GEO data (max_genes={max_genes})...")
    record = pipeline.run_governed_trial(
        study_id=study_id,
        max_genes=max_genes,
        species=species,
        pretrain_first=pretrain,
    )

    print(f"\n{'='*60}")
    print(f"  GOVERNED TRIAL: {record.study_id}")
    print(f"{'='*60}")
    print(f"  Samples:     {record.n_samples}")
    print(f"  Genes:       {record.n_genes}")
    print(f"  Parameters:  {record.model_params:,}")
    print(f"  Regime:      {record.regime}")
    print(f"  Species:     {record.species}")
    print(f"  Elapsed:     {record.elapsed_seconds:.1f}s")
    print(f"{'='*60}")
    print(f"  Train MSE:   {record.train_mse:.6f}   r={record.train_r:.4f}")
    print(f"  Val MSE:     {record.val_mse:.6f}   r={record.val_r:.4f}")
    print(f"  Test MSE:    {record.test_mse:.6f}   r={record.test_r:.4f}")
    print(f"  Baseline:    MSE={record.baseline_mse:.6f}   r={record.baseline_r:.4f}")
    print(f"{'='*60}")
    print(f"  Criteria:    {record.criteria_met}/{record.criteria_total}")
    print(f"  Verdict:     {record.verdict}")
    print(f"  Hash:        {record.content_hash[:16]}...")
    print(f"{'='*60}\n")

    gc = GeneFoundationConfig(max_genes=record.n_genes, hidden_dim=256,
                              num_layers=6, num_heads=8)
    hybrid_config = HybridModelConfig(gene_config=gc, use_frontier=True)
    model = HybridFoundationModel(hybrid_config)

    if pretrain:
        dataset = pipeline.load_pooled_data(max_genes=max_genes, species=species)
        encoder, _ = pipeline.run_pretrain(dataset, gc)
        model.encoder = encoder

    ckpt_path = save_checkpoint(model, record, tag="governed")
    print(f"  Checkpoint:  {ckpt_path}")

    return model, record


def run_governed_inference(
    model: HybridFoundationModel,
    dataset: GEOExpressionDataset,
    frontier_mode: str = "mock",
    hypothesis: str = "Perturbation alters gene regulatory network topology",
    study_id: str = "NT-006",
):
    """Run governed inference with frontier reasoning."""
    if frontier_mode == "real":
        caller = ClaudeFrontierCaller()
        print("\n  Frontier:    Claude API (real)")
    else:
        caller = MockFrontierCaller(confidence=0.75)
        print("\n  Frontier:    Mock (deterministic)")

    sample_expr = torch.tensor(
        dataset.pairs[0][0][np.newaxis, :], dtype=torch.float32
    )
    gene_ids = torch.arange(sample_expr.shape[1]).unsqueeze(0)

    print("  Running governed inference...")
    t0 = time.time()

    answer = model.predict_and_explain(
        expression=sample_expr,
        gene_indices=gene_ids,
        gene_names=dataset.gene_names,
        species=dataset.species,
        regime="data-driven" if len(dataset.pairs) >= 30 else "prior-contrast",
        hypothesis=hypothesis,
        study_id=study_id,
        frontier_call=caller,
        query_type=QueryType.PERTURBATION_HYPOTHESIS,
    )

    elapsed = time.time() - t0

    print(f"\n{'='*60}")
    print(f"  GOVERNED HYBRID ANSWER")
    print(f"{'='*60}")
    print(f"  Species:     {answer.species}")
    print(f"  Regime:      {answer.regime}")
    print(f"  Study:       {answer.study_id}")
    print(f"  Governed:    {answer.is_governed}")
    print(f"  Lineage:     {len(answer.lineage_chain)} hashes")
    print(f"  Hash:        {answer.content_hash[:16]}...")

    pred = answer.foundation_prediction
    if "confidence" in pred:
        print(f"  Confidence:  {pred['confidence']:.4f}")

    delta = pred.get("expression_delta", {})
    if delta:
        print(f"  Genes:       {delta.get('total_genes', '?')}")
        print(f"  Upregulated: {delta.get('n_upregulated', '?')}")
        print(f"  Downregulated: {delta.get('n_downregulated', '?')}")
        top = delta.get("top_genes", [])[:5]
        if top:
            print(f"  Top genes:")
            for g in top:
                print(f"    {g['gene']:>10s}  delta={g['delta']:+.4f}")

    if answer.frontier_reasoning is not None:
        fr = answer.frontier_reasoning
        print(f"\n  --- Frontier Reasoning ---")
        print(f"  Confidence:  {fr.confidence:.2f}")
        print(f"  Reasoning:   {fr.reasoning[:200]}")
        if fr.evidence_citations:
            print(f"  Citations:   {', '.join(fr.evidence_citations[:3])}")
        if fr.suggested_experiments:
            print(f"  Experiments: {fr.suggested_experiments[0]}")
        if fr.caveats:
            print(f"  Caveats:     {fr.caveats[0]}")
    else:
        print(f"\n  No frontier reasoning (foundation-only)")

    print(f"\n  Inference time: {elapsed:.2f}s")
    print(f"{'='*60}")

    results_dir = Path(__file__).parent.parent / "results"
    results_dir.mkdir(exist_ok=True)
    ts = time.strftime("%Y%m%d_%H%M%S")
    result_path = results_dir / f"governed_answer_{ts}.json"

    result_json = {
        "species": answer.species,
        "regime": answer.regime,
        "study_id": answer.study_id,
        "is_governed": answer.is_governed,
        "content_hash": answer.content_hash,
        "lineage_chain": answer.lineage_chain,
        "foundation_prediction": {
            k: v for k, v in pred.items()
            if k != "predicted_expression"
        },
        "frontier_reasoning": {
            "reasoning": fr.reasoning,
            "confidence": fr.confidence,
            "evidence_citations": fr.evidence_citations,
            "suggested_experiments": fr.suggested_experiments,
            "caveats": fr.caveats,
        } if answer.frontier_reasoning else None,
        "inference_seconds": elapsed,
    }
    with open(result_path, "w") as f:
        json.dump(result_json, f, indent=2, default=str)
    print(f"  Result:      {result_path}\n")

    return answer


def main():
    parser = argparse.ArgumentParser(
        description="Run the foundational-frontier hybrid model"
    )
    parser.add_argument(
        "--frontier", choices=["mock", "real"], default="mock",
        help="Frontier LLM mode: mock (default) or real (needs ANTHROPIC_API_KEY)",
    )
    parser.add_argument(
        "--max-genes", type=int, default=2000,
        help="Maximum genes to use (default: 2000)",
    )
    parser.add_argument(
        "--study-id", default="NT-006",
        help="Study ID for the governed trial",
    )
    parser.add_argument(
        "--no-pretrain", action="store_true",
        help="Skip self-supervised pretraining",
    )
    parser.add_argument(
        "--infer-only", type=str, default=None,
        help="Path to checkpoint — skip training, run inference only",
    )
    parser.add_argument(
        "--hypothesis", type=str,
        default="Perturbation alters gene regulatory network topology",
        help="Pre-registered hypothesis for frontier reasoning",
    )
    args = parser.parse_args()

    print(f"\n  Foundational-Frontier Hybrid Model")
    print(f"  {'='*40}")
    print(f"  Frontier:    {args.frontier}")
    print(f"  Max genes:   {args.max_genes}")
    print(f"  Study ID:    {args.study_id}")
    print(f"  Pretrain:    {not args.no_pretrain}")
    print()

    pipeline = HybridTrainingPipeline()

    if args.infer_only:
        print(f"  Loading checkpoint: {args.infer_only}")
        dataset = pipeline.load_pooled_data(max_genes=args.max_genes)
        n_genes = len(dataset.gene_names)
        gc = GeneFoundationConfig(max_genes=n_genes, hidden_dim=256,
                                  num_layers=6, num_heads=8)
        hybrid_config = HybridModelConfig(gene_config=gc, use_frontier=True)
        model = HybridFoundationModel(hybrid_config)
        model, meta = load_checkpoint(args.infer_only, model)
        print(f"  Loaded study {meta['study_id']}, hash {meta['weights_hash'][:16]}...")
    else:
        model, record = train_and_evaluate(
            max_genes=args.max_genes,
            study_id=args.study_id,
            pretrain=not args.no_pretrain,
        )
        dataset = pipeline.load_pooled_data(max_genes=args.max_genes)

    run_governed_inference(
        model=model,
        dataset=dataset,
        frontier_mode=args.frontier,
        hypothesis=args.hypothesis,
        study_id=args.study_id,
    )

    print("  Done.\n")


if __name__ == "__main__":
    main()
