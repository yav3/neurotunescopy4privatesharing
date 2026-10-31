"""Pharmacokinetic solvers — 1-compartment models from drug_parameters.json.

Oral (first-order absorption):
    C(t) = (F · Dose · ka) / (Vd · (ka - ke)) · (e^{-ke·t} - e^{-ka·t})

Steady-state trough (oral, dosing interval τ):
    Css_trough = (F · Dose · ka) / (Vd · (ka - ke))
                 · (e^{-ke·τ} / (1 - e^{-ke·τ}) - e^{-ka·τ} / (1 - e^{-ka·τ}))

IV bolus:
    C(t) = (Dose / Vd) · e^{-ke·t}

Steady-state trough (IV, interval τ):
    Css_trough = (Dose / Vd) · e^{-ke·τ} / (1 - e^{-ke·τ})

Interindividual variability (IIV):
    θ_i = θ_pop · exp(η_i),   η_i ~ N(0, ω²)
"""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass


@dataclass
class PKParams:
    ka_per_hr: float       # absorption rate constant (oral only)
    ke_per_hr: float       # elimination rate constant
    vd_l: float            # volume of distribution (total, not per-kg)
    bioavailability: float  # F
    dose_mg: float
    route: str             # "oral" or "iv"
    tau_hr: float = 24.0   # dosing interval


class PKSolver:
    """Deterministic PK concentration computations."""

    @staticmethod
    def single_dose_oral(p: PKParams, t: np.ndarray) -> np.ndarray:
        """Concentration-time curve after a single oral dose.
        C(t) = (F·Dose·ka) / (Vd·(ka-ke)) · (e^{-ke·t} - e^{-ka·t})
        """
        coeff = (p.bioavailability * p.dose_mg * p.ka_per_hr) / (
            p.vd_l * (p.ka_per_hr - p.ke_per_hr)
        )
        return coeff * (np.exp(-p.ke_per_hr * t) - np.exp(-p.ka_per_hr * t))

    @staticmethod
    def single_dose_iv(p: PKParams, t: np.ndarray) -> np.ndarray:
        """Concentration after IV bolus: C(t) = (Dose/Vd)·e^{-ke·t}"""
        return (p.dose_mg / p.vd_l) * np.exp(-p.ke_per_hr * t)

    @staticmethod
    def steady_state_trough_oral(p: PKParams) -> float:
        """Css_trough at steady state for oral dosing."""
        coeff = (p.bioavailability * p.dose_mg * p.ka_per_hr) / (
            p.vd_l * (p.ka_per_hr - p.ke_per_hr)
        )
        term_ke = np.exp(-p.ke_per_hr * p.tau_hr) / (1 - np.exp(-p.ke_per_hr * p.tau_hr))
        term_ka = np.exp(-p.ka_per_hr * p.tau_hr) / (1 - np.exp(-p.ka_per_hr * p.tau_hr))
        return float(coeff * (term_ke - term_ka))

    @staticmethod
    def steady_state_trough_iv(p: PKParams) -> float:
        """Css_trough at steady state for IV bolus."""
        return float(
            (p.dose_mg / p.vd_l) * np.exp(-p.ke_per_hr * p.tau_hr)
            / (1 - np.exp(-p.ke_per_hr * p.tau_hr))
        )

    @staticmethod
    def concentration_curve(p: PKParams, t: np.ndarray) -> np.ndarray:
        """Route-dispatched single-dose concentration."""
        if p.route == "iv":
            return PKSolver.single_dose_iv(p, t)
        return PKSolver.single_dose_oral(p, t)

    @staticmethod
    def steady_state_trough(p: PKParams) -> float:
        if p.route == "iv":
            return PKSolver.steady_state_trough_iv(p)
        return PKSolver.steady_state_trough_oral(p)

    @staticmethod
    def apply_iiv(
        pop_value: float, omega: float, rng: np.random.Generator | None = None,
    ) -> float:
        """Individual parameter: θ_i = θ_pop · exp(η), η ~ N(0, ω²)."""
        rng = rng or np.random.default_rng()
        eta = rng.normal(0, omega)
        return pop_value * np.exp(eta)

    @staticmethod
    def multi_dose_oral(p: PKParams, t: np.ndarray, n_doses: int) -> np.ndarray:
        """Superposition of n doses given at intervals τ."""
        C = np.zeros_like(t)
        for k in range(n_doses):
            t_shifted = t - k * p.tau_hr
            mask = t_shifted >= 0
            C[mask] += PKSolver.single_dose_oral(p, t_shifted[mask])
        return C
