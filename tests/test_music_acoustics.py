"""Tests for music_acoustics: psychoacoustics, room acoustics, spatial audio."""
import pytest
import numpy as np
from models.music_acoustics.psychoacoustics import (
    hz_to_mel, mel_to_hz, hz_to_bark, bark_to_hz, hz_to_erb, erb_to_hz,
    critical_bandwidth, equal_loudness_contour,
    a_weighting, c_weighting,
    simultaneous_masking, temporal_masking,
    spl_to_sone, sone_to_phon, phon_to_sone,
)
from models.music_acoustics.room_acoustics import (
    RoomParameters, compute_rt60, rt60_sabine, rt60_eyring, mean_free_path,
    clarity, early_decay_time, schroeder_curve, mixing_time_estimate,
    AbsorptionCoefficients, CONCRETE, CARPET, ACOUSTIC_TILE, CURTAIN_HEAVY, GLASS,
)
from models.music_acoustics.spatial_audio import (
    SPEED_OF_SOUND, HEAD_RADIUS, SpatialSource, itd, ild,
    foa_encode, foa_decode_stereo, binaural_pan,
    distance_attenuation, air_absorption_db,
    constant_power_pan, hrtf_delay_model,
)


class TestMelScale:
    def test_roundtrip(self):
        for f in [100.0, 440.0, 1000.0, 8000.0]:
            assert mel_to_hz(hz_to_mel(f)) == pytest.approx(f, rel=1e-6)

    def test_monotonic(self):
        freqs = [100, 500, 1000, 4000]
        mels = [hz_to_mel(f) for f in freqs]
        assert all(mels[i] < mels[i + 1] for i in range(len(mels) - 1))

    def test_zero(self):
        assert hz_to_mel(0.0) == pytest.approx(0.0)

    def test_array(self):
        arr = np.array([100.0, 1000.0])
        m = hz_to_mel(arr)
        assert len(m) == 2


class TestBarkScale:
    def test_roundtrip_1000(self):
        z = hz_to_bark(1000.0)
        assert z > 0
        f_back = bark_to_hz(z)
        assert f_back == pytest.approx(1000.0, rel=0.05)

    def test_monotonic(self):
        freqs = [200, 500, 1000, 4000]
        barks = [float(hz_to_bark(f)) for f in freqs]
        assert all(barks[i] < barks[i + 1] for i in range(len(barks) - 1))


class TestERBScale:
    def test_roundtrip(self):
        for f in [200.0, 1000.0, 4000.0]:
            assert erb_to_hz(hz_to_erb(f)) == pytest.approx(f, rel=1e-4)

    def test_monotonic(self):
        freqs = [100, 500, 2000, 8000]
        erbs = [float(hz_to_erb(f)) for f in freqs]
        assert all(erbs[i] < erbs[i + 1] for i in range(len(erbs) - 1))


class TestCriticalBandwidth:
    def test_low_freq(self):
        cb = critical_bandwidth(100.0)
        assert cb > 25.0

    def test_high_freq(self):
        cb_low = critical_bandwidth(200.0)
        cb_high = critical_bandwidth(8000.0)
        assert cb_high > cb_low


class TestEqualLoudness:
    def test_shape(self):
        contour = equal_loudness_contour(60.0)
        assert contour.shape[1] == 2
        assert contour.shape[0] >= 20

    def test_1k_is_phon(self):
        contour = equal_loudness_contour(60.0)
        idx_1k = np.argmin(np.abs(contour[:, 0] - 1000.0))
        assert contour[idx_1k, 1] == pytest.approx(60.0, abs=2.0)


class TestWeighting:
    def test_a_weighting_1k(self):
        w = a_weighting(1000.0)
        assert abs(w) < 3.0

    def test_a_weighting_low_freq_attenuation(self):
        w_low = a_weighting(50.0)
        w_1k = a_weighting(1000.0)
        assert w_low < w_1k

    def test_c_weighting_1k(self):
        w = c_weighting(1000.0)
        assert abs(w) < 3.0

    def test_a_weighting_array(self):
        freqs = np.array([100.0, 1000.0, 10000.0])
        w = a_weighting(freqs)
        assert len(w) == 3


class TestMasking:
    def test_simultaneous(self):
        probes = np.array([500.0, 1000.0, 2000.0, 4000.0])
        result = simultaneous_masking(1000.0, 80.0, probes)
        assert result.masker_freq == 1000.0
        assert len(result.masked_threshold) == 4

    def test_temporal_post(self):
        level = temporal_masking(50.0, 80.0, pre=False)
        assert 0 <= level <= 80.0

    def test_temporal_pre(self):
        level = temporal_masking(10.0, 80.0, pre=True)
        assert 0 <= level <= 80.0

    def test_temporal_decay(self):
        l1 = temporal_masking(10.0, 80.0)
        l2 = temporal_masking(100.0, 80.0)
        assert l1 > l2


class TestLoudness:
    def test_spl_to_sone_40phon(self):
        s = spl_to_sone(40.0, 1000.0)
        assert s == pytest.approx(1.0, abs=0.5)

    def test_sone_to_phon_1(self):
        assert sone_to_phon(1.0) == pytest.approx(40.0)

    def test_phon_sone_roundtrip(self):
        for phon in [40.0, 60.0, 80.0]:
            s = phon_to_sone(phon)
            back = sone_to_phon(s)
            assert back == pytest.approx(phon, abs=0.01)

    def test_zero_spl(self):
        assert spl_to_sone(0.0) == 0.0

    def test_zero_sone(self):
        assert sone_to_phon(0.0) == 0.0


class TestRT60:
    def test_sabine_basic(self):
        rt = rt60_sabine(200.0, 180.0, 0.3)
        assert 0.3 < rt < 1.0

    def test_eyring_basic(self):
        rt = rt60_eyring(200.0, 180.0, 0.3)
        assert 0.3 < rt < 1.0

    def test_sabine_vs_eyring(self):
        s = rt60_sabine(200.0, 180.0, 0.5)
        e = rt60_eyring(200.0, 180.0, 0.5)
        assert e < s

    def test_zero_absorption(self):
        assert rt60_sabine(200.0, 180.0, 0.0) == float("inf")

    def test_mean_free_path(self):
        mfp = mean_free_path(200.0, 180.0)
        assert mfp == pytest.approx(4.0 * 200.0 / 180.0)

    def test_compute_rt60(self):
        room = RoomParameters(volume_m3=300.0, surface_area_m2=250.0, avg_absorption=0.25)
        result = compute_rt60(room)
        assert result.rt60_sabine > 0
        assert result.rt60_eyring > 0
        assert result.mean_free_path > 0


class TestClarity:
    def test_impulse(self):
        sr = 44100
        ir = np.zeros(sr)
        ir[0] = 1.0
        ir[int(0.02 * sr)] = 0.5
        result = clarity(ir, sr)
        assert result.c50 > 0
        assert result.c80 > 0
        assert 0.0 < result.d50 <= 1.0
        assert 0.0 < result.d80 <= 1.0

    def test_empty_ir(self):
        result = clarity(np.zeros(100), 44100)
        assert result.c50 == 0.0

    def test_schroeder_curve(self):
        ir = np.random.randn(1000)
        sc = schroeder_curve(ir)
        assert len(sc) == 1000
        assert sc[0] >= sc[-1]

    def test_early_decay_time(self):
        sr = 44100
        ir = np.exp(-np.arange(sr) / (0.1 * sr))
        edt = early_decay_time(ir, sr)
        assert edt >= 0.0


class TestMixingTime:
    def test_basic(self):
        mt = mixing_time_estimate(100.0)
        assert mt > 0

    def test_larger_room(self):
        mt_small = mixing_time_estimate(50.0)
        mt_big = mixing_time_estimate(500.0)
        assert mt_big > mt_small


class TestAbsorption:
    def test_nrc_carpet(self):
        nrc = CARPET.nrc()
        assert 0.2 < nrc < 0.6

    def test_nrc_concrete(self):
        nrc = CONCRETE.nrc()
        assert nrc < 0.05

    def test_at_freq(self):
        val = ACOUSTIC_TILE.at_freq(500.0)
        assert val == pytest.approx(0.70, abs=0.01)

    def test_interpolation(self):
        val = CARPET.at_freq(375.0)
        assert 0.06 < val < 0.14

    def test_five_materials(self):
        for mat in [CONCRETE, CARPET, ACOUSTIC_TILE, CURTAIN_HEAVY, GLASS]:
            assert 0.0 <= mat.nrc() <= 1.0


class TestITD:
    def test_zero_azimuth(self):
        assert itd(0.0) == pytest.approx(0.0, abs=1e-6)

    def test_90_azimuth(self):
        d = itd(90.0)
        assert d > 0

    def test_negative_azimuth(self):
        d = itd(-45.0)
        assert d < 0


class TestILD:
    def test_zero_azimuth(self):
        assert ild(0.0, 1000.0) == pytest.approx(0.0, abs=0.1)

    def test_positive_azimuth(self):
        d = ild(45.0, 4000.0)
        assert d > 0

    def test_higher_freq_more_shadow(self):
        d_low = ild(45.0, 500.0)
        d_high = ild(45.0, 8000.0)
        assert d_high > d_low


class TestAmbisonics:
    def test_encode_shape(self):
        sig = np.ones(100)
        amb = foa_encode(sig, 0.0, 0.0)
        assert len(amb.W) == 100
        assert len(amb.X) == 100

    def test_decode_stereo_center(self):
        sig = np.ones(100)
        amb = foa_encode(sig, 0.0, 0.0)
        left, right = foa_decode_stereo(amb)
        assert np.allclose(left, right, atol=1e-10)

    def test_decode_stereo_left(self):
        sig = np.ones(100)
        amb = foa_encode(sig, 90.0, 0.0)
        left, right = foa_decode_stereo(amb)
        assert np.mean(np.abs(left)) > np.mean(np.abs(right))


class TestBinauralPan:
    def test_center(self):
        sig = np.ones(1000)
        left, right = binaural_pan(sig, 0.0)
        assert len(left) == 1000
        ratio = np.mean(np.abs(left)) / max(np.mean(np.abs(right)), 1e-10)
        assert 0.5 < ratio < 2.0

    def test_left_right_difference(self):
        sig = np.ones(1000)
        l1, r1 = binaural_pan(sig, 45.0)
        l2, r2 = binaural_pan(sig, -45.0)
        assert np.sum(np.abs(l1)) != pytest.approx(np.sum(np.abs(l2)), abs=1.0)


class TestDistanceAttenuation:
    def test_at_reference(self):
        assert distance_attenuation(1.0) == pytest.approx(1.0)

    def test_double_distance(self):
        assert distance_attenuation(2.0) == pytest.approx(0.5)

    def test_zero(self):
        assert distance_attenuation(0.0) == 1.0


class TestAirAbsorption:
    def test_positive(self):
        db = air_absorption_db(10.0, 8000.0)
        assert db > 0

    def test_increases_with_distance(self):
        db1 = air_absorption_db(5.0, 4000.0)
        db2 = air_absorption_db(50.0, 4000.0)
        assert db2 > db1

    def test_increases_with_freq(self):
        db1 = air_absorption_db(10.0, 1000.0)
        db2 = air_absorption_db(10.0, 8000.0)
        assert db2 > db1


class TestConstantPowerPan:
    def test_center(self):
        pos = constant_power_pan(0.0)
        assert pos.left_gain == pytest.approx(pos.right_gain, abs=0.01)

    def test_hard_left(self):
        pos = constant_power_pan(-1.0)
        assert pos.left_gain > pos.right_gain

    def test_hard_right(self):
        pos = constant_power_pan(1.0)
        assert pos.right_gain > pos.left_gain

    def test_power_conservation(self):
        pos = constant_power_pan(0.3)
        power = pos.left_gain ** 2 + pos.right_gain ** 2
        assert power == pytest.approx(1.0, abs=0.01)


class TestHRTF:
    def test_center(self):
        ld, rd = hrtf_delay_model(0.0, 0.0)
        assert ld == pytest.approx(rd, abs=1e-8)

    def test_left_right_difference(self):
        ld, rd = hrtf_delay_model(45.0, 0.0)
        assert ld != pytest.approx(rd)

    def test_symmetry(self):
        ld1, rd1 = hrtf_delay_model(30.0, 0.0)
        ld2, rd2 = hrtf_delay_model(-30.0, 0.0)
        assert ld1 == pytest.approx(rd2, abs=1e-10)
        assert rd1 == pytest.approx(ld2, abs=1e-10)


class TestSpatialSource:
    def test_creation(self):
        src = SpatialSource(azimuth_deg=45.0, elevation_deg=10.0, distance_m=2.0)
        assert src.azimuth_deg == 45.0
        assert src.distance_m == 2.0
