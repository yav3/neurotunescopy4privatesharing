"""Chord progressions: common patterns, realization, tension curves.

Pure music theory — no ML, no medical code.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from models.music_theory.intervals import CONSONANCE_SCORES, note_to_index
from models.music_theory.scales import PITCH_CLASSES, get_scale
from models.music_theory.chords import Chord, build_chord

# ---------------------------------------------------------------------------
# Roman-numeral → scale-degree / quality mapping
# ---------------------------------------------------------------------------

_ROMAN_TO_DEGREE: dict[str, int] = {
    "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7,
    "i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6, "vii": 7,
}

_ROMAN_PATTERN = re.compile(
    r"^(b|#)?(I{1,3}|IV|V?I{0,3}|i{1,3}|iv|v?i{0,3})(7|maj7|dim7|dim|aug|sus2|sus4)?$"
)


def _parse_roman(token: str) -> tuple[int, str, str | None]:
    """Parse a Roman numeral token into (degree_offset_semitones_from_natural, quality, extension).

    Returns (accidental_shift, base_roman_upper, extension).
    """
    m = _ROMAN_PATTERN.match(token)
    if not m:
        raise ValueError(f"Cannot parse Roman numeral: {token!r}")
    accidental, base, ext = m.groups()
    shift = 0
    if accidental == "b":
        shift = -1
    elif accidental == "#":
        shift = 1

    base_upper = base.upper()
    degree = _ROMAN_TO_DEGREE.get(base_upper)
    if degree is None:
        raise ValueError(f"Unknown Roman numeral base: {base!r}")

    is_minor = base[0].islower()
    quality = "minor" if is_minor else "major"

    if ext == "dim" or ext == "dim7":
        quality = "dim" if ext == "dim" else "dim7"
    elif ext == "aug":
        quality = "aug"
    elif ext == "7":
        quality = "min7" if is_minor else "dom7"
    elif ext == "maj7":
        quality = "maj7"
    elif ext == "sus2":
        quality = "sus2"
    elif ext == "sus4":
        quality = "sus4"

    return (degree, shift, quality)


# ---------------------------------------------------------------------------
# Common progressions
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class Progression:
    name: str
    roman_numerals: tuple[str, ...]
    scale_type: str


COMMON_PROGRESSIONS: list[Progression] = [
    Progression("Authentic cadence",  ("I", "IV", "V", "I"), "major"),
    Progression("Pop progression",    ("I", "V", "vi", "IV"), "major"),
    Progression("Jazz cadence",       ("ii", "V", "I"), "major"),
    Progression("50s progression",    ("I", "vi", "IV", "V"), "major"),
    Progression("Axis progression",   ("vi", "IV", "I", "V"), "major"),
    Progression("Major pop alt",      ("I", "IV", "vi", "V"), "major"),
    Progression("Rock progression",   ("I", "bVII", "IV", "I"), "major"),
    Progression("Country",            ("I", "V", "IV", "V"), "major"),
    Progression("Andalusian cadence", ("i", "bVII", "bVI", "V"), "natural_minor"),
    Progression("Rhythm changes",     ("ii", "V", "I", "vi"), "major"),
    Progression("12-bar blues",       ("I", "I", "IV", "IV", "V", "IV", "I", "I"), "major"),
    Progression("Sensitive",          ("I", "iii", "vi", "IV"), "major"),
    Progression("Pachelbel Canon",    ("I", "V", "vi", "iii", "IV", "I", "IV", "V"), "major"),
]


def realize_progression(
    progression: Progression,
    key: str,
    scale_type: str | None = None,
) -> list[Chord]:
    """Convert Roman numerals to concrete chords in a given key."""
    st = scale_type or progression.scale_type
    scale = get_scale(key, st)
    chords: list[Chord] = []

    for rn in progression.roman_numerals:
        degree, shift, quality = _parse_roman(rn)
        idx = degree - 1
        if idx >= len(scale.notes):
            idx = idx % len(scale.notes)
        root_pc = note_to_index(scale.notes[idx])
        root_pc = (root_pc + shift) % 12
        root_name = PITCH_CLASSES[root_pc]
        chords.append(build_chord(root_name, quality))

    return chords


def harmonic_tension_curve(chords: list[Chord]) -> list[float]:
    """Tension value per chord: distance from first chord's root + internal dissonance."""
    if not chords:
        return []

    tonic_idx = note_to_index(chords[0].root)
    tensions: list[float] = []

    for chord in chords:
        root_dist = (note_to_index(chord.root) - tonic_idx) % 12
        tonic_consonance = CONSONANCE_SCORES.get(root_dist, 0.5)
        tonic_tension = 1.0 - tonic_consonance

        n = len(chord.notes)
        internal = 0.0
        if n >= 2:
            pairs = 0
            for i in range(n):
                for j in range(i + 1, n):
                    s = (chord.intervals[j] - chord.intervals[i]) % 12
                    internal += 1.0 - CONSONANCE_SCORES.get(s, 0.5)
                    pairs += 1
            internal /= pairs

        tensions.append(round(0.6 * tonic_tension + 0.4 * internal, 4))

    return tensions


def detect_progression(
    chords: list[Chord],
    key: str,
) -> list[tuple[str, float]]:
    """Match a chord sequence against known progressions; return (name, score) ranked."""
    if not chords:
        return []

    results: list[tuple[str, float]] = []
    for prog in COMMON_PROGRESSIONS:
        realized = realize_progression(prog, key, prog.scale_type)
        if len(realized) != len(chords):
            continue

        match_count = 0
        for c, r in zip(chords, realized):
            c_pcs = {note_to_index(n) for n in c.notes}
            r_pcs = {note_to_index(n) for n in r.notes}
            if c_pcs == r_pcs:
                match_count += 1

        score = match_count / len(chords)
        if score > 0:
            results.append((prog.name, round(score, 4)))

    results.sort(key=lambda x: -x[1])
    return results
