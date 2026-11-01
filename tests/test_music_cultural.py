"""Tests for music_cultural: scales, tuning systems, rhythm systems."""
import pytest
import math
from models.music_cultural.scales import (
    CulturalScale, ScaleDatabase, MAQAM_SCALES, RAGA_SCALES, GAMELAN_SCALES,
    interval_pattern, scale_similarity,
)
from models.music_cultural.tuning import (
    TuningSystem, EqualTemperament, JustIntonation, PythagoreanTuning,
    MeantoneTemperament, WellTemperament,
    cents_to_ratio, ratio_to_cents, frequency_ratio,
)
from models.music_cultural.rhythm import (
    TimelinePattern, Aksak, Tala, PolyrhythmAnalyzer,
    euclidean_rhythm, necklace_rotation, STANDARD_TIMELINES,
)


# ── Scales ──────────────────────────────────────────────────────────


class TestCulturalScale:
    def test_maqam_rast(self):
        rast = MAQAM_SCALES["rast"]
        assert rast.name == "Rast"
        assert rast.tradition == "Arabic"
        assert len(rast.intervals) > 0
        assert rast.intervals[0] == 0

    def test_raga_bilawal(self):
        bilawal = RAGA_SCALES["bilawal"]
        assert bilawal.tradition == "Hindustani"
        assert 0 in bilawal.intervals

    def test_gamelan_pelog(self):
        pelog = GAMELAN_SCALES["pelog"]
        assert pelog.tradition == "Javanese"

    def test_all_maqam_scales_valid(self):
        assert len(MAQAM_SCALES) == 8
        for name, scale in MAQAM_SCALES.items():
            assert scale.tradition == "Arabic"
            assert scale.intervals[0] == 0
            assert len(scale.intervals) >= 5

    def test_all_raga_scales_valid(self):
        assert len(RAGA_SCALES) == 13
        for name, scale in RAGA_SCALES.items():
            assert scale.tradition in ("Hindustani", "Carnatic")
            assert scale.intervals[0] == 0

    def test_all_gamelan_scales_valid(self):
        assert len(GAMELAN_SCALES) == 4
        for name, scale in GAMELAN_SCALES.items():
            assert scale.tradition == "Javanese"

    def test_interval_pattern(self):
        major = [0, 2, 4, 5, 7, 9, 11]
        pat = interval_pattern(major)
        assert pat == [2, 2, 1, 2, 2, 2]

    def test_interval_pattern_chromatic(self):
        chromatic = list(range(13))
        pat = interval_pattern(chromatic)
        assert all(p == 1 for p in pat)

    def test_scale_similarity_identical(self):
        major = [0, 2, 4, 5, 7, 9, 11]
        sim = scale_similarity(major, major)
        assert sim == pytest.approx(1.0, abs=0.01)

    def test_scale_similarity_different(self):
        major = [0, 2, 4, 5, 7, 9, 11]
        chromatic = list(range(13))
        sim = scale_similarity(major, chromatic)
        assert 0.0 <= sim <= 1.0

    def test_scale_database_search(self):
        db = ScaleDatabase()
        results = db.search_by_tradition("Arabic")
        assert len(results) >= 8
        for s in results:
            assert s.tradition == "Arabic"

    def test_scale_database_search_hindustani(self):
        db = ScaleDatabase()
        results = db.search_by_tradition("Hindustani")
        assert len(results) >= 7


# ── Tuning Systems ──────────────────────────────────────────────────


class TestEqualTemperament:
    def test_12tet_octave(self):
        et = EqualTemperament(12)
        ratios = et.get_ratios()
        assert ratios[0] == pytest.approx(1.0)
        assert ratios[-1] == pytest.approx(2.0, abs=0.01)

    def test_12tet_semitone(self):
        et = EqualTemperament(12)
        ratios = et.get_ratios()
        assert ratios[1] == pytest.approx(2 ** (1 / 12), abs=0.0001)

    def test_12tet_perfect_fifth(self):
        et = EqualTemperament(12)
        ratios = et.get_ratios()
        assert ratios[7] == pytest.approx(2 ** (7 / 12), abs=0.0001)

    def test_24tet(self):
        et = EqualTemperament(24)
        ratios = et.get_ratios()
        assert len(ratios) == 25

    def test_19tet(self):
        et = EqualTemperament(19)
        ratios = et.get_ratios()
        assert len(ratios) == 20


class TestJustIntonation:
    def test_octave(self):
        ji = JustIntonation()
        ratios = ji.get_ratios()
        assert ratios[-1] == pytest.approx(2.0, abs=0.01)

    def test_perfect_fifth(self):
        ji = JustIntonation()
        ratios = ji.get_ratios()
        assert ratios[7] == pytest.approx(3 / 2, abs=0.01)

    def test_major_third(self):
        ji = JustIntonation()
        ratios = ji.get_ratios()
        assert ratios[4] == pytest.approx(5 / 4, abs=0.01)

    def test_perfect_fourth(self):
        ji = JustIntonation()
        ratios = ji.get_ratios()
        assert ratios[5] == pytest.approx(4 / 3, abs=0.01)


class TestPythagoreanTuning:
    def test_octave(self):
        pt = PythagoreanTuning()
        ratios = pt.get_ratios()
        assert ratios[-1] == pytest.approx(2.0, abs=0.01)

    def test_fifth(self):
        pt = PythagoreanTuning()
        ratios = pt.get_ratios()
        assert ratios[7] == pytest.approx(3 / 2, abs=0.01)


class TestMeantoneTemperament:
    def test_octave(self):
        mt = MeantoneTemperament()
        ratios = mt.get_ratios()
        assert ratios[-1] == pytest.approx(2.0, abs=0.02)

    def test_major_third_just(self):
        mt = MeantoneTemperament(comma_fraction=0.25)
        ratios = mt.get_ratios()
        assert ratios[4] == pytest.approx(5 / 4, abs=0.01)


class TestWellTemperament:
    def test_octave(self):
        wt = WellTemperament()
        ratios = wt.get_ratios()
        assert ratios[-1] == pytest.approx(2.0, abs=0.02)

    def test_all_ratios_ascending(self):
        wt = WellTemperament()
        ratios = wt.get_ratios()
        for i in range(1, len(ratios)):
            assert ratios[i] > ratios[i - 1]


class TestTuningHelpers:
    def test_cents_ratio_roundtrip(self):
        for cents_val in [0, 100, 200, 700, 1200]:
            ratio = cents_to_ratio(cents_val)
            back = ratio_to_cents(ratio)
            assert back == pytest.approx(cents_val, abs=0.01)

    def test_cents_to_ratio_octave(self):
        assert cents_to_ratio(1200) == pytest.approx(2.0, abs=0.001)

    def test_cents_to_ratio_semitone(self):
        assert cents_to_ratio(100) == pytest.approx(2 ** (1 / 12), abs=0.001)

    def test_ratio_to_cents_unison(self):
        assert ratio_to_cents(1.0) == pytest.approx(0.0)

    def test_frequency_ratio(self):
        r = frequency_ratio(440.0, 880.0)
        assert r == pytest.approx(2.0)


# ── Rhythm Systems ──────────────────────────────────────────────────


class TestTimelinePattern:
    def test_son_clave(self):
        sc = STANDARD_TIMELINES["son_clave"]
        assert sc.length == 16
        assert sc.name == "Son Clave"
        assert sc.tradition == "Afro-Cuban"

    def test_density(self):
        sc = STANDARD_TIMELINES["son_clave"]
        assert 0.0 < sc.density < 1.0
        assert sc.density == pytest.approx(5 / 16)

    def test_onsets(self):
        sc = STANDARD_TIMELINES["son_clave"]
        onsets = sc.onsets
        assert len(onsets) == 5
        assert onsets[0] == 0

    def test_rotate(self):
        sc = STANDARD_TIMELINES["son_clave"]
        rotated = sc.rotate(3)
        assert rotated.length == sc.length
        assert rotated.pattern[0] == sc.pattern[3]

    def test_complement(self):
        sc = STANDARD_TIMELINES["son_clave"]
        comp = sc.complement()
        for a, b in zip(sc.pattern, comp.pattern):
            assert a + b == 1

    def test_ioi(self):
        sc = STANDARD_TIMELINES["son_clave"]
        ioi = sc.inter_onset_intervals()
        assert sum(ioi) == sc.length
        assert len(ioi) == len(sc.onsets)

    def test_all_timelines_valid(self):
        for name, tp in STANDARD_TIMELINES.items():
            assert tp.length > 0
            assert 0.0 <= tp.density <= 1.0


class TestAksak:
    def test_7_8_pattern(self):
        a = Aksak()
        pat = a.get_pattern("7/8_a")
        assert pat == [2, 2, 3]
        assert a.total_pulses("7/8_a") == 7

    def test_9_8_pattern(self):
        a = Aksak()
        assert a.total_pulses("9/8_a") == 9

    def test_to_binary(self):
        a = Aksak()
        binary = a.to_binary("7/8_a")
        assert len(binary) == 7
        assert binary[0] == 1
        assert binary[2] == 1
        assert binary[4] == 1

    def test_unknown_pattern(self):
        a = Aksak()
        assert a.get_pattern("nonexistent") is None
        assert a.total_pulses("nonexistent") == 0

    def test_all_patterns(self):
        a = Aksak()
        pats = a.all_patterns()
        assert len(pats) >= 7


class TestTala:
    def test_tintal(self):
        t = Tala()
        cycle = t.get_cycle("tintal")
        assert cycle is not None
        assert cycle.total_beats == 16
        assert len(cycle.clap_pattern) == 4

    def test_jhaptal(self):
        t = Tala()
        cycle = t.get_cycle("jhaptal")
        assert cycle.total_beats == 10

    def test_rupak(self):
        t = Tala()
        cycle = t.get_cycle("rupak")
        assert cycle.total_beats == 7
        assert cycle.clap_pattern[0] == "wave"

    def test_beat_positions(self):
        t = Tala()
        positions = t.beat_positions("tintal")
        assert positions == [0, 4, 8, 12]

    def test_sam_position(self):
        t = Tala()
        assert t.sam_position("tintal") == 0

    def test_unknown_tala(self):
        t = Tala()
        assert t.get_cycle("nonexistent") is None

    def test_all_talas(self):
        t = Tala()
        all_t = t.all_talas()
        assert len(all_t) >= 9


class TestPolyrhythmAnalyzer:
    def test_lcm(self):
        pa = PolyrhythmAnalyzer()
        assert pa.lcm(3, 4) == 12
        assert pa.lcm(6, 8) == 24

    def test_cycle_length(self):
        pa = PolyrhythmAnalyzer()
        assert pa.cycle_length([3, 4]) == 12
        assert pa.cycle_length([]) == 0

    def test_cross_rhythm_ratio(self):
        pa = PolyrhythmAnalyzer()
        assert pa.cross_rhythm_ratio(6, 4) == (3, 2)
        assert pa.cross_rhythm_ratio(3, 4) == (3, 4)

    def test_generate_polyrhythm(self):
        pa = PolyrhythmAnalyzer()
        a, b = pa.generate_polyrhythm(3, 4, 12)
        assert len(a) == 12
        assert len(b) == 12
        assert sum(a) == 3
        assert sum(b) == 4

    def test_coincidence_points(self):
        pa = PolyrhythmAnalyzer()
        pts = pa.coincidence_points(3, 4)
        assert 0 in pts


class TestEuclideanRhythm:
    def test_e_5_8(self):
        pat = euclidean_rhythm(5, 8)
        assert len(pat) == 8
        assert sum(pat) == 5

    def test_e_3_8(self):
        pat = euclidean_rhythm(3, 8)
        assert len(pat) == 8
        assert sum(pat) == 3

    def test_e_0_8(self):
        pat = euclidean_rhythm(0, 8)
        assert pat == [0] * 8

    def test_e_8_8(self):
        pat = euclidean_rhythm(8, 8)
        assert pat == [1] * 8

    def test_e_0_0(self):
        pat = euclidean_rhythm(0, 0)
        assert pat == []

    def test_tresillo(self):
        pat = euclidean_rhythm(3, 8)
        assert pat[0] == 1
        assert sum(pat) == 3

    def test_cuban_cinquillo(self):
        pat = euclidean_rhythm(5, 8)
        assert pat[0] == 1


class TestNecklaceRotation:
    def test_basic(self):
        rots = necklace_rotation([1, 0, 0])
        assert len(rots) == 3
        assert rots[0] == [1, 0, 0]
        assert rots[1] == [0, 0, 1]
        assert rots[2] == [0, 1, 0]

    def test_empty(self):
        assert necklace_rotation([]) == []

    def test_uniform(self):
        rots = necklace_rotation([1, 1, 1])
        assert all(r == [1, 1, 1] for r in rots)
