"""Chord construction, detection, and complexity scoring.

Pure music theory — no ML, no medical code.
"""
from __future__ import annotations

from dataclasses import dataclass

from models.music_theory.intervals import (
    CONSONANCE_SCORES,
    PITCH_CLASSES,
    normalize_note,
    note_to_index,
)

# ---------------------------------------------------------------------------
# Chord type definitions: name → list of semitone offsets from root
# ---------------------------------------------------------------------------

CHORD_TYPES: dict[str, list[int]] = {
    "major":     [0, 4, 7],
    "minor":     [0, 3, 7],
    "dim":       [0, 3, 6],
    "aug":       [0, 4, 8],
    "sus2":      [0, 2, 7],
    "sus4":      [0, 5, 7],
    "dom7":      [0, 4, 7, 10],
    "maj7":      [0, 4, 7, 11],
    "min7":      [0, 3, 7, 10],
    "dim7":      [0, 3, 6, 9],
    "half_dim7": [0, 3, 6, 10],
    "aug7":      [0, 4, 8, 10],
    "min_maj7":  [0, 3, 7, 11],
    "6th":       [0, 4, 7, 9],
    "min6":      [0, 3, 7, 9],
    "add9":      [0, 4, 7, 14],
    "9th":       [0, 4, 7, 10, 14],
    "11th":      [0, 4, 7, 10, 14, 17],
    "13th":      [0, 4, 7, 10, 14, 17, 21],
}

ALL_CHORD_TYPES: list[str] = list(CHORD_TYPES.keys())


@dataclass(frozen=True)
class Chord:
    root: str
    chord_type: str
    notes: tuple[str, ...]
    intervals: tuple[int, ...]


def build_chord(root: str, chord_type: str = "major") -> Chord:
    """Construct a chord from root and type name."""
    root = normalize_note(root)
    ct = chord_type.lower().replace(" ", "_").replace("-", "_")
    if ct not in CHORD_TYPES:
        raise ValueError(f"Unknown chord type: {chord_type!r}")
    intervals = CHORD_TYPES[ct]
    root_idx = note_to_index(root)
    notes = tuple(PITCH_CLASSES[(root_idx + i) % 12] for i in intervals)
    return Chord(root=root, chord_type=ct, notes=notes, intervals=tuple(intervals))


def detect_chord(notes: list[str]) -> list[tuple[str, str, float]]:
    """Rank-order (root, chord_type, score) for a bag of notes.

    Score = |intersection| / |chord_size| penalized by extra notes.
    """
    if not notes:
        return []

    input_pcs: set[int] = {note_to_index(n) for n in notes}
    results: list[tuple[str, str, float]] = []

    for root_idx in range(12):
        root_name = PITCH_CLASSES[root_idx]
        for ct, intervals in CHORD_TYPES.items():
            chord_pcs = {(root_idx + i) % 12 for i in intervals}
            matched = len(input_pcs & chord_pcs)
            if matched == 0:
                continue
            coverage = matched / len(chord_pcs)
            extra_penalty = max(0, len(input_pcs) - len(chord_pcs)) * 0.1
            score = max(0.0, coverage - extra_penalty)
            results.append((root_name, ct, round(score, 4)))

    results.sort(key=lambda x: -x[2])
    return results


def chord_complexity(chord: Chord) -> float:
    """Complexity in [0, 1] based on note count and internal dissonance.

    More notes and more dissonant intervals → higher complexity.
    """
    n = len(chord.notes)
    size_factor = min(n / 7.0, 1.0)

    if n < 2:
        return size_factor

    total_dissonance = 0.0
    pairs = 0
    for i in range(n):
        for j in range(i + 1, n):
            semitones = (chord.intervals[j] - chord.intervals[i]) % 12
            consonance = CONSONANCE_SCORES.get(semitones, 0.5)
            total_dissonance += 1.0 - consonance
            pairs += 1

    avg_dissonance = total_dissonance / pairs if pairs else 0.0
    return round(0.5 * size_factor + 0.5 * avg_dissonance, 4)
