"""Music intervals: semitone distances, naming, consonance scoring.

Pure music theory — no audio processing, no ML, no medical/therapeutic code.
"""
from __future__ import annotations

PITCH_CLASSES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

ENHARMONIC_MAP: dict[str, str] = {
    "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#",
    "Bb": "A#", "Cb": "B", "B#": "C", "E#": "F",
    "C##": "D", "D##": "E", "F##": "G", "G##": "A", "A##": "B",
    "Dbb": "C", "Ebb": "D", "Fbb": "E", "Gbb": "F", "Abb": "G", "Bbb": "A",
}

INTERVAL_NAMES: dict[int, str] = {
    0: "P1", 1: "m2", 2: "M2", 3: "m3", 4: "M3", 5: "P4",
    6: "A4/d5", 7: "P5", 8: "m6", 9: "M6", 10: "m7", 11: "M7", 12: "P8",
}

CONSONANCE_SCORES: dict[int, float] = {
    0: 1.0,   # P1
    1: 0.2,   # m2
    2: 0.4,   # M2
    3: 0.7,   # m3
    4: 0.75,  # M3
    5: 0.8,   # P4
    6: 0.1,   # A4/d5 (tritone)
    7: 0.9,   # P5
    8: 0.6,   # m6
    9: 0.65,  # M6
    10: 0.35, # m7
    11: 0.15, # M7
    12: 0.95, # P8
}


def normalize_note(note: str) -> str:
    """Normalize a note name to its canonical sharp-based pitch class."""
    note = note.strip()
    if note in PITCH_CLASSES:
        return note
    if note in ENHARMONIC_MAP:
        return ENHARMONIC_MAP[note]
    raise ValueError(f"Unknown note: {note!r}")


def note_to_index(note: str) -> int:
    """Return chromatic index 0–11 for a note name."""
    return PITCH_CLASSES.index(normalize_note(note))


def interval_between(note1: str, note2: str) -> int:
    """Semitone distance from note1 up to note2 (mod 12, range 0–11)."""
    return (note_to_index(note2) - note_to_index(note1)) % 12


def interval_name(semitones: int) -> str:
    """Name of an interval given its semitone distance."""
    s = semitones % 12
    return INTERVAL_NAMES.get(s, f"?{s}")


def consonance_score(note1: str, note2: str) -> float:
    """Consonance of the interval between two notes, in [0, 1]."""
    s = interval_between(note1, note2)
    return CONSONANCE_SCORES.get(s, 0.0)


def melodic_tension(note_sequence: list[str]) -> float:
    """Average dissonance (1 − consonance) across consecutive intervals.

    Returns 0.0 for sequences shorter than 2 notes.
    """
    if len(note_sequence) < 2:
        return 0.0
    total = 0.0
    for i in range(len(note_sequence) - 1):
        total += 1.0 - consonance_score(note_sequence[i], note_sequence[i + 1])
    return total / (len(note_sequence) - 1)
