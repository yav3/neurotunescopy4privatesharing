"""Tests for deepened music modules: copyright, semantics, psychoacoustics."""
import numpy as np
import pytest

from models.music_copyright.fingerprint import (
    SpectralPeak, FingerprintHash, FingerprintDatabase,
    find_spectral_peaks, generate_fingerprints, fingerprint_similarity,
)
from models.music_copyright.sampling_detection import (
    cross_correlation_search, spectral_envelope, envelope_similarity,
    detect_pitch_shift, detect_time_stretch, detect_loops,
)
from models.music_semantics.concept_embedding import (
    CONCEPT_REGISTRY, ConceptEmbedding, concept_similarity, nearest_concepts, analogy,
)
from models.music_semantics.mood_ontology import (
    MOOD_TREE, MoodTrajectory, mood_distance, mood_ancestors, mood_from_vad, mood_from_features,
)
from models.music_psychoacoustics.spatial_hearing import (
    interaural_time_difference, interaural_level_difference,
    head_shadow_filter, distance_attenuation,
    generate_synthetic_hrtf, apply_hrtf, estimate_azimuth, binaural_cue_analysis,
)
from models.music_psychoacoustics.timbre_perception import (
    spectral_centroid, spectral_spread, spectral_flatness, spectral_rolloff,
    odd_even_ratio, inharmonicity, attack_time,
    brightness, warmth, roughness_dissonance, total_roughness,
    analyze_timbre, timbre_distance,
)


class TestFingerprintPeaks:
    def test_peak_extraction(self):
        spec = np.random.RandomState(0).rand(128, 50)
        peaks = find_spectral_peaks(spec, n_peaks_per_frame=3)
        assert len(peaks) > 0
        assert all(isinstance(p, SpectralPeak) for p in peaks)

    def test_no_peaks_below_min_magnitude(self):
        spec = np.full((64, 10), 0.005)
        assert len(find_spectral_peaks(spec, min_magnitude=0.01)) == 0


class TestFingerprintHashing:
    def test_hash_generation(self):
        spec = np.random.RandomState(1).rand(128, 100)
        peaks = find_spectral_peaks(spec, n_peaks_per_frame=5)
        hashes = generate_fingerprints(peaks, fan_out=5)
        assert len(hashes) > 0

    def test_hash_deterministic(self):
        h = FingerprintHash(anchor_freq=10, target_freq=50, delta_time=5, anchor_time=0)
        assert len(h.hash_value) == 16


class TestFingerprintDatabase:
    def test_insert_and_query(self):
        db = FingerprintDatabase()
        spec = np.random.RandomState(2).rand(128, 200)
        hashes = generate_fingerprints(find_spectral_peaks(spec))
        db.insert("track_A", hashes)
        results = db.query(hashes, min_matches=3)
        assert len(results) > 0 and results[0][0] == "track_A"


class TestFingerprintSimilarity:
    def test_identical_hashes(self):
        h = [FingerprintHash(10, 50, 5, i) for i in range(10)]
        assert fingerprint_similarity(h, h) == 1.0


class TestCrossCorrelation:
    def test_finds_identical_segment(self):
        t = np.arange(16000) / 8000
        haystack = np.sin(2 * np.pi * 440 * t)
        needle = haystack[3000:4000].copy()
        matches = cross_correlation_search(haystack, needle, hop=100, threshold=0.95)
        assert any(abs(m[0] - 3000) < 200 for m in matches)


class TestSpectralEnvelope:
    def test_self_similarity(self):
        sig = np.sin(2 * np.pi * 440 * np.arange(4096) / 44100)
        env = spectral_envelope(sig)
        assert envelope_similarity(env, env) > 0.99


class TestPitchShiftDetection:
    def test_octave_shift(self):
        t = np.arange(8192) / 44100
        assert abs(detect_pitch_shift(np.sin(2*np.pi*220*t), np.sin(2*np.pi*440*t), sr=44100) - 12.0) < 1.5


class TestLoopDetection:
    def test_detect_repeating_pattern(self):
        sr = 44100
        loop = np.sin(2*np.pi*440*np.arange(int(0.25*sr))/sr) * np.hanning(int(0.25*sr))
        assert len(detect_loops(np.tile(loop, 8), sr=sr, min_loop_ms=100, max_loop_ms=500, threshold=0.3)) > 0


class TestConceptRegistry:
    def test_32_concepts(self):
        assert len(CONCEPT_REGISTRY) == 32

    def test_vectors_unit_norm(self):
        for name, c in CONCEPT_REGISTRY.items():
            assert abs(np.linalg.norm(c.vector) - 1.0) < 0.01


class TestConceptSimilarity:
    def test_self_similarity(self):
        c = CONCEPT_REGISTRY["melody"]
        assert abs(concept_similarity(c, c) - 1.0) < 0.01


class TestAnalogy:
    def test_analogy_returns_results(self):
        assert len(analogy("melody", "interval", "chord", k=3)) == 3

    def test_analogy_unknown_concept(self):
        assert analogy("nonexistent", "melody", "chord") == []


class TestConceptEmbedding:
    def test_add_and_search(self):
        ce = ConceptEmbedding()
        custom = ce.add("riff", "pitch", "Short repeated melodic figure")
        assert ce.search(custom.vector, k=3)[0][0] == "riff"

    def test_cluster(self):
        ce = ConceptEmbedding()
        clusters = ce.cluster(k=5)
        assert sum(len(v) for v in clusters.values()) == len(ce.concepts)


class TestMoodTree:
    def test_24_moods(self):
        assert len(MOOD_TREE) == 24

    def test_parent_child_consistency(self):
        for name, node in MOOD_TREE.items():
            if node.parent:
                assert name in MOOD_TREE[node.parent].children


class TestMoodDistance:
    def test_zero_self_distance(self):
        assert mood_distance("happy", "happy") == 0.0

    def test_happy_sad_far(self):
        assert mood_distance("happy", "sad") > 0.5


class TestMoodFromVAD:
    def test_high_valence_arousal(self):
        assert mood_from_vad(0.95, 0.95, 0.8) == "euphoric"


class TestMoodFromFeatures:
    def test_fast_major_bright(self):
        assert mood_from_features(tempo=150, mode=1.0, brightness=0.95) in ("euphoric", "joyful", "happy", "energetic")


class TestMoodTrajectory:
    def test_rags_to_riches(self):
        traj = MoodTrajectory(moods=["sad", "melancholic", "nostalgic", "content", "happy", "joyful", "euphoric"])
        arc, sim = traj.classify_arc()
        assert arc == "rags_to_riches" and sim > 0.5


class TestITD:
    def test_zero_at_front(self):
        assert interaural_time_difference(0.0) == 0.0

    def test_positive_right(self):
        assert interaural_time_difference(90.0) > 0


class TestILD:
    def test_increases_with_freq(self):
        assert interaural_level_difference(90.0, 5000.0) > interaural_level_difference(90.0, 500.0)


class TestHeadShadow:
    def test_unity_at_front(self):
        lg, rg = head_shadow_filter(1000.0, 0.0)
        assert abs(lg - 1.0) < 0.01 and abs(rg - 1.0) < 0.01


class TestHRTF:
    def test_generate_and_apply(self):
        hrtf = generate_synthetic_hrtf(45.0, sr=16000, n_taps=64)
        mono = np.sin(2*np.pi*440*np.arange(1000)/16000)
        left, right = apply_hrtf(mono, hrtf)
        assert len(left) == len(mono)


class TestAzimuthEstimation:
    def test_roundtrip(self):
        for az in [-60, -30, 0, 30, 60]:
            assert abs(estimate_azimuth(interaural_time_difference(float(az))) - az) < 3.0


class TestBinauralCueAnalysis:
    def test_identical_channels(self):
        sig = np.sin(2*np.pi*440*np.arange(4410)/44100)
        cues = binaural_cue_analysis(sig, sig, sr=44100)
        assert cues.ic > 0.95


class TestSpectralDescriptors:
    def test_centroid(self):
        freqs = np.arange(100)
        mag = np.zeros(100); mag[50] = 1.0
        assert abs(spectral_centroid(mag, freqs) - 50.0) < 0.01

    def test_flatness_white_noise(self):
        assert spectral_flatness(np.ones(512)) > 0.99


class TestHarmonicAnalysis:
    def test_inharmonicity_perfect(self):
        sr, n_fft, f0 = 44100, 8192, 440.0
        mag = np.zeros(n_fft // 2 + 1)
        for h in range(1, 8):
            b = int(round(f0 * h / (sr / n_fft)))
            if b < len(mag): mag[b] = 1.0 / h
        assert inharmonicity(mag, f0, sr, n_fft) < 0.05


class TestRoughness:
    def test_unison_smooth(self):
        assert roughness_dissonance(440.0, 440.0) < 0.01

    def test_minor_second_rough(self):
        assert roughness_dissonance(440.0, 466.0) > 0.01


class TestAnalyzeTimbre:
    def test_full_analysis(self):
        td = analyze_timbre(np.sin(2*np.pi*440*np.arange(8192)/44100), sr=44100, f0=440.0)
        assert td.spectral_centroid > 0

    def test_timbre_distance_zero(self):
        sig = np.sin(2*np.pi*440*np.arange(8192)/44100)
        td = analyze_timbre(sig, sr=44100, f0=440.0)
        assert timbre_distance(td, td) < 1e-10
