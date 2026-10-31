"""4-D VADE Geometry on S³ (three-sphere).

From the drafted patent:

    P_VADE = W_proxy · X + b     (affine projection to ℝ⁴)
    P_norm = P_VADE / ‖P_VADE‖   (project onto S³)

VADE dimensions: Valence, Arousal, Dominance, Engagement (or Energy).

Geodesic distance on S³:
    d(p, q) = arccos(p · q)      (for unit vectors p, q ∈ S³)

Constraints:
    V ≥ 1.6 · A                   (valence dominates arousal)
    BPM ∈ [46, 186]

Fibonacci-constrained dosing:
    Session durations drawn from Fibonacci sequence scaled by base unit.
    Fib = {1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ...} × base_minutes
"""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass


FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]


@dataclass
class VADEPoint:
    """A point in 4-D VADE space (pre-normalization)."""
    valence: float
    arousal: float
    dominance: float
    engagement: float

    def to_array(self) -> np.ndarray:
        return np.array([self.valence, self.arousal, self.dominance, self.engagement])

    @classmethod
    def from_array(cls, arr: np.ndarray) -> "VADEPoint":
        return cls(*arr[:4])


class VADEGeometry:
    """Operations on the S³ VADE manifold."""

    @staticmethod
    def project_to_vade(
        features: np.ndarray,
        W: np.ndarray,
        b: np.ndarray,
    ) -> np.ndarray:
        """P_VADE = W · X + b, then normalize to S³.

        Args:
            features: (N, d) input feature matrix
            W: (4, d) projection weight matrix
            b: (4,) bias vector
        Returns:
            (N, 4) points on S³
        """
        raw = features @ W.T + b
        norms = np.linalg.norm(raw, axis=1, keepdims=True)
        norms = np.maximum(norms, 1e-8)
        return raw / norms

    @staticmethod
    def geodesic_distance(p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """d(p, q) = arccos(p · q) on S³.

        Args:
            p: (N, 4) or (4,) — points on S³
            q: (M, 4) or (4,) — target points on S³
        Returns:
            Pairwise geodesic distances.
        """
        dot = np.clip(np.sum(p * q, axis=-1), -1.0, 1.0)
        return np.arccos(dot)

    @staticmethod
    def geodesic_distance_matrix(points: np.ndarray, targets: np.ndarray) -> np.ndarray:
        """Full pairwise geodesic distance matrix.

        Args:
            points: (N, 4)
            targets: (M, 4)
        Returns:
            (N, M) distance matrix
        """
        dot = np.clip(points @ targets.T, -1.0, 1.0)
        return np.arccos(dot)

    @staticmethod
    def check_valence_constraint(vade: np.ndarray, ratio: float = 1.6) -> np.ndarray:
        """V ≥ ratio · A constraint. Returns boolean mask."""
        return vade[..., 0] >= ratio * vade[..., 1]

    @staticmethod
    def check_bpm_constraint(bpm: np.ndarray, lo: float = 46, hi: float = 186) -> np.ndarray:
        return (bpm >= lo) & (bpm <= hi)

    @staticmethod
    def fibonacci_schedule(
        base_minutes: float = 5.0,
        max_duration_minutes: float = 90.0,
    ) -> list[float]:
        """Generate Fibonacci-constrained session phase durations.
        Each phase duration = fib_i × base_minutes, until total ≤ max.
        """
        schedule = []
        total = 0.0
        for f in FIBONACCI:
            dur = f * base_minutes
            if total + dur > max_duration_minutes:
                break
            schedule.append(dur)
            total += dur
        return schedule

    @staticmethod
    def interpolate_geodesic(
        p: np.ndarray, q: np.ndarray, t: float,
    ) -> np.ndarray:
        """Spherical linear interpolation (slerp) on S³.

        slerp(p, q, t) = sin((1-t)·Ω)/sin(Ω) · p + sin(t·Ω)/sin(Ω) · q
        where Ω = arccos(p·q)
        """
        dot = np.clip(np.dot(p, q), -1.0, 1.0)
        omega = np.arccos(dot)
        if abs(omega) < 1e-8:
            return p
        sin_omega = np.sin(omega)
        return (np.sin((1 - t) * omega) / sin_omega) * p + (np.sin(t * omega) / sin_omega) * q

    @staticmethod
    def session_trajectory(
        start: np.ndarray,
        target: np.ndarray,
        n_phases: int,
    ) -> np.ndarray:
        """Generate a geodesic trajectory on S³ from start → target
        with n_phases intermediate waypoints (slerp)."""
        t_values = np.linspace(0, 1, n_phases + 2)
        trajectory = np.array([
            VADEGeometry.interpolate_geodesic(start, target, t)
            for t in t_values
        ])
        return trajectory
