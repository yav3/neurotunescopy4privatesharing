"""Tests for the frontier caller and end-to-end pipeline."""
from __future__ import annotations

import json
import os
from pathlib import Path

import numpy as np
import pytest
import torch

from models.foundation.gene_foundation import GeneFoundationConfig
from models.foundation.hybrid_model import HybridFoundationModel, HybridModelConfig
from models.foundation.frontier_bridge import QueryType
from models.foundation.frontier_caller import (
    ClaudeFrontierCaller,
    MockFrontierCaller,
    FrontierCallerConfig,
)
from models.training.hybrid_trainer import (
    HybridTrainConfig,
    HybridTrainingPipeline,
    TrialRecord,
)
from models.training.checkpoint import (
    save_checkpoint,
    load_checkpoint,
    load_trial_record,
)


class TestMockFrontierCaller:

    def test_returns_structured_json(self):
        caller = MockFrontierCaller()
        result = caller("Test prompt with FOXO3: delta=+0.5")
        assert "reasoning" in result
        assert "confidence" in result
        assert "evidence_citations" in result
        assert "suggested_experiments" in result
        assert "caveats" in result

    def test_extracts_gene_names(self):
        caller = MockFrontierCaller()
        prompt = "FOXO3: delta=+0.5\nMTOR: delta=-0.3\nBECN1: delta=+0.2"
        result = caller(prompt)
        assert "FOXO3" in result["reasoning"]

    def test_confidence_configurable(self):
        caller = MockFrontierCaller(confidence=0.95)
        result = caller("test")
        assert result["confidence"] == 0.95

    def test_call_count_tracked(self):
        caller = MockFrontierCaller()
        caller("first")
        caller("second")
        assert caller.call_count == 2

    def test_extracts_regulation_counts(self):
        caller = MockFrontierCaller()
        prompt = "12 upregulated genes, 7 downregulated genes"
        result = caller(prompt)
        assert "12 upregulated" in result["reasoning"]
        assert "7 downregulated" in result["reasoning"]


class TestClaudeFrontierCaller:

    def test_json_extraction_clean(self):
        raw = json.dumps({
            "reasoning": "test",
            "confidence": 0.8,
            "evidence_citations": [],
            "suggested_experiments": [],
            "caveats": [],
        })
        parsed = ClaudeFrontierCaller._extract_json(raw)
        assert parsed["confidence"] == 0.8

    def test_json_extraction_with_fences(self):
        raw = "Here's my analysis:\n```json\n{\"reasoning\": \"test\", \"confidence\": 0.7}\n```"
        parsed = ClaudeFrontierCaller._extract_json(raw)
        assert parsed["reasoning"] == "test"
        assert parsed["confidence"] == 0.7

    def test_json_extraction_invalid_graceful(self):
        raw = "This is not JSON at all"
        parsed = ClaudeFrontierCaller._extract_json(raw)
        assert parsed["confidence"] == 0.1
        assert "not valid JSON" in parsed["caveats"][0]

    def test_no_api_key_raises(self):
        caller = ClaudeFrontierCaller(FrontierCallerConfig(api_key_env="_NONEXISTENT_KEY_"))
        with pytest.raises(ValueError, match="Set _NONEXISTENT_KEY_"):
            caller("test")


class TestCheckpoint:

    def test_save_and_load(self, tmp_path):
        gc = GeneFoundationConfig(max_genes=50, hidden_dim=64,
                                  num_layers=2, num_heads=4)
        config = HybridModelConfig(gene_config=gc, use_frontier=True,
                                   prediction_hidden=64)
        model = HybridFoundationModel(config)

        record = TrialRecord(
            study_id="TEST-001", species="human", regime="prior-contrast",
            n_samples=10, n_genes=50, n_series=1, model_params=100,
            train_mse=0.5, val_mse=0.6, test_mse=0.7,
            train_r=0.8, val_r=0.7, test_r=0.6,
            baseline_mse=1.0, baseline_r=0.3,
            criteria_met=4, verdict="MET",
        )
        record.compute_hash()

        ckpt_path = save_checkpoint(
            model, record, checkpoint_dir=tmp_path, tag="test",
        )
        assert ckpt_path.exists()
        assert (ckpt_path.parent / ckpt_path.name.replace(".pt", "_record.json")).exists()

        model2 = HybridFoundationModel(config)
        model2, meta = load_checkpoint(ckpt_path, model2)
        assert meta["study_id"] == "TEST-001"
        assert meta["content_hash"] == record.content_hash

        for p1, p2 in zip(model.parameters(), model2.parameters()):
            assert torch.equal(p1, p2)

    def test_load_trial_record(self, tmp_path):
        record = TrialRecord(
            study_id="TEST-002", species="human", regime="data-driven",
            n_samples=100, n_genes=200, n_series=3, model_params=5000,
            train_mse=0.1, val_mse=0.2, test_mse=0.3,
            train_r=0.9, val_r=0.85, test_r=0.8,
            baseline_mse=0.5, baseline_r=0.5,
            criteria_met=4, verdict="MET",
        )
        record.compute_hash()

        path = tmp_path / "test_record.json"
        from dataclasses import asdict
        with open(path, "w") as f:
            json.dump(asdict(record), f, default=str)

        loaded = load_trial_record(path)
        assert loaded.study_id == "TEST-002"
        assert loaded.criteria_met == 4

    def test_hash_integrity_verification(self, tmp_path):
        gc = GeneFoundationConfig(max_genes=20, hidden_dim=32,
                                  num_layers=1, num_heads=4)
        config = HybridModelConfig(gene_config=gc, use_frontier=False,
                                   prediction_hidden=32)
        model = HybridFoundationModel(config)

        record = TrialRecord(
            study_id="TEST-003", species="human", regime="prior-contrast",
            n_samples=5, n_genes=20, n_series=1, model_params=50,
            train_mse=1.0, val_mse=1.0, test_mse=1.0,
            train_r=0.0, val_r=0.0, test_r=0.0,
            baseline_mse=2.0, baseline_r=0.0,
            criteria_met=2, verdict="NOT_MET",
        )
        record.compute_hash()

        ckpt_path = save_checkpoint(model, record, checkpoint_dir=tmp_path)

        payload = torch.load(ckpt_path, weights_only=False)
        key = list(payload["model_state_dict"].keys())[0]
        payload["model_state_dict"][key] += 1.0
        torch.save(payload, ckpt_path)

        model2 = HybridFoundationModel(config)
        with pytest.raises(ValueError, match="Weights hash mismatch"):
            load_checkpoint(ckpt_path, model2, verify=True)


class TestEndToEndPipeline:

    def test_governed_trial_runs(self):
        """Full governed trial with real GEO data — the core integration test."""
        config = HybridTrainConfig(
            pretrain_epochs=3,
            finetune_epochs=3,
            patience=2,
        )
        pipeline = HybridTrainingPipeline(config=config)
        record = pipeline.run_governed_trial(
            study_id="TEST-E2E",
            max_genes=200,
            species="human",
            pretrain_first=True,
        )

        assert record.study_id == "TEST-E2E"
        assert record.species == "human"
        assert record.n_genes > 0
        assert record.n_samples > 0
        assert record.criteria_total == 4
        assert record.verdict in ("MET", "NOT_MET")
        assert np.isfinite(record.val_mse)
        assert np.isfinite(record.test_mse)
        assert record.content_hash

    def test_governed_inference_with_mock_frontier(self):
        """Full inference with mock frontier call."""
        gc = GeneFoundationConfig(max_genes=50, hidden_dim=64,
                                  num_layers=2, num_heads=4)
        config = HybridModelConfig(gene_config=gc, use_frontier=True,
                                   prediction_hidden=64)
        model = HybridFoundationModel(config)
        model.eval()

        expression = torch.randn(1, 50)
        gene_ids = torch.arange(50).unsqueeze(0)
        gene_names = [f"GENE{i}" for i in range(50)]
        caller = MockFrontierCaller(confidence=0.85)

        answer = model.predict_and_explain(
            expression=expression,
            gene_indices=gene_ids,
            gene_names=gene_names,
            species="human",
            regime="data-driven",
            hypothesis="Test hypothesis",
            study_id="TEST-INF",
            frontier_call=caller,
            query_type=QueryType.PERTURBATION_HYPOTHESIS,
        )

        assert answer.species == "human"
        assert answer.is_governed
        assert answer.content_hash
        assert len(answer.lineage_chain) >= 2
        assert answer.frontier_reasoning is not None
        assert answer.frontier_reasoning.confidence == 0.85
        assert caller.call_count == 1

    def test_train_save_load_infer(self, tmp_path):
        """Full cycle: train → save → load → infer."""
        gc = GeneFoundationConfig(max_genes=50, hidden_dim=64,
                                  num_layers=2, num_heads=4)
        config = HybridModelConfig(gene_config=gc, use_frontier=True,
                                   prediction_hidden=64)

        model = HybridFoundationModel(config)
        record = TrialRecord(
            study_id="TEST-CYCLE", species="human", regime="prior-contrast",
            n_samples=10, n_genes=50, n_series=1, model_params=100,
            train_mse=0.5, val_mse=0.6, test_mse=0.7,
            train_r=0.8, val_r=0.7, test_r=0.6,
            baseline_mse=1.0, baseline_r=0.3,
            criteria_met=4, verdict="MET",
        )
        record.compute_hash()

        ckpt_path = save_checkpoint(model, record, checkpoint_dir=tmp_path)

        model2 = HybridFoundationModel(config)
        model2, meta = load_checkpoint(ckpt_path, model2)

        expression = torch.randn(1, 50)
        gene_ids = torch.arange(50).unsqueeze(0)
        gene_names = [f"GENE{i}" for i in range(50)]
        caller = MockFrontierCaller()

        answer = model2.predict_and_explain(
            expression=expression,
            gene_indices=gene_ids,
            gene_names=gene_names,
            species="human",
            regime="prior-contrast",
            hypothesis="Loaded model test",
            study_id="TEST-CYCLE",
            frontier_call=caller,
        )

        assert answer.content_hash
        assert answer.frontier_reasoning is not None
