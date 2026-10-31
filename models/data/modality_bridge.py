"""Modality bridge — unified data discovery and loading across data types.

Bridges all available data modalities from Merlin's committed data into
NeuroTunesAI's training formats. Each modality has its own loader;
the bridge provides a unified discovery + regime classification interface.

Supported modalities:
  - bulk_expression: GEO CSVs (genes × samples), via geo_loader
  - perturbseq: Xaira-format parquet (cells × genes + knockout targets), via perturbseq_loader

Planned (not yet implemented):
  - methylation: beta-value arrays (CpG × samples)
  - imaging: extracted feature vectors (samples × features)
  - single_cell_atlas: h5ad/AnnData format
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Any

from models.training.governed_harness import select_training_regime


class DataModality(str, Enum):
    BULK_EXPRESSION = "bulk_expression"
    PERTURBSEQ = "perturbseq"
    METHYLATION = "methylation"
    IMAGING = "imaging"
    SINGLE_CELL_ATLAS = "single_cell_atlas"


@dataclass
class DatasetEntry:
    """Unified dataset entry across modalities."""
    modality: DataModality
    path: str
    species: str
    n_features: int
    n_samples: int
    content_hash: str
    regime: str
    in_regime: bool
    accession: str = ""
    extra: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        d = {
            "modality": self.modality.value,
            "path": self.path,
            "species": self.species,
            "n_features": self.n_features,
            "n_samples": self.n_samples,
            "content_hash": self.content_hash,
            "regime": self.regime,
            "in_regime": self.in_regime,
            "accession": self.accession,
        }
        if self.extra:
            d["extra"] = self.extra
        return d


def discover_all_datasets(
    merlin_root: str | Path | None = None,
    species: str = "human",
) -> list[DatasetEntry]:
    """Discover all available datasets across all modalities.

    Scans Merlin's data directory tree for each supported modality
    and returns a unified list with regime classification.
    """
    if merlin_root is None:
        merlin_root = Path(__file__).parent.parent.parent.parent / "merlinaineuralplus2"
    else:
        merlin_root = Path(merlin_root)

    entries: list[DatasetEntry] = []

    # Bulk expression
    from models.data.geo_loader import discover_merlin_datasets
    expr_dir = merlin_root / "backend" / "data" / "expression" / species
    for d in discover_merlin_datasets(expr_dir, species=species):
        regime = select_training_regime(
            n_samples=d["n_samples"],
            n_conditions=2 if d["n_control"] > 0 and d["n_treated"] > 0 else 1,
        )
        entries.append(DatasetEntry(
            modality=DataModality.BULK_EXPRESSION,
            path=d["path"],
            species=species,
            n_features=d["n_genes"],
            n_samples=d["n_samples"],
            content_hash=d["content_hash"],
            regime=regime,
            in_regime=regime == "data-driven",
            accession=d["accession"],
            extra={
                "n_control": d["n_control"],
                "n_treated": d["n_treated"],
            },
        ))

    # Perturb-seq
    from models.data.perturbseq_loader import discover_perturbseq_datasets
    ps_dir = merlin_root / "backend" / "data" / "perturbseq" / species
    for d in discover_perturbseq_datasets(ps_dir, species=species):
        entries.append(DatasetEntry(
            modality=DataModality.PERTURBSEQ,
            path=d["source_path"],
            species=species,
            n_features=d["n_genes"],
            n_samples=d["n_cells"],
            content_hash=d["content_hash"],
            regime="data-driven",
            in_regime=True,
            extra={
                "n_targets": d["n_targets"],
                "n_control_cells": d["n_control_cells"],
                "n_batches": d["n_batches"],
            },
        ))

    return entries


def regime_summary(entries: list[DatasetEntry]) -> dict[str, Any]:
    """Summarise discovered datasets by modality and regime."""
    by_modality: dict[str, list[DatasetEntry]] = {}
    for e in entries:
        by_modality.setdefault(e.modality.value, []).append(e)

    summary = {}
    for mod, datasets in by_modality.items():
        in_regime = [d for d in datasets if d.in_regime]
        summary[mod] = {
            "total": len(datasets),
            "in_regime": len(in_regime),
            "total_samples": sum(d.n_samples for d in datasets),
            "in_regime_samples": sum(d.n_samples for d in in_regime),
            "regimes": list(set(d.regime for d in datasets)),
        }

    summary["_total"] = {
        "datasets": len(entries),
        "in_regime": sum(1 for e in entries if e.in_regime),
        "total_samples": sum(e.n_samples for e in entries),
        "modalities": list(by_modality.keys()),
    }
    return summary
