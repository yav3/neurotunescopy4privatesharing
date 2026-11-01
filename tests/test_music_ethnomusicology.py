"""Tests for music_ethnomusicology: raga, maqam, gamelan, african rhythm."""
from __future__ import annotations
import pytest

from models.music_ethnomusicology.raga import (
    SWARAS, SWARA_SEMITONES, THAAT_SCALES, RAGA_CATALOG,
    Raga, thaat_to_ragas, raga_similarity, classify_raga,
)
from models.music_ethnomusicology.maqam import (
    MAQAM_CATALOG, Maqam, maqam_modulation_distance, classify_maqam,
)
from models.music_ethnomusicology.gamelan import (
    SLENDRO_INTERVALS, PELOG_INTERVALS, GAMELAN_SCALES, PATHET_MAP,
    GamelanScale, interlocking_pattern, colotomic_structure,
)
from models.music_ethnomusicology.african_rhythm import (
    STANDARD_PATTERNS, TimelinePattern, euclidean_rhythm,
    cross_rhythm, rotate_pattern, pattern_density, syncopation_index,
)


# ── Raga ──────────────────────────────────────────────────────────────────

class TestRaga:
    def test_swaras_count(self):
        assert len(SWARAS) == 12

    def test_swara_semitones_covers_all(self):
        assert set(SWARA_SEMITONES.values()) == set(range(12))

    def test_thaat_count(self):
        assert len(THAAT_SCALES) == 10

    def test_thaat_scales_are_7_note(self):
        for thaat, swaras in THAAT_SCALES.items():
            assert len(swaras) == 7, f"{thaat} has {len(swaras)} swaras"

    def test_catalog_size(self):
        assert len(RAGA_CATALOG) >= 20

    def test_raga_notes_auto_computed(self):
        yaman = RAGA_CATALOG["yaman"]
        assert isinstance(yaman.notes, frozenset)
        assert len(yaman.notes) > 0

    def test_thaat_to_ragas_bilawal(self):
        ragas = thaat_to_ragas("bilawal")
        names = [r.name for r in ragas]
        assert "bilawal" in names

    def test_raga_similarity_self(self):
        yaman = RAGA_CATALOG["yaman"]
        assert raga_similarity(yaman, yaman) == 1.0

    def test_raga_similarity_different(self):
        yaman = RAGA_CATALOG["yaman"]
        bhairav = RAGA_CATALOG["bhairav"]
        sim = raga_similarity(yaman, bhairav)
        assert 0.0 < sim < 1.0

    def test_classify_raga_exact(self):
        yaman = RAGA_CATALOG["yaman"]
        matches = classify_raga(yaman.notes)
        best_name = matches[0][0].name
        assert best_name == "yaman"

    def test_classify_raga_threshold(self):
        matches = classify_raga(frozenset({"Sa", "Re", "Ga"}))
        for raga, sim in matches:
            assert sim >= 0.3


# ── Maqam ─────────────────────────────────────────────────────────────────

class TestMaqam:
    def test_catalog_size(self):
        assert len(MAQAM_CATALOG) >= 15

    def test_maqam_intervals(self):
        rast = MAQAM_CATALOG["rast"]
        assert len(rast.intervals) == len(rast.jins_lower) + len(rast.jins_upper)

    def test_maqam_total_cents(self):
        rast = MAQAM_CATALOG["rast"]
        assert rast.total_cents > 0

    def test_modulation_distance_self(self):
        rast = MAQAM_CATALOG["rast"]
        assert maqam_modulation_distance(rast, rast) == 0.0

    def test_modulation_distance_different(self):
        rast = MAQAM_CATALOG["rast"]
        hijaz = MAQAM_CATALOG["hijaz"]
        d = maqam_modulation_distance(rast, hijaz)
        assert d > 0.0

    def test_modulation_distance_symmetry(self):
        rast = MAQAM_CATALOG["rast"]
        bayati = MAQAM_CATALOG["bayati"]
        assert abs(maqam_modulation_distance(rast, bayati) -
                   maqam_modulation_distance(bayati, rast)) < 1e-10

    def test_classify_maqam(self):
        rast = MAQAM_CATALOG["rast"]
        matches = classify_maqam(rast.intervals)
        best = matches[0]
        assert best[0].name == "rast"
        assert best[1] > 0.9


# ── Gamelan ───────────────────────────────────────────────────────────────

class TestGamelan:
    def test_slendro_intervals(self):
        assert len(SLENDRO_INTERVALS) == 5
        assert all(c == 240 for c in SLENDRO_INTERVALS)

    def test_pelog_intervals(self):
        assert len(PELOG_INTERVALS) == 7

    def test_gamelan_scales_count(self):
        assert len(GAMELAN_SCALES) >= 4

    def test_frequency_ratios(self):
        slendro = GAMELAN_SCALES["slendro"]
        ratios = slendro.frequency_ratios()
        assert ratios[0] == pytest.approx(1.0)
        assert all(r > 0 for r in ratios)
        assert ratios[-1] > ratios[0]

    def test_interlocking_pattern(self):
        melody = [1, 2, 3, 4, 5, 6]
        polos, sangsih = interlocking_pattern(melody, 6)
        assert len(polos) == len(melody)
        assert len(sangsih) == len(melody)
        for p, s in zip(polos, sangsih):
            assert (p == 0) != (s == 0) or (p == 0 and s == 0)

    def test_colotomic_lancaran(self):
        structure = colotomic_structure(16, "lancaran")
        assert "gong" in structure
        assert "kenong" in structure
        assert all(0 <= pos < 16 for pos in structure["gong"])

    def test_colotomic_ketawang(self):
        structure = colotomic_structure(32, "ketawang")
        assert "gong" in structure

    def test_pathet_map_non_empty(self):
        assert len(PATHET_MAP) > 0


# ── African Rhythm ────────────────────────────────────────────────────────

class TestAfricanRhythm:
    def test_standard_patterns_count(self):
        assert len(STANDARD_PATTERNS) >= 12

    def test_pattern_properties(self):
        clave = STANDARD_PATTERNS["son_clave_32"]
        assert clave.cycle_length == len(clave.pulses)
        assert clave.onset_count == sum(clave.pulses)

    def test_euclidean_rhythm_basic(self):
        pattern = euclidean_rhythm(3, 8)
        assert len(pattern.pulses) == 8
        assert pattern.onset_count == 3

    def test_euclidean_rhythm_tresillo(self):
        pattern = euclidean_rhythm(3, 8)
        assert pattern.onset_count == 3

    def test_euclidean_rhythm_full(self):
        pattern = euclidean_rhythm(8, 8)
        assert all(p == 1 for p in pattern.pulses)

    def test_euclidean_rhythm_empty(self):
        pattern = euclidean_rhythm(0, 8)
        assert all(p == 0 for p in pattern.pulses)

    def test_cross_rhythm(self):
        a, b = cross_rhythm(3, 4, 12)
        assert a.cycle_length == 12
        assert b.cycle_length == 12
        assert a.onset_count == 3
        assert b.onset_count == 4

    def test_rotate_pattern(self):
        clave = STANDARD_PATTERNS["son_clave_32"]
        rotated = rotate_pattern(clave, 1)
        assert rotated.cycle_length == clave.cycle_length
        assert rotated.onset_count == clave.onset_count
        assert rotated.pulses != clave.pulses

    def test_rotate_full_cycle(self):
        clave = STANDARD_PATTERNS["son_clave_32"]
        rotated = rotate_pattern(clave, clave.cycle_length)
        assert rotated.pulses == clave.pulses

    def test_pattern_density(self):
        clave = STANDARD_PATTERNS["son_clave_32"]
        d = pattern_density(clave)
        assert 0.0 < d < 1.0

    def test_syncopation_index_range(self):
        for name, pat in STANDARD_PATTERNS.items():
            idx = syncopation_index(pat)
            assert idx >= 0.0, f"{name} has negative syncopation"
