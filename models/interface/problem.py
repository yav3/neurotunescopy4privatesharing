"""Problem specification — typed, structured input to any solver.

Every problem has a type, parameters, and a query. The type selects
which solver runs; the parameters configure it; the query specifies
what to compute.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any

import numpy as np


class ProblemType(Enum):
    # Pharmacokinetics
    PK_CONCENTRATION = "pk_concentration"
    PK_STEADY_STATE = "pk_steady_state"
    PK_MULTI_DOSE = "pk_multi_dose"

    # Pharmacodynamics
    PD_EFFECT = "pd_effect"
    PD_BIOMARKER = "pd_biomarker"
    PD_INVERSE = "pd_inverse"
    PKPD_TRAJECTORY = "pkpd_trajectory"

    # Disease progression
    PROGRESSION_LINEAR = "progression_linear"
    PROGRESSION_EPISODIC = "progression_episodic"
    PROGRESSION_EVENT = "progression_event"
    MCI_CONVERSION = "mci_conversion"

    # GRN dynamics
    GRN_SIMULATE = "grn_simulate"
    GRN_IDENTIFY = "grn_identify_critical"

    # VADE geometry
    VADE_PROJECT = "vade_project"
    VADE_GEODESIC = "vade_geodesic"
    VADE_TRAJECTORY = "vade_trajectory"
    VADE_SCHEDULE = "vade_fibonacci_schedule"

    # Spectral
    SPECTRAL_BAND_POWER = "spectral_band_power"
    SPECTRAL_ENTROPY = "spectral_entropy"
    SPECTRAL_THERAPEUTIC = "spectral_therapeutic_score"
    BINAURAL_BEAT = "binaural_beat"

    # Composite
    TREATMENT_PLAN = "treatment_plan"
    DISEASE_FORECAST = "disease_forecast"


@dataclass
class Problem:
    """A mathematical problem to be solved.

    Usage:
        p = Problem(
            type=ProblemType.PK_CONCENTRATION,
            params={"drug": "donepezil", "weight_kg": 70},
            query={"time_hr": 24.0},
        )
        answer = solver.solve(p)
    """
    type: ProblemType
    params: dict[str, Any] = field(default_factory=dict)
    query: dict[str, Any] = field(default_factory=dict)
    context: dict[str, Any] | None = None

    def encode(self) -> np.ndarray:
        """Encode the problem as a numerical vector for the neural solver.
        Type → one-hot, params/query → concatenated values.
        """
        n_types = len(ProblemType)
        type_vec = np.zeros(n_types)
        type_vec[list(ProblemType).index(self.type)] = 1.0

        param_vals = []
        for v in self.params.values():
            if isinstance(v, (int, float)):
                param_vals.append(float(v))
            elif isinstance(v, np.ndarray):
                param_vals.extend(v.ravel().tolist()[:16])

        query_vals = []
        for v in self.query.values():
            if isinstance(v, (int, float)):
                query_vals.append(float(v))

        # Pad to fixed length
        param_vals = (param_vals + [0.0] * 32)[:32]
        query_vals = (query_vals + [0.0] * 16)[:16]

        return np.concatenate([type_vec, param_vals, query_vals]).astype(np.float32)

    @staticmethod
    def encoding_dim() -> int:
        return len(ProblemType) + 32 + 16


@dataclass
class Answer:
    """Structured answer from a solver."""
    values: dict[str, float | np.ndarray]
    problem_type: ProblemType
    exact: bool = True    # True if from math_core, False if from neural approx
    confidence: float = 1.0

    def primary_value(self) -> float | np.ndarray:
        """Return the main numerical answer."""
        if len(self.values) == 1:
            return next(iter(self.values.values()))
        for key in ("concentration", "effect", "biomarker", "distance",
                     "score", "value", "result"):
            if key in self.values:
                return self.values[key]
        return next(iter(self.values.values()))
