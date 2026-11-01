"""Tests for music_linguistics: phonetics, prosody, singability."""
import pytest
from models.music_linguistics import (
    PhonemeInventory, INVENTORIES, IPA_VOWELS, IPA_CONSONANTS,
    count_syllables_english, count_syllables_spanish, count_syllables_japanese,
    singability_score,
    Foot, RhymeType, MeterResult, RhymeSchemeResult,
    stress_pattern, classify_feet, analyze_meter,
    classify_rhyme, detect_rhyme_scheme,
    detect_enjambment, detect_caesura,
)


class TestPhonemeInventory:
    def test_inventory_count(self):
        assert len(INVENTORIES) >= 10

    def test_english_inventory(self):
        eng = INVENTORIES["english"]
        assert eng.language == "English"
        assert len(eng.vowels) > 10
        assert len(eng.consonants) > 20

    def test_total_phonemes(self):
        inv = PhonemeInventory("test", vowels=["a", "e", "i"], consonants=["p", "t", "k"])
        assert inv.total == 6

    def test_vowel_ratio(self):
        inv = PhonemeInventory("test", vowels=["a", "e"], consonants=["p", "t", "k", "s"])
        assert abs(inv.vowel_ratio - 1 / 3) < 0.01

    def test_mandarin_has_tones(self):
        assert len(INVENTORIES["mandarin"].tones) == 5

    def test_spanish_notes(self):
        assert "singable" in INVENTORIES["spanish"].notes.lower()

    def test_all_inventories_have_vowels(self):
        for name, inv in INVENTORIES.items():
            assert len(inv.vowels) > 0, f"{name} has no vowels"


class TestSyllableCounting:
    def test_english_hello(self):
        assert count_syllables_english("hello") == 2

    def test_english_strength(self):
        assert count_syllables_english("strength") == 1

    def test_english_beautiful(self):
        assert count_syllables_english("beautiful") == 3

    def test_english_empty(self):
        assert count_syllables_english("") == 0

    def test_spanish_casa(self):
        assert count_syllables_spanish("casa") == 2

    def test_spanish_corazon(self):
        assert count_syllables_spanish("corazón") == 3

    def test_spanish_hiatus(self):
        assert count_syllables_spanish("caos") == 2

    def test_japanese_empty(self):
        assert count_syllables_japanese("") == 0

    def test_japanese_alpha(self):
        assert count_syllables_japanese("hello") >= 1


class TestSingability:
    def test_spanish_high(self):
        score_es = singability_score(INVENTORIES["spanish"])
        score_en = singability_score(INVENTORIES["english"])
        assert score_es >= score_en * 0.8

    def test_mandarin_tone_penalty(self):
        score_zh = singability_score(INVENTORIES["mandarin"])
        assert score_zh < singability_score(INVENTORIES["japanese"])

    def test_score_range(self):
        for name, inv in INVENTORIES.items():
            s = singability_score(inv)
            assert 0.0 <= s <= 1.0, f"{name} singability out of range: {s}"


class TestStressAndMeter:
    def test_stress_pattern(self):
        p = stress_pattern([False, True, False, True])
        assert p == "u/u/"

    def test_classify_iambs(self):
        feet = classify_feet([False, True, False, True])
        assert all(f == Foot.IAMB for f in feet)

    def test_classify_trochees(self):
        feet = classify_feet([True, False, True, False])
        assert all(f == Foot.TROCHEE for f in feet)

    def test_classify_dactyl(self):
        feet = classify_feet([True, False, False])
        assert feet == [Foot.DACTYL]

    def test_classify_anapest(self):
        feet = classify_feet([False, False, True])
        assert feet == [Foot.ANAPEST]

    def test_analyze_meter_regularity(self):
        result = analyze_meter([False, True, False, True, False, True])
        assert result.regularity == 1.0
        assert all(f == Foot.IAMB for f in result.feet)

    def test_analyze_meter_empty(self):
        result = analyze_meter([])
        assert result.regularity == 0.0


class TestRhyme:
    def test_perfect_rhyme(self):
        assert classify_rhyme("cat", "hat") == RhymeType.PERFECT

    def test_slant_rhyme(self):
        rt = classify_rhyme("cat", "bed")
        assert rt in (RhymeType.SLANT, RhymeType.NONE)

    def test_same_word(self):
        assert classify_rhyme("love", "love") == RhymeType.PERFECT

    def test_rhyme_scheme_abab(self):
        endings = ["day", "night", "play", "light"]
        result = detect_rhyme_scheme(endings)
        assert isinstance(result.scheme, str)
        assert len(result.scheme) == 4

    def test_rhyme_scheme_pairs(self):
        endings = ["moon", "June", "star", "far"]
        result = detect_rhyme_scheme(endings)
        assert len(result.pairs) >= 1


class TestEnjambment:
    def test_comma_enjambment(self):
        lines = ["The wind blew hard,", "across the plains."]
        enjambed = detect_enjambment(lines)
        assert 0 in enjambed

    def test_conjunction_enjambment(self):
        lines = ["The sun set low", "and darkness came."]
        enjambed = detect_enjambment(lines)
        assert 0 in enjambed

    def test_no_enjambment(self):
        lines = ["The cat sat still.", "Dogs slept quietly."]
        enjambed = detect_enjambment(lines)
        assert len(enjambed) == 0


class TestCaesura:
    def test_detect_comma_caesura(self):
        line = "To be, or not to be"
        positions = detect_caesura(line)
        assert len(positions) >= 1

    def test_no_caesura(self):
        line = "A simple short line"
        positions = detect_caesura(line)
        assert len(positions) == 0
