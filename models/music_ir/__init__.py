"""Music Information Retrieval: fingerprinting, chroma, onset detection, similarity search."""

from .chromagram import (
    CHORD_TEMPLATES,
    KRUMHANSL_KESSLER_MAJOR,
    KRUMHANSL_KESSLER_MINOR,
    PITCH_CLASSES,
    ChordRecognizer,
    ChromaDistance,
    ChromaExtractor,
    KeyDetector,
)
from .fingerprint import (
    AudioFingerprinter,
    ConstellationMap,
    FingerprintHash,
    SpectrogramPeaks,
)
from .onset import (
    BeatTracker,
    OnsetDetector,
    SegmentBoundaryDetector,
    TempoHistogram,
)
from .similarity_search import (
    CoverSongDetector,
    FeatureIndex,
    LocalitySensitiveHash,
    SequenceAlignment,
)

__all__ = [
    "AudioFingerprinter",
    "BeatTracker",
    "CHORD_TEMPLATES",
    "ChordRecognizer",
    "ChromaDistance",
    "ChromaExtractor",
    "ConstellationMap",
    "CoverSongDetector",
    "FeatureIndex",
    "FingerprintHash",
    "KeyDetector",
    "KRUMHANSL_KESSLER_MAJOR",
    "KRUMHANSL_KESSLER_MINOR",
    "LocalitySensitiveHash",
    "OnsetDetector",
    "PITCH_CLASSES",
    "SegmentBoundaryDetector",
    "SequenceAlignment",
    "SpectrogramPeaks",
    "TempoHistogram",
]
