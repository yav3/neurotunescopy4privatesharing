"""Regime firewall — species/regime declaration enforcement.

Enforces: "declare or refuse, never default."
Every computation must declare its species and regime scope.
Mirrors Merlin convention where human/mouse are never pooled
without explicit declaration (see RB-020 study record).
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Species(Enum):
    HUMAN = "human"
    MOUSE = "mouse"
    RAT = "rat"
    IN_VITRO = "in_vitro"
    IN_SILICO = "in_silico"
    SYNTHETIC = "synthetic"


class Regime(Enum):
    THERAPEUTIC = "therapeutic"
    OBSERVATIONAL = "observational"
    EXPERIMENTAL = "experimental"
    BENCHMARK = "benchmark"
    SYNTHETIC = "synthetic"


@dataclass
class SpeciesDeclaration:
    """Explicit species/regime declaration for a computation."""
    species: Species
    regime: Regime
    justification: str = ""
    cross_species: bool = False


class RegimeFirewall:
    """Enforces species/regime declaration before computation."""

    @staticmethod
    def validate(decl: SpeciesDeclaration) -> tuple[bool, str]:
        if decl.species == Species.HUMAN and decl.regime == Regime.EXPERIMENTAL:
            if not decl.justification:
                return False, "Human experimental data requires justification"
        if decl.cross_species and decl.species != Species.IN_SILICO:
            if not decl.justification:
                return False, "Cross-species comparison requires justification"
        return True, ""

    @staticmethod
    def check_compatibility(a: SpeciesDeclaration, b: SpeciesDeclaration) -> tuple[bool, str]:
        if a.species != b.species:
            if not (a.cross_species and b.cross_species):
                return False, (
                    f"Species mismatch: {a.species.value} vs {b.species.value}. "
                    "Set cross_species=True on both declarations to allow."
                )
        if a.regime != b.regime:
            return False, (
                f"Regime mismatch: {a.regime.value} vs {b.regime.value}. "
                "Analyses must share a regime unless explicitly bridged."
            )
        return True, ""
