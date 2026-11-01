"""Music linguistics: phonetic inventories, prosodic analysis, singability."""
from models.music_linguistics.phonetics import (
    PhonemeInventory, INVENTORIES, IPA_VOWELS, IPA_CONSONANTS,
    count_syllables_english, count_syllables_spanish,
    count_syllables_japanese, singability_score,
)
from models.music_linguistics.prosody import (
    Foot, RhymeType, MeterResult, RhymeSchemeResult,
    stress_pattern, classify_feet, analyze_meter,
    classify_rhyme, detect_rhyme_scheme,
    detect_enjambment, detect_caesura,
)

__all__ = [
    "PhonemeInventory", "INVENTORIES", "IPA_VOWELS", "IPA_CONSONANTS",
    "count_syllables_english", "count_syllables_spanish",
    "count_syllables_japanese", "singability_score",
    "Foot", "RhymeType", "MeterResult", "RhymeSchemeResult",
    "stress_pattern", "classify_feet", "analyze_meter",
    "classify_rhyme", "detect_rhyme_scheme",
    "detect_enjambment", "detect_caesura",
]
