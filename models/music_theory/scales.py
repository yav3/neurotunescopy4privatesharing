"""Musical scales: definitions, construction, detection.

Covers major/minor, all modes, pentatonic, blues, whole-tone, diminished,
chromatic, and exotic scales. Pure music theory — no ML, no medical code.
"""
from __future__ import annotations

from dataclasses import dataclass

from models.music_theory.intervals import PITCH_CLASSES, normalize_note, note_to_index

# ---------------------------------------------------------------------------
# Scale interval patterns (cumulative semitones from root)
# ---------------------------------------------------------------------------

SCALE_INTERVALS: dict[str, list[int]] = {
    # Diatonic modes
    "major":       [0, 2, 4, 5, 7, 9, 11],
    "ionian":      [0, 2, 4, 5, 7, 9, 11],
    "dorian":      [0, 2, 3, 5, 7, 9, 10],
    "phrygian":    [0, 1, 3, 5, 7, 8, 10],
    "lydian":      [0, 2, 4, 6, 7, 9, 11],
    "mixolydian":  [0, 2, 4, 5, 7, 9, 10],
    "aeolian":     [0, 2, 3, 5, 7, 8, 10],
    "natural_minor": [0, 2, 3, 5, 7, 8, 10],
    "locrian":     [0, 1, 3, 5, 6, 8, 10],

    # Harmonic / melodic minor
    "harmonic_minor": [0, 2, 3, 5, 7, 8, 11],
    "melodic_minor":  [0, 2, 3, 5, 7, 9, 11],

    # Pentatonic
    "pentatonic_major": [0, 2, 4, 7, 9],
    "pentatonic_minor": [0, 3, 5, 7, 10],

    # Blues
    "blues":       [0, 3, 5, 6, 7, 10],
    "blues_major": [0, 2, 3, 4, 7, 9],

    # Symmetric
    "whole_tone":          [0, 2, 4, 6, 8, 10],
    "chromatic":           list(range(12)),
    "diminished_hw":       [0, 1, 3, 4, 6, 7, 9, 10],  # half-whole
    "diminished_wh":       [0, 2, 3, 5, 6, 8, 9, 11],  # whole-half

    # Exotic
    "hungarian_minor":     [0, 2, 3, 6, 7, 8, 11],
    "double_harmonic":     [0, 1, 4, 5, 7, 8, 11],
    "neapolitan_major":    [0, 1, 3, 5, 7, 9, 11],
    "neapolitan_minor":    [0, 1, 3, 5, 7, 8, 11],

    # Bebop
    "bebop_major":    [0, 2, 4, 5, 7, 8, 9, 11],
    "bebop_dominant": [0, 2, 4, 5, 7, 9, 10, 11],
}

ALL_SCALE_TYPES: list[str] = list(SCALE_INTERVALS.keys())


@dataclass(frozen=True)
class Scale:
    root: str
    scale_type: str
    notes: tuple[str, ...]
    intervals: tuple[int, ...]


def get_scale(root: str, scale_type: str = "major") -> Scale:
    """Construct a scale from a root note and scale type name."""
    root = normalize_note(root)
    st = scale_type.lower().replace(" ", "_").replace("-", "_")
    if st not in SCALE_INTERVALS:
        raise ValueError(f"Unknown scale type: {scale_type!r}")
    intervals = SCALE_INTERVALS[st]
    root_idx = note_to_index(root)
    notes = tuple(PITCH_CLASSES[(root_idx + i) % 12] for i in intervals)
    return Scale(root=root, scale_type=st, notes=notes, intervals=tuple(intervals))


def get_relative_minor(major_key: str) -> str:
    """Return the relative minor root for a given major key (down 3 semitones)."""
    idx = note_to_index(major_key)
    return PITCH_CLASSES[(idx - 3) % 12]


def get_relative_major(minor_key: str) -> str:
    """Return the relative major root for a given minor key (up 3 semitones)."""
    idx = note_to_index(minor_key)
    return PITCH_CLASSES[(idx + 3) % 12]


def get_parallel_key(key: str, mode: str = "major") -> str:
    """Return the parallel key (same root, opposite mode). Just returns the root."""
    return normalize_note(key)


def scale_degree_to_note(root: str, scale_type: str, degree: int) -> str:
    """Return the note at a 1-based scale degree (wraps via octave)."""
    scale = get_scale(root, scale_type)
    if degree < 1:
        raise ValueError("Degree must be >= 1")
    idx = (degree - 1) % len(scale.notes)
    return scale.notes[idx]


def detect_scale_from_notes(
    notes: list[str],
) -> list[tuple[str, str, float]]:
    """Rank-order (root, scale_type, match_score) for a bag of notes.

    Score = |intersection| / |union| (Jaccard similarity on pitch-class sets).
    """
    if not notes:
        return []

    input_pcs: set[int] = {note_to_index(n) for n in notes}
    results: list[tuple[str, str, float]] = []

    for root_idx in range(12):
        root_name = PITCH_CLASSES[root_idx]
        for st, intervals in SCALE_INTERVALS.items():
            if st in ("ionian", "aeolian"):
                continue  # skip aliases to avoid duplicates
            scale_pcs = {(root_idx + i) % 12 for i in intervals}
            intersection = len(input_pcs & scale_pcs)
            union = len(input_pcs | scale_pcs)
            if union == 0:
                continue
            score = intersection / union
            results.append((root_name, st, score))

    results.sort(key=lambda x: -x[2])
    return results
