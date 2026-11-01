"""Music theory module — scales, intervals, chords, progressions, Camelot wheel, rhythm.

Pure music theory primitives for the music vertical. No ML, no medical code.
"""
from __future__ import annotations

from models.music_theory.intervals import (
    CONSONANCE_SCORES,
    ENHARMONIC_MAP,
    INTERVAL_NAMES,
    PITCH_CLASSES,
    consonance_score,
    interval_between,
    interval_name,
    melodic_tension,
    normalize_note,
    note_to_index,
)
from models.music_theory.scales import (
    ALL_SCALE_TYPES,
    SCALE_INTERVALS,
    Scale,
    detect_scale_from_notes,
    get_relative_major,
    get_relative_minor,
    get_scale,
    scale_degree_to_note,
)
from models.music_theory.chords import (
    ALL_CHORD_TYPES,
    CHORD_TYPES,
    Chord,
    build_chord,
    chord_complexity,
    detect_chord,
)
from models.music_theory.progressions import (
    COMMON_PROGRESSIONS,
    Progression,
    detect_progression,
    harmonic_tension_curve,
    realize_progression,
)
from models.music_theory.camelot import (
    CamelotKey,
    camelot_compatibility,
    camelot_to_key,
    harmonic_mixing_score,
    key_to_camelot,
    suggest_transitions,
)
from models.music_theory.rhythm import (
    COMMON_PATTERNS,
    COMMON_TIME_SIGNATURES,
    RhythmPattern,
    TimeSignature,
    bpm_to_ms,
    groove_complexity,
    pattern_similarity,
    syncopation_score,
)

__all__ = [
    # intervals
    "PITCH_CLASSES", "ENHARMONIC_MAP", "INTERVAL_NAMES", "CONSONANCE_SCORES",
    "normalize_note", "note_to_index", "interval_between", "interval_name",
    "consonance_score", "melodic_tension",
    # scales
    "Scale", "SCALE_INTERVALS", "ALL_SCALE_TYPES", "get_scale",
    "get_relative_minor", "get_relative_major", "scale_degree_to_note",
    "detect_scale_from_notes",
    # chords
    "Chord", "CHORD_TYPES", "ALL_CHORD_TYPES", "build_chord",
    "detect_chord", "chord_complexity",
    # progressions
    "Progression", "COMMON_PROGRESSIONS", "realize_progression",
    "harmonic_tension_curve", "detect_progression",
    # camelot
    "CamelotKey", "key_to_camelot", "camelot_to_key",
    "camelot_compatibility", "harmonic_mixing_score", "suggest_transitions",
    # rhythm
    "TimeSignature", "RhythmPattern", "COMMON_TIME_SIGNATURES", "COMMON_PATTERNS",
    "pattern_similarity", "syncopation_score", "groove_complexity", "bpm_to_ms",
]
