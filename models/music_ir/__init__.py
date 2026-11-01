"""Music Information Retrieval: fingerprinting, chroma, onset, search, tagging, segmentation."""
from models.music_ir.chromagram import (
    CHORD_TEMPLATES,
    KRUMHANSL_KESSLER_MAJOR,
    KRUMHANSL_KESSLER_MINOR,
    PITCH_CLASSES,
    ChordRecognizer,
    ChromaDistance,
    ChromaExtractor,
    KeyDetector,
)
from models.music_ir.fingerprint import (
    AudioFingerprinter,
    ConstellationMap,
    FingerprintHash,
    SpectrogramPeaks,
)
from models.music_ir.onset import (
    BeatTracker,
    OnsetDetector,
    SegmentBoundaryDetector,
    TempoHistogram,
)
from models.music_ir.similarity_search import (
    CoverSongDetector,
    FeatureIndex,
    LocalitySensitiveHash,
    SequenceAlignment,
)
from models.music_ir.search import (
    InvertedIndex,
    TrackIndex,
    QueryExpander,
    SearchRanker,
)
from models.music_ir.tagging import (
    AutoTagger,
    GenreClassifier,
    MoodTagger,
    InstrumentDetector,
)
from models.music_ir.segmentation import (
    StructuralSegmenter,
    ChromaAnalyzer,
)

__all__ = [
    "AudioFingerprinter", "BeatTracker", "CHORD_TEMPLATES",
    "ChordRecognizer", "ChromaDistance", "ChromaExtractor",
    "ConstellationMap", "CoverSongDetector", "FeatureIndex",
    "FingerprintHash", "KeyDetector", "KRUMHANSL_KESSLER_MAJOR",
    "KRUMHANSL_KESSLER_MINOR", "LocalitySensitiveHash",
    "OnsetDetector", "PITCH_CLASSES", "SegmentBoundaryDetector",
    "SequenceAlignment", "SpectrogramPeaks", "TempoHistogram",
    "InvertedIndex", "TrackIndex", "QueryExpander", "SearchRanker",
    "AutoTagger", "GenreClassifier", "MoodTagger", "InstrumentDetector",
    "StructuralSegmenter", "ChromaAnalyzer",
]
