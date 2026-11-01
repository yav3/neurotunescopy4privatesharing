from __future__ import annotations

from dataclasses import dataclass

from models.music_theory.scales import CHROMATIC_NOTES, ENHARMONIC_MAP


@dataclass(frozen=True)
class Interval:
    semitones: int
    quality: str
    number: str
    consonance_score: float


INTERVAL_TABLE: dict[int, Interval] = {
    0:  Interval(0,  "perfect",    "unison",         1.00),
    1:  Interval(1,  "minor",      "2nd",            0.10),
    2:  Interval(2,  "major",      "2nd",            0.20),
    3:  Interval(3,  "minor",      "3rd",            0.80),
    4:  Interval(4,  "major",      "3rd",            0.85),
    5:  Interval(5,  "perfect",    "4th",            0.90),
    6:  Interval(6,  "augmented",  "4th/diminished 5th", 0.15),
    7:  Interval(7,  "perfect",    "5th",            0.95),
    8:  Interval(8,  "minor",      "6th",            0.75),
    9:  Interval(9,  "major",      "6th",            0.80),
    10: Interval(10, "minor",      "7th",            0.30),
    11: Interval(11, "major",      "7th",            0.25),
    12: Interval(12, "perfect",    "octave",         1.00),
}

CONSONANCE_THRESHOLD = 0.60


def _note_index(note: str) -> int:
    if note in ENHARMONIC_MAP and note not in CHROMATIC_NOTES:
        note = ENHARMONIC_MAP[note]
    return CHROMATIC_NOTES.index(note)


class IntervalCalculator:

    @staticmethod
    def note_to_midi(note: str, octave: int = 4) -> int:
        return _note_index(note) + 12 * (octave + 1)

    @staticmethod
    def midi_to_note(midi: int) -> tuple[str, int]:
        octave = (midi // 12) - 1
        idx = midi % 12
        return CHROMATIC_NOTES[idx], octave

    @staticmethod
    def interval_between(note1: str, note2: str) -> Interval:
        i1 = _note_index(note1)
        i2 = _note_index(note2)
        semitones = (i2 - i1) % 12
        return INTERVAL_TABLE[semitones]

    @staticmethod
    def transpose(note: str, semitones: int) -> str:
        idx = _note_index(note)
        return CHROMATIC_NOTES[(idx + semitones) % 12]

    @staticmethod
    def invert(interval: Interval) -> Interval:
        inv_semi = (12 - interval.semitones) % 12
        return INTERVAL_TABLE[inv_semi]

    @staticmethod
    def is_consonant(interval: Interval) -> bool:
        return interval.consonance_score >= CONSONANCE_THRESHOLD

    @staticmethod
    def consonance_ranking() -> list[Interval]:
        return sorted(INTERVAL_TABLE.values(), key=lambda i: -i.consonance_score)
