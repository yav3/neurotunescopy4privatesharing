"""Tests for music_psychoacoustics: critical bands, masking, loudness, pitch."""
import numpy as np
import pytest
from models.music_psychoacoustics import (
    hz_to_bark, bark_to_hz, hz_to_erb, erb_to_hz, erb_bandwidth,
    CriticalBandAnalyzer, GammatoneFilterbank,
    SimultaneousMasking, TemporalMasking, MaskingModel,
    EqualLoudness, SpecificLoudness, ISO_226_FREQS, THRESHOLD_SPL,
    VirtualPitch, PitchSalience, estimate_pitch,
)


class TestBarkScale:
    def test_hz_to_bark_1000(self):
        z = float(hz_to_bark(1000.0))
        assert 8.0 < z < 9.5

    def test_hz_to_bark_monotonic(self):
        freqs = [100, 500, 1000, 4000, 8000]
        barks = [float(hz_to_bark(f)) for f in freqs]
        for i in range(len(barks) - 1):
            assert barks[i] < barks[i + 1]

    def test_bark_to_hz_roundtrip(self):
        for f in [200.0, 1000.0]:
            z = float(hz_to_bark(f))
            f_back = float(bark_to_hz(z))
            assert abs(f_back - f) / f < 0.15

    def test_hz_to_bark_array(self):
        freqs = np.array([100.0, 1000.0, 8000.0])
        barks = hz_to_bark(freqs)
        assert barks.shape == (3,)
        assert barks[0] < barks[1] < barks[2]


class TestERBScale:
    def test_hz_to_erb_1000(self):
        e = float(hz_to_erb(1000.0))
        assert 14.0 < e < 16.0

    def test_erb_to_hz_roundtrip(self):
        for f in [250.0, 1000.0, 6000.0]:
            e = float(hz_to_erb(f))
            f_back = float(erb_to_hz(e))
            assert abs(f_back - f) < 1.0

    def test_erb_bandwidth_increases(self):
        bw_low = float(erb_bandwidth(500.0))
        bw_high = float(erb_bandwidth(4000.0))
        assert bw_high > bw_low

    def test_erb_bandwidth_formula(self):
        f = 1000.0
        bw = float(erb_bandwidth(f))
        expected = 24.7 * (0.00437 * f + 1.0)
        assert abs(bw - expected) < 0.01


class TestCriticalBandAnalyzer:
    def setup_method(self):
        self.cba = CriticalBandAnalyzer()

    def test_band_index_range(self):
        for f in [50, 500, 1000, 4000, 10000]:
            idx = self.cba.band_index(f)
            assert 0 <= idx <= 23

    def test_band_overlap_same_freq(self):
        overlap = self.cba.band_overlap(1000.0, 1000.0)
        assert overlap == 1.0

    def test_band_overlap_distant(self):
        overlap = self.cba.band_overlap(200.0, 8000.0)
        assert overlap == 0.0

    def test_spectral_spread(self):
        spread = self.cba.spectral_spread([200.0, 1000.0, 4000.0])
        assert spread > 0.0

    def test_spectral_spread_single(self):
        assert self.cba.spectral_spread([1000.0]) == 0.0


class TestGammatoneFilterbank:
    def setup_method(self):
        self.fb = GammatoneFilterbank(n_filters=32, f_low=100.0, f_high=4000.0)

    def test_center_freqs_count(self):
        assert len(self.fb.center_freqs) == 32

    def test_center_freqs_ordered(self):
        for i in range(31):
            assert self.fb.center_freqs[i] < self.fb.center_freqs[i + 1]

    def test_bandwidths_positive(self):
        assert np.all(self.fb.bandwidths > 0)

    def test_filter_response_shape(self):
        freqs = np.linspace(100, 4000, 500)
        resp = self.fb.filter_response(freqs, 16)
        assert resp.shape == (500,)
        assert np.max(resp) <= 1.0 + 1e-6

    def test_excitation_pattern(self):
        freqs = np.linspace(100, 4000, 256)
        spectrum = np.random.RandomState(42).rand(256)
        exc = self.fb.excitation_pattern(spectrum, freqs)
        assert exc.shape == (32,)
        assert np.all(exc >= 0)


class TestSimultaneousMasking:
    def setup_method(self):
        self.sm = SimultaneousMasking()

    def test_masking_threshold_same_freq(self):
        thr = self.sm.masking_threshold(1000.0, 80.0, 1000.0)
        assert thr == 80.0

    def test_masking_threshold_distant(self):
        thr = self.sm.masking_threshold(1000.0, 60.0, 8000.0)
        assert thr < 60.0

    def test_masked_below_threshold(self):
        assert self.sm.masked(1000.0, 80.0, 1100.0, 10.0)

    def test_not_masked_above_threshold(self):
        assert not self.sm.masked(1000.0, 40.0, 5000.0, 60.0)

    def test_composite_threshold_empty(self):
        assert self.sm.composite_threshold([], 1000.0) == 0.0

    def test_composite_threshold_single(self):
        single = self.sm.masking_threshold(500.0, 70.0, 1000.0)
        comp = self.sm.composite_threshold([(500.0, 70.0)], 1000.0)
        assert abs(comp - single) < 0.5


class TestTemporalMasking:
    def setup_method(self):
        self.tm = TemporalMasking()

    def test_forward_masking_zero_delay(self):
        assert self.tm.forward_masking(0.0, 80.0) == 80.0

    def test_forward_masking_decays(self):
        t1 = self.tm.forward_masking(5.0, 80.0)
        t2 = self.tm.forward_masking(50.0, 80.0)
        assert t1 > t2

    def test_backward_masking_zero(self):
        assert self.tm.backward_masking(0.0, 80.0) == 80.0

    def test_backward_masking_beyond_20ms(self):
        assert self.tm.backward_masking(25.0, 80.0) == 0.0

    def test_backward_masking_linear_decay(self):
        val = self.tm.backward_masking(10.0, 80.0)
        assert 0.0 < val < 80.0


class TestMaskingModel:
    def test_audibility_no_maskers(self):
        mm = MaskingModel()
        aud = mm.audibility(1000.0, 60.0, 0.0, [])
        assert aud > 0.0

    def test_audibility_strong_masker(self):
        mm = MaskingModel()
        aud = mm.audibility(1000.0, 30.0, 0.0, [(1000.0, 90.0, 0.0)])
        assert aud == 0.0

    def test_audibility_temporal_forward(self):
        mm = MaskingModel()
        aud = mm.audibility(1000.0, 50.0, 0.1, [(1000.0, 80.0, 0.0)])
        assert 0.0 <= aud <= 1.0


class TestEqualLoudness:
    def setup_method(self):
        self.el = EqualLoudness()

    def test_threshold_at_1000hz(self):
        thr = self.el.threshold_at_freq(1000.0)
        assert abs(thr - 2.4) < 0.5

    def test_threshold_out_of_range(self):
        assert self.el.threshold_at_freq(10.0) == 80.0
        assert self.el.threshold_at_freq(20000.0) == 80.0

    def test_phon_to_sone_40(self):
        s = self.el.phon_to_sone(40.0)
        assert abs(s - 1.0) < 1e-6

    def test_phon_to_sone_50(self):
        s = self.el.phon_to_sone(50.0)
        assert abs(s - 2.0) < 1e-6

    def test_sone_to_phon_roundtrip(self):
        for phon in [30.0, 40.0, 60.0, 80.0]:
            s = self.el.phon_to_sone(phon)
            p_back = self.el.sone_to_phon(s)
            assert abs(p_back - phon) < 0.1

    def test_loudness_level_below_threshold(self):
        ll = self.el.loudness_level(0.0, 1000.0)
        assert ll == 0.0


class TestSpecificLoudness:
    def test_compute_shape(self):
        sl = SpecificLoudness(n_bands=24)
        exc = np.ones(24) * 0.01
        freqs = np.linspace(100, 8000, 24)
        result = sl.compute(exc, freqs)
        assert result.shape == (24,)

    def test_total_loudness_positive(self):
        sl = SpecificLoudness(n_bands=24)
        exc = np.ones(24) * 0.1
        freqs = np.linspace(100, 8000, 24)
        total = sl.total_loudness(exc, freqs)
        assert total >= 0.0

    def test_loudness_in_sone_alias(self):
        sl = SpecificLoudness(n_bands=24)
        exc = np.ones(24) * 0.01
        freqs = np.linspace(100, 8000, 24)
        assert sl.loudness_in_sone(exc, freqs) == sl.total_loudness(exc, freqs)


class TestISO226Constants:
    def test_freqs_length(self):
        assert len(ISO_226_FREQS) == 29

    def test_threshold_length(self):
        assert len(THRESHOLD_SPL) == 29

    def test_freqs_monotonic(self):
        for i in range(28):
            assert ISO_226_FREQS[i] < ISO_226_FREQS[i + 1]

    def test_threshold_minimum_near_3khz(self):
        idx_min = np.argmin(THRESHOLD_SPL)
        assert 2000 <= ISO_226_FREQS[idx_min] <= 5000


class TestVirtualPitch:
    def setup_method(self):
        self.vp = VirtualPitch()

    def test_missing_fundamental_harmonics(self):
        harmonics = [200.0, 300.0, 400.0, 500.0]
        f0 = self.vp.missing_fundamental(harmonics)
        assert 90.0 < f0 < 110.0

    def test_missing_fundamental_empty(self):
        assert self.vp.missing_fundamental([]) == 0.0

    def test_missing_fundamental_single(self):
        assert self.vp.missing_fundamental([440.0]) == 440.0

    def test_harmonic_template_match(self):
        freqs = np.arange(50, 2000, 10.0)
        mags = np.zeros_like(freqs)
        for h in range(1, 6):
            idx = np.argmin(np.abs(freqs - 200.0 * h))
            mags[idx] = 1.0 / h
        score = self.vp.harmonic_template_match(freqs, mags, 200.0)
        assert score > 0.0

    def test_harmonic_template_zero_candidate(self):
        freqs = np.arange(50, 2000, 10.0)
        mags = np.ones_like(freqs)
        assert self.vp.harmonic_template_match(freqs, mags, 0.0) == 0.0

    def test_estimate_f0(self):
        freqs = np.arange(50, 2000, 5.0)
        mags = np.zeros_like(freqs)
        for h in range(1, 8):
            idx = np.argmin(np.abs(freqs - 220.0 * h))
            if idx < len(mags):
                mags[idx] = 1.0 / h
        f0, score = self.vp.estimate_f0(freqs, mags, f0_min=100.0, f0_max=500.0)
        assert 200.0 < f0 < 240.0
        assert score > 0.0


class TestPitchSalience:
    def setup_method(self):
        self.ps = PitchSalience()

    def test_salience_with_peak(self):
        sr = 16000
        n = 200
        acf = np.zeros(n)
        acf[0] = 1.0
        lag = sr // 440
        if lag < n:
            acf[lag] = 0.8
            acf[lag - 1] = 0.5
            acf[lag + 1] = 0.5
        peaks = self.ps.salience(acf, sr)
        assert isinstance(peaks, list)

    def test_salience_short_input(self):
        assert self.ps.salience(np.array([1.0, 0.5]), 16000) == []

    def test_pitch_strength_strong(self):
        acf = np.array([1.0, 0.2, 0.1, 0.9, 0.1])
        strength = self.ps.pitch_strength(acf)
        assert 0.0 <= strength <= 1.0
        assert strength > 0.5

    def test_pitch_strength_short(self):
        assert self.ps.pitch_strength(np.array([1.0])) == 0.0


class TestEstimatePitch:
    def test_estimate_pitch_function(self):
        freqs = np.arange(50, 2000, 5.0)
        mags = np.zeros_like(freqs)
        for h in range(1, 6):
            idx = np.argmin(np.abs(freqs - 330.0 * h))
            if idx < len(mags):
                mags[idx] = 1.0 / h
        f0, score = estimate_pitch(freqs, mags)
        assert 50.0 <= f0 <= 2000.0
        assert score >= 0.0
