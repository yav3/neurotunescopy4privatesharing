from __future__ import annotations

from dataclasses import dataclass


CHROMATIC_NOTES: tuple[str, ...] = (
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
)

ENHARMONIC_MAP: dict[str, str] = {
    "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#",
    "Bb": "A#", "Cb": "B", "E#": "F", "B#": "C",
    "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb",
}

SCALE_INTERVALS: dict[str, tuple[int, ...]] = {
    "major":             (0, 2, 4, 5, 7, 9, 11),
    "natural_minor":     (0, 2, 3, 5, 7, 8, 10),
    "harmonic_minor":    (0, 2, 3, 5, 7, 8, 11),
    "melodic_minor":     (0, 2, 3, 5, 7, 9, 11),
    "dorian":            (0, 2, 3, 5, 7, 9, 10),
    "phrygian":          (0, 1, 3, 5, 7, 8, 10),
    "lydian":            (0, 2, 4, 6, 7, 9, 11),
    "mixolydian":        (0, 2, 4, 5, 7, 9, 10),
    "aeolian":           (0, 2, 3, 5, 7, 8, 10),
    "locrian":           (0, 1, 3, 5, 6, 8, 10),
    "pentatonic_major":  (0, 2, 4, 7, 9),
    "pentatonic_minor":  (0, 3, 5, 7, 10),
    "blues":             (0, 3, 5, 6, 7, 10),
    "whole_tone":        (0, 2, 4, 6, 8, 10),
    "diminished":        (0, 1, 3, 4, 6, 7, 9, 10),
    "chromatic":         tuple(range(12)),
}

KEY_SIGNATURES: dict[str, int] = {
    "C": 0, "G": 1, "D": 2, "A": 3, "E": 4, "B": 5, "F#": 6,
    "F": -1, "Bb": -2, "Eb": -3, "Ab": -4, "Db": -5, "Gb": -6,
}

CHURCH_MODES: tuple[str, ...] = (
    "major", "dorian", "phrygian", "lydian",
    "mixolydian", "aeolian", "locrian",
)


@dataclass(frozen=True)
class Scale:
    root: str
    scale_type: str
    intervals: tuple[int, ...]
    notes: tuple[str, ...]


def _note_index(note: str) -> int:
    if note in ENHARMONIC_MAP and note not in CHROMATIC_NOTES:
        note = ENHARMONIC_MAP[note]
    return CHROMATIC_NOTES.index(note)


def _build_notes(root: str, intervals: tuple[int, ...]) -> tuple[str, ...]:
    root_idx = _note_index(root)
    return tuple(CHROMATIC_NOTES[(root_idx + i) % 12] for i in intervals)


class ScaleLibrary:

    @staticmethod
    def get_scale(root: str, scale_type: str = "major") -> Scale:
        if scale_type not in SCALE_INTERVALS:
            raise ValueError(f"Unknown scale type: {scale_type}")
        intervals = SCALE_INTERVALS[scale_type]
        notes = _build_notes(root, intervals)
        return Scale(root=root, scale_type=scale_type, intervals=intervals, notes=notes)

    @staticmethod
    def all_scales() -> list[Scale]:
        result: list[Scale] = []
        for root in CHROMATIC_NOTES:
            for st in SCALE_INTERVALS:
                result.append(ScaleLibrary.get_scale(root, st))
        return result

    @staticmethod
    def get_modes(root: str) -> list[Scale]:
        return [ScaleLibrary.get_scale(root, m) for m in CHURCH_MODES]

    @staticmethod
    def relative_minor(major_key: str) -> str:
        idx = _note_index(major_key)
        return CHROMATIC_NOTES[(idx + 9) % 12]

    @staticmethod
    def relative_major(minor_key: str) -> str:
        idx = _note_index(minor_key)
        return CHROMATIC_NOTES[(idx + 3) % 12]

    @staticmethod
    def parallel_minor(key: str) -> str:
        return key

    @staticmethod
    def parallel_major(key: str) -> str:
        return key

    @staticmethod
    def enharmonic_equivalent(note: str) -> str:
        return ENHARMONIC_MAP.get(note, note)

    @staticmethod
    def key_signature(key: str) -> int:
        canonical = ENHARMONIC_MAP.get(key, key)
        return KEY_SIGNATURES.get(canonical, KEY_SIGNATURES.get(key, 0))
