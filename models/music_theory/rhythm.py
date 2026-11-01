"""Rhythm: time signatures, patterns, syncopation, groove complexity.

Pure music theory — no ML, no medical code.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Time signatures
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class TimeSignature:
    numerator: int
    denominator: int

    @property
    def is_compound(self) -> bool:
        return self.numerator >= 6 and self.numerator % 3 == 0

    @property
    def is_simple(self) -> bool:
        return not self.is_compound

    @property
    def beat_unit(self) -> float:
        if self.is_compound:
            return 3.0 / self.denominator
        return 1.0 / self.denominator

    @property
    def beats_per_measure(self) -> int:
        if self.is_compound:
            return self.numerator // 3
        return self.numerator


COMMON_TIME_SIGNATURES: dict[str, TimeSignature] = {
    "4/4":  TimeSignature(4, 4),
    "3/4":  TimeSignature(3, 4),
    "2/4":  TimeSignature(2, 4),
    "2/2":  TimeSignature(2, 2),
    "6/8":  TimeSignature(6, 8),
    "9/8":  TimeSignature(9, 8),
    "12/8": TimeSignature(12, 8),
    "5/4":  TimeSignature(5, 4),
    "7/8":  TimeSignature(7, 8),
    "3/8":  TimeSignature(3, 8),
}


# ---------------------------------------------------------------------------
# Rhythm patterns
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class RhythmPattern:
    name: str
    onsets: tuple[float, ...]
    duration_beats: float


COMMON_PATTERNS: dict[str, RhythmPattern] = {
    "four_on_floor": RhythmPattern("four_on_floor", (0.0, 1.0, 2.0, 3.0), 4.0),
    "backbeat":      RhythmPattern("backbeat", (1.0, 3.0), 4.0),
    "bossa_nova":    RhythmPattern("bossa_nova", (0.0, 0.75, 1.5, 2.0, 3.0, 3.5), 4.0),
    "reggaeton":     RhythmPattern("reggaeton", (0.0, 0.75, 1.0, 1.75, 2.0, 2.75, 3.0, 3.75), 4.0),
    "waltz":         RhythmPattern("waltz", (0.0, 1.0, 2.0), 3.0),
    "swing":         RhythmPattern("swing", (0.0, 0.67, 1.0, 1.67, 2.0, 2.67, 3.0, 3.67), 4.0),
    "shuffle":       RhythmPattern("shuffle", (0.0, 0.67, 1.0, 1.67, 2.0, 2.67, 3.0, 3.67), 4.0),
    "clave_3_2":     RhythmPattern("clave_3_2", (0.0, 0.75, 1.5, 2.5, 3.0), 4.0),
    "clave_2_3":     RhythmPattern("clave_2_3", (0.0, 1.0, 1.5, 2.5, 3.25), 4.0),
    "tresillo":      RhythmPattern("tresillo", (0.0, 0.75, 1.5), 2.0),
}


def pattern_similarity(p1: RhythmPattern, p2: RhythmPattern) -> float:
    """Onset-overlap similarity in [0, 1] using a tolerance window.

    Normalizes both patterns to the same duration, then counts matches
    within ±0.125 beats.
    """
    if not p1.onsets or not p2.onsets:
        return 0.0

    tol = 0.125
    scale = p1.duration_beats / p2.duration_beats if p2.duration_beats else 1.0
    p2_scaled = [o * scale for o in p2.onsets]

    matches = 0
    used: set[int] = set()
    for o1 in p1.onsets:
        for j, o2 in enumerate(p2_scaled):
            if j not in used and abs(o1 - o2) <= tol:
                matches += 1
                used.add(j)
                break

    union = len(p1.onsets) + len(p2.onsets) - matches
    return matches / union if union > 0 else 0.0


def _strong_beat_positions(ts: TimeSignature) -> list[float]:
    """Return the strong-beat positions for a time signature (0-indexed within a bar)."""
    beats = ts.beats_per_measure
    if ts.is_compound:
        return [float(i) * 3.0 / ts.denominator * 4 for i in range(beats)]
    positions: list[float] = []
    for i in range(ts.numerator):
        beat_val = float(i)
        if i == 0:
            positions.append(beat_val)
        elif ts.numerator == 4 and i == 2:
            positions.append(beat_val)
        elif ts.numerator == 3 and i == 0:
            positions.append(beat_val)
        elif i % 2 == 0:
            positions.append(beat_val)
    if not positions:
        positions = [0.0]
    return positions


def syncopation_score(
    pattern: RhythmPattern,
    time_sig: TimeSignature,
) -> float:
    """Proportion of onsets on weak beats (not within ±0.125 of a strong beat)."""
    if not pattern.onsets:
        return 0.0

    strong = _strong_beat_positions(time_sig)
    tol = 0.125
    weak_count = 0

    for onset in pattern.onsets:
        is_strong = any(abs(onset - s) <= tol for s in strong)
        if not is_strong:
            weak_count += 1

    return weak_count / len(pattern.onsets)


def groove_complexity(pattern: RhythmPattern) -> float:
    """Complexity in [0, 1] from syncopation density + subdivision variety.

    Uses 4/4 as reference meter.
    """
    if not pattern.onsets:
        return 0.0

    ts_44 = TimeSignature(4, 4)
    sync = syncopation_score(pattern, ts_44)

    subdivisions: set[float] = set()
    for onset in pattern.onsets:
        frac = onset - math.floor(onset)
        subdivisions.add(round(frac, 3))

    subdiv_variety = min(len(subdivisions) / 6.0, 1.0)
    density = min(len(pattern.onsets) / pattern.duration_beats / 4.0, 1.0)

    return round(0.4 * sync + 0.3 * subdiv_variety + 0.3 * density, 4)


def bpm_to_ms(bpm: float, subdivision: float = 1.0) -> float:
    """Milliseconds per beat (or per subdivision of a beat).

    subdivision=1 → quarter note at given BPM.
    subdivision=2 → eighth note, etc.
    """
    if bpm <= 0:
        raise ValueError("BPM must be positive")
    return 60_000.0 / (bpm * subdivision)
