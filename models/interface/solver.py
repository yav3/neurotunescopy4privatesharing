"""Unified solver — routes Problems to the appropriate math_core solver
and returns structured Answers.

This is the primary interface: pose a problem, get an answer.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from models.interface.problem import Problem, ProblemType, Answer
from models.math_core.pk_solver import PKSolver, PKParams
from models.math_core.pd_solver import PDSolver, PDParams
from models.math_core.progression_solver import (
    ProgressionSolver, LinearProgressionParams, EpisodicParams, EventParams,
)
from models.math_core.vade_geometry import VADEGeometry
from models.math_core.spectral import SpectralSolver


SCHEMA_DIR = Path(__file__).resolve().parent.parent.parent / "synthetic_data" / "schemas"


class UnifiedSolver:
    """Route any Problem to the correct exact solver."""

    def __init__(self):
        self._drug_db = self._load_drugs()

    def _load_drugs(self) -> dict:
        path = SCHEMA_DIR / "drug_parameters.json"
        if path.exists():
            with open(path) as f:
                data = json.load(f)
            return data.get("drugs", {})
        return {}

    def solve(self, problem: Problem) -> Answer:
        dispatch = {
            ProblemType.PK_CONCENTRATION: self._pk_concentration,
            ProblemType.PK_STEADY_STATE: self._pk_steady_state,
            ProblemType.PK_MULTI_DOSE: self._pk_multi_dose,
            ProblemType.PD_EFFECT: self._pd_effect,
            ProblemType.PD_BIOMARKER: self._pd_biomarker,
            ProblemType.PD_INVERSE: self._pd_inverse,
            ProblemType.PKPD_TRAJECTORY: self._pkpd_trajectory,
            ProblemType.PROGRESSION_LINEAR: self._progression_linear,
            ProblemType.PROGRESSION_EPISODIC: self._progression_episodic,
            ProblemType.VADE_PROJECT: self._vade_project,
            ProblemType.VADE_GEODESIC: self._vade_geodesic,
            ProblemType.VADE_TRAJECTORY: self._vade_trajectory,
            ProblemType.VADE_SCHEDULE: self._vade_schedule,
            ProblemType.SPECTRAL_BAND_POWER: self._spectral_band_power,
            ProblemType.SPECTRAL_ENTROPY: self._spectral_entropy,
            ProblemType.SPECTRAL_THERAPEUTIC: self._spectral_therapeutic,
            ProblemType.BINAURAL_BEAT: self._binaural_beat,
        }
        fn = dispatch.get(problem.type)
        if fn is None:
            raise ValueError(f"No solver for {problem.type}")
        return fn(problem)

    # ── PK ────────────────────────────────────────────────────────────

    def _build_pk_params(self, p: Problem) -> PKParams:
        drug_name = p.params.get("drug", "")
        drug = self._drug_db.get(drug_name, {})
        pk = drug.get("pk_parameters", {})
        weight = p.params.get("weight_kg", pk.get("typical_body_weight_kg", 70))
        dose = p.params.get("dose_mg", drug.get("dosing", {}).get("amount_mg", 10))
        route = drug.get("route", p.params.get("route", "oral"))
        freq = drug.get("dosing", {}).get("doses_per_day", 1)
        tau = 24.0 / freq if freq > 0 else 24.0

        return PKParams(
            ka_per_hr=pk.get("ka_per_hr", 0.5),
            ke_per_hr=pk.get("ke_per_hr", 0.01),
            vd_l=pk.get("vd_l_per_kg", 10.0) * weight,
            bioavailability=pk.get("bioavailability", 1.0),
            dose_mg=dose,
            route=route,
            tau_hr=tau,
        )

    def _pk_concentration(self, p: Problem) -> Answer:
        pk = self._build_pk_params(p)
        t = np.array([p.query.get("time_hr", 24.0)])
        C = PKSolver.concentration_curve(pk, t)
        return Answer(
            values={"concentration_ng_ml": float(C[0])},
            problem_type=p.type,
        )

    def _pk_steady_state(self, p: Problem) -> Answer:
        pk = self._build_pk_params(p)
        css = PKSolver.steady_state_trough(pk)
        return Answer(
            values={"trough_ng_ml": css},
            problem_type=p.type,
        )

    def _pk_multi_dose(self, p: Problem) -> Answer:
        pk = self._build_pk_params(p)
        t_max = p.query.get("duration_hr", 168.0)
        n_doses = p.query.get("n_doses", int(t_max / pk.tau_hr) + 1)
        t = np.linspace(0, t_max, 500)
        C = PKSolver.multi_dose_oral(pk, t, n_doses)
        return Answer(
            values={
                "time_hr": t, "concentration_ng_ml": C,
                "peak_ng_ml": float(np.max(C)),
                "trough_ng_ml": float(C[-1]),
            },
            problem_type=p.type,
        )

    # ── PD ────────────────────────────────────────────────────────────

    def _build_pd_params(self, p: Problem) -> PDParams:
        drug = self._drug_db.get(p.params.get("drug", ""), {})
        pd = drug.get("pd_parameters", {})
        return PDParams(
            emax=pd.get("emax", 1.0),
            ec50_ng_ml=pd.get("ec50_ng_ml", 10.0),
            hill=pd.get("hill_coefficient", 1.0),
            direction=drug.get("pd_direction", "increase"),
            baseline=p.params.get("baseline", 0.0),
        )

    def _pd_effect(self, p: Problem) -> Answer:
        pd = self._build_pd_params(p)
        C = np.array([p.query.get("concentration_ng_ml", 10.0)])
        E = PDSolver.effect(C, pd)
        return Answer(values={"effect": float(E[0])}, problem_type=p.type)

    def _pd_biomarker(self, p: Problem) -> Answer:
        pd = self._build_pd_params(p)
        C = np.array([p.query.get("concentration_ng_ml", 10.0)])
        B = PDSolver.biomarker_response(C, pd)
        return Answer(values={"biomarker": float(B[0])}, problem_type=p.type)

    def _pd_inverse(self, p: Problem) -> Answer:
        pd = self._build_pd_params(p)
        target = p.query.get("target_effect", 1.0)
        C = PDSolver.inverse_effect(target, pd)
        return Answer(values={"required_concentration_ng_ml": C}, problem_type=p.type)

    def _pkpd_trajectory(self, p: Problem) -> Answer:
        pk = self._build_pk_params(p)
        pd = self._build_pd_params(p)
        t_max = p.query.get("duration_hr", 168.0)
        n_doses = p.query.get("n_doses", 7)
        t = np.linspace(0, t_max, 500)
        result = PDSolver.pkpd_trajectory(pk, pd, t, n_doses)
        return Answer(values=result, problem_type=p.type)

    # ── Progression ───────────────────────────────────────────────────

    def _progression_linear(self, p: Problem) -> Answer:
        params = LinearProgressionParams(
            baseline=p.params.get("baseline", 29.0),
            annual_rate=p.params.get("annual_rate", -2.5),
            rate_std=p.params.get("rate_std", 1.0),
            noise_std=p.params.get("noise_std", 0.5),
        )
        months = np.arange(0, p.query.get("months", 60) + 1, p.query.get("interval", 6))
        trajectory = ProgressionSolver.linear_trajectory(params, months)
        return Answer(
            values={"time_months": months, "values": trajectory},
            problem_type=p.type,
        )

    def _progression_episodic(self, p: Problem) -> Answer:
        params = EpisodicParams(
            relapse_prob_per_year=p.params.get("relapse_prob", 0.5),
            mean_episode_months=p.params.get("episode_months", 6),
            std_episode_months=p.params.get("episode_std", 3),
            remission_target=p.params.get("remission_target", 6.0),
            episode_target=p.params.get("episode_target", 22.0),
        )
        months = np.arange(0, p.query.get("months", 48) + 1)
        trajectory = ProgressionSolver.episodic_trajectory(params, months)
        return Answer(
            values={"time_months": months, "values": trajectory},
            problem_type=p.type,
        )

    # ── VADE ──────────────────────────────────────────────────────────

    def _vade_project(self, p: Problem) -> Answer:
        X = np.array(p.params.get("features", [[0.5, 0.3, 0.7, 0.4, 0.6]]))
        if X.ndim == 1:
            X = X.reshape(1, -1)
        d = X.shape[1]
        W = np.array(p.params.get("W", np.eye(4, d)))
        b = np.array(p.params.get("b", np.zeros(4)))
        projected = VADEGeometry.project_to_vade(X, W, b)
        valid = VADEGeometry.check_valence_constraint(projected)
        return Answer(
            values={"vade_point": projected, "constraint_satisfied": valid},
            problem_type=p.type,
        )

    def _vade_geodesic(self, p: Problem) -> Answer:
        p_pt = np.array(p.params["point"])
        q_pt = np.array(p.query["target"])
        d = VADEGeometry.geodesic_distance(p_pt, q_pt)
        return Answer(values={"geodesic_distance": float(d)}, problem_type=p.type)

    def _vade_trajectory(self, p: Problem) -> Answer:
        start = np.array(p.params["start"])
        target = np.array(p.params["target"])
        n = p.query.get("n_phases", 5)
        traj = VADEGeometry.session_trajectory(start, target, n)
        return Answer(values={"trajectory": traj}, problem_type=p.type)

    def _vade_schedule(self, p: Problem) -> Answer:
        base = p.params.get("base_minutes", 5.0)
        max_dur = p.params.get("max_duration", 90.0)
        sched = VADEGeometry.fibonacci_schedule(base, max_dur)
        return Answer(
            values={"phases_minutes": np.array(sched), "total_minutes": sum(sched)},
            problem_type=p.type,
        )

    # ── Spectral ──────────────────────────────────────────────────────

    def _spectral_band_power(self, p: Problem) -> Answer:
        psd = np.array(p.params["psd"])
        freqs = np.array(p.params["freqs"])
        powers = SpectralSolver.all_band_powers(psd, freqs)
        powers["theta_alpha_ratio"] = SpectralSolver.theta_alpha_ratio(powers)
        return Answer(values=powers, problem_type=p.type)

    def _spectral_entropy(self, p: Problem) -> Answer:
        psd = np.array(p.params["psd"])
        H = SpectralSolver.spectral_entropy(psd)
        return Answer(values={"entropy": H}, problem_type=p.type)

    def _spectral_therapeutic(self, p: Problem) -> Answer:
        powers = p.params.get("powers", {})
        goal = p.query.get("goal", "relaxation")
        score = SpectralSolver.therapeutic_score(powers, goal)
        return Answer(values={"score": score, "goal": goal}, problem_type=p.type)

    def _binaural_beat(self, p: Problem) -> Answer:
        band = p.query.get("target_band", "alpha")
        f_left, f_right, f_beat = SpectralSolver.binaural_beat_frequency(band)
        return Answer(
            values={"f_left_hz": f_left, "f_right_hz": f_right, "f_beat_hz": f_beat},
            problem_type=p.type,
        )
