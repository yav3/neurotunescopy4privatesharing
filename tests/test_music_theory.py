"""Tests for models.music_theory — scales, intervals, chords, progressions,
Camelot wheel, rhythm patterns.

40+ tests covering construction, detection, edge cases.
"""
from __future__ import annotations

import math
import pytest

from models.music_theory.intervals import (
    PITCH_CLASSES,
    CONSONANCE_SCORES,
    normalize_note,
    note_to_index,
    interval_between,
    interval_name,
    consonance_score,
    melodic_tension,
)
from models.music_theory.scales import (
    SCALE_INTERVALS,
    Scale,
    get_scale,
    get_relative_minor,
    get_relative_major,
    scale_degree_to_note,
    detect_scale_from_notes,
)
from models.music_theory.chords import (
    Chord,
    build_chord,
    detect_chord,
    chord_complexity,
)
from models.music_theory.progressions import (
    COMMON_PROGRESSIONS,
    realize_progression,
    harmonic_tension_curve,
    detect_progression,
)
from models.music_theory.camelot import (
    CamelotKey,
    key_to_camelot,
    camelot_to_key,
    camelot_compatibility,
    harmonic_mixing_score,
    suggest_transitions,
)
from models.music_theory.rhythm import (
    TimeSignature,
    RhythmPattern,
    COMMON_TIME_SIGNATURES,
    COMMON_PATTERNS,
    pattern_similarity,
    syncopation_score,
    groove_complexity,
    bpm_to_ms,
)


# ── Intervals ─────────────────────────────────────────────────────────────

class TestIntervals:
    def test_normalize_note_sharp(self):
        assert normalize_note("C#") == "C#"

    def test_normalize_note_flat(self):
        assert normalize_note("Db") == "C#"
        assert normalize_note("Eb") == "D#"
        assert normalize_note("Bb") == "A#"

    def test_normalize_note_double(self):
        assert normalize_note("Fb") == "E"
        assert normalize_note("B#") == "C"
        assert normalize_note("E#") == "F"

    def test_normalize_unknown_raises(self):
        with pytest.raises(ValueError):
            normalize_note("X")

    def test_note_to_index(self):
        assert note_to_index("C") == 0
        assert note_to_index("A") == 9

    def test_interval_between_same(self):
        assert interval_between("C", "C") == 0

    def test_interval_between_fifth(self):
        assert interval_between("C", "G") == 7

    def test_interval_between_wraps(self):
        assert interval_between("A", "C") == 3  # A→C = minor third

    def test_interval_name_perfect_fifth(self):
        assert interval_name(7) == "P5"

    def test_interval_name_tritone(self):
        assert interval_name(6) == "A4/d5"

    def test_consonance_score_unison(self):
        assert consonance_score("C", "C") == 1.0

    def test_consonance_score_tritone(self):
        assert consonance_score("C", "F#") == 0.1

    def test_melodic_tension_empty(self):
        assert melodic_tension([]) == 0.0
        assert melodic_tension(["C"]) == 0.0

    def test_melodic_tension_consonant(self):
        tension = melodic_tension(["C", "G", "C"])
        assert tension < 0.15  # fifths and octave-equivalents are consonant

    def test_melodic_tension_dissonant(self):
        tension = melodic_tension(["C", "C#", "C"])
        assert tension > 0.7  # minor seconds are very dissonant


# ── Scales ────────────────────────────────────────────────────────────────

class TestScales:
    def test_c_major_notes(self):
        s = get_scale("C", "major")
        assert s.notes == ("C", "D", "E", "F", "G", "A", "B")

    def test_a_natural_minor(self):
        s = get_scale("A", "natural_minor")
        assert s.notes == ("A", "B", "C", "D", "E", "F", "G")

    def test_pentatonic_major_length(self):
        s = get_scale("C", "pentatonic_major")
        assert len(s.notes) == 5

    def test_blues_has_blue_note(self):
        s = get_scale("C", "blues")
        assert "F#" in s.notes  # the blue note in C blues

    def test_chromatic_12_notes(self):
        s = get_scale("C", "chromatic")
        assert len(s.notes) == 12

    def test_all_scale_types_build(self):
        for st in SCALE_INTERVALS:
            s = get_scale("C", st)
            assert len(s.notes) == len(SCALE_INTERVALS[st])

    def test_unknown_scale_raises(self):
        with pytest.raises(ValueError):
            get_scale("C", "nonexistent")

    def test_enharmonic_root(self):
        s = get_scale("Db", "major")
        assert s.root == "C#"

    def test_relative_minor(self):
        assert get_relative_minor("C") == "A"
        assert get_relative_minor("G") == "E"

    def test_relative_major(self):
        assert get_relative_major("A") == "C"
        assert get_relative_major("E") == "G"

    def test_scale_degree_to_note(self):
        assert scale_degree_to_note("C", "major", 1) == "C"
        assert scale_degree_to_note("C", "major", 3) == "E"
        assert scale_degree_to_note("C", "major", 5) == "G"

    def test_scale_degree_wraps(self):
        n = scale_degree_to_note("C", "major", 8)
        assert n == "C"  # octave wraps to root

    def test_detect_scale_from_notes(self):
        results = detect_scale_from_notes(["C", "D", "E", "F", "G", "A", "B"])
        top = results[0]
        assert top[0] == "C"
        assert top[1] == "major"
        assert top[2] > 0.9

    def test_detect_scale_empty(self):
        assert detect_scale_from_notes([]) == []


# ── Chords ────────────────────────────────────────────────────────────────

class TestChords:
    def test_c_major_chord(self):
        c = build_chord("C", "major")
        assert c.notes == ("C", "E", "G")

    def test_a_minor_chord(self):
        c = build_chord("A", "minor")
        assert c.notes == ("A", "C", "E")

    def test_dom7_has_four_notes(self):
        c = build_chord("G", "dom7")
        assert len(c.notes) == 4
        assert "F" in c.notes

    def test_dim7_four_notes(self):
        c = build_chord("B", "dim7")
        assert len(c.notes) == 4

    def test_unknown_chord_raises(self):
        with pytest.raises(ValueError):
            build_chord("C", "nonexistent")

    def test_detect_chord_exact_match(self):
        results = detect_chord(["C", "E", "G"])
        assert results[0][0] == "C"
        assert results[0][1] == "major"
        assert results[0][2] >= 0.9

    def test_detect_chord_empty(self):
        assert detect_chord([]) == []

    def test_chord_complexity_triad_vs_13th(self):
        triad = build_chord("C", "major")
        ext = build_chord("C", "13th")
        assert chord_complexity(triad) < chord_complexity(ext)

    def test_chord_complexity_range(self):
        for ct in ["major", "minor", "dom7", "dim7", "13th"]:
            c = build_chord("C", ct)
            cx = chord_complexity(c)
            assert 0.0 <= cx <= 1.0


# ── Progressions ──────────────────────────────────────────────────────────

class TestProgressions:
    def test_realize_pop_progression(self):
        prog = COMMON_PROGRESSIONS[1]  # Pop: I V vi IV
        chords = realize_progression(prog, "C")
        roots = [c.root for c in chords]
        assert roots == ["C", "G", "A", "F"]

    def test_realize_jazz_cadence(self):
        prog = COMMON_PROGRESSIONS[2]  # ii V I
        chords = realize_progression(prog, "C")
        roots = [c.root for c in chords]
        assert roots == ["D", "G", "C"]

    def test_tension_curve_length(self):
        prog = COMMON_PROGRESSIONS[0]  # I IV V I
        chords = realize_progression(prog, "C")
        curve = harmonic_tension_curve(chords)
        assert len(curve) == len(chords)

    def test_tension_curve_tonic_low(self):
        prog = COMMON_PROGRESSIONS[0]
        chords = realize_progression(prog, "C")
        curve = harmonic_tension_curve(chords)
        assert curve[0] < curve[2]  # I less tense than V

    def test_detect_progression_pop(self):
        pop = COMMON_PROGRESSIONS[1]
        chords = realize_progression(pop, "G")
        results = detect_progression(chords, "G")
        assert any(name == "Pop progression" for name, _ in results)

    def test_detect_progression_empty(self):
        assert detect_progression([], "C") == []


# ── Camelot ───────────────────────────────────────────────────────────────

class TestCamelot:
    def test_key_to_camelot_c_major(self):
        ck = key_to_camelot("C", "major")
        assert ck.number == 8
        assert ck.letter == "B"

    def test_key_to_camelot_a_minor(self):
        ck = key_to_camelot("A", "minor")
        assert ck.number == 8
        assert ck.letter == "A"

    def test_camelot_to_key_8b(self):
        assert camelot_to_key(8, "B") == "C"

    def test_camelot_to_key_8a(self):
        assert camelot_to_key(8, "A") == "A"

    def test_all_24_positions_round_trip(self):
        for num in range(1, 13):
            for let in ("A", "B"):
                kn = camelot_to_key(num, let)
                st = "minor" if let == "A" else "major"
                ck = key_to_camelot(kn, st)
                assert ck.number == num
                assert ck.letter == let

    def test_compatibility_same_key(self):
        ck = key_to_camelot("C", "major")
        assert camelot_compatibility(ck, ck) == 1.0

    def test_compatibility_adjacent(self):
        k1 = key_to_camelot("C", "major")  # 8B
        k2 = key_to_camelot("G", "major")  # 9B
        assert camelot_compatibility(k1, k2) == 0.95

    def test_compatibility_parallel(self):
        k1 = key_to_camelot("C", "major")  # 8B
        k2 = key_to_camelot("A", "minor")  # 8A
        assert camelot_compatibility(k1, k2) == 0.85

    def test_harmonic_mixing_alias(self):
        k1 = key_to_camelot("C", "major")
        k2 = key_to_camelot("G", "major")
        assert harmonic_mixing_score(k1, k2) == camelot_compatibility(k1, k2)

    def test_suggest_transitions_returns_list(self):
        ck = key_to_camelot("C", "major")
        transitions = suggest_transitions(ck, n=5)
        assert len(transitions) <= 5
        assert all(isinstance(t, tuple) and len(t) == 3 for t in transitions)
        for _, score, label in transitions:
            assert score > 0
            assert isinstance(label, str)

    def test_invalid_camelot_raises(self):
        with pytest.raises(ValueError):
            camelot_to_key(13, "A")


# ── Rhythm ────────────────────────────────────────────────────────────────

class TestRhythm:
    def test_time_signature_4_4(self):
        ts = COMMON_TIME_SIGNATURES["4/4"]
        assert ts.is_simple
        assert not ts.is_compound
        assert ts.beats_per_measure == 4

    def test_time_signature_6_8_compound(self):
        ts = COMMON_TIME_SIGNATURES["6/8"]
        assert ts.is_compound
        assert ts.beats_per_measure == 2

    def test_pattern_similarity_self(self):
        p = COMMON_PATTERNS["four_on_floor"]
        assert pattern_similarity(p, p) == 1.0

    def test_pattern_similarity_different(self):
        p1 = COMMON_PATTERNS["four_on_floor"]
        p2 = COMMON_PATTERNS["backbeat"]
        sim = pattern_similarity(p1, p2)
        assert 0.0 < sim < 1.0

    def test_pattern_similarity_empty(self):
        empty = RhythmPattern("empty", (), 4.0)
        p = COMMON_PATTERNS["four_on_floor"]
        assert pattern_similarity(empty, p) == 0.0

    def test_syncopation_four_on_floor(self):
        p = COMMON_PATTERNS["four_on_floor"]
        ts = COMMON_TIME_SIGNATURES["4/4"]
        sync = syncopation_score(p, ts)
        assert sync <= 0.5  # on-beat pattern (beats 1,3 are metrically weak in 4/4)

    def test_syncopation_reggaeton(self):
        p = COMMON_PATTERNS["reggaeton"]
        ts = COMMON_TIME_SIGNATURES["4/4"]
        sync = syncopation_score(p, ts)
        assert sync > 0.3  # highly syncopated

    def test_groove_complexity_range(self):
        for name, p in COMMON_PATTERNS.items():
            gc = groove_complexity(p)
            assert 0.0 <= gc <= 1.0, f"groove_complexity out of range for {name}"

    def test_groove_complexity_ordering(self):
        simple = groove_complexity(COMMON_PATTERNS["four_on_floor"])
        complex_ = groove_complexity(COMMON_PATTERNS["bossa_nova"])
        assert complex_ > simple

    def test_bpm_to_ms_120(self):
        ms = bpm_to_ms(120.0)
        assert abs(ms - 500.0) < 0.01

    def test_bpm_to_ms_eighth(self):
        ms = bpm_to_ms(120.0, subdivision=2.0)
        assert abs(ms - 250.0) < 0.01

    def test_bpm_to_ms_zero_raises(self):
        with pytest.raises(ValueError):
            bpm_to_ms(0.0)

    def test_all_common_patterns_have_onsets(self):
        for name, p in COMMON_PATTERNS.items():
            assert len(p.onsets) > 0, f"{name} has no onsets"
            assert p.duration_beats > 0
