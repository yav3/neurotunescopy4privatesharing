"""Tests for frontier music model: spectrogram, conditioning, diffusion, frontier."""
import numpy as np
import pytest

class TestSpectrogramEncoder:
    def test_encode_audio_shape(self):
        from models.music_foundation.spectrogram import SpectrogramEncoder, SpectrogramEncoderConfig
        cfg = SpectrogramEncoderConfig(n_mels=64, hidden_dim=128, latent_dim=64, n_layers=2, n_heads=4)
        enc = SpectrogramEncoder(cfg); audio = np.random.randn(22050).astype(np.float64)
        frames = enc.encode_audio(audio, sr=22050); assert frames.ndim == 2; assert frames.shape[1] == 64
    def test_encode_to_single(self):
        from models.music_foundation.spectrogram import SpectrogramEncoder, SpectrogramEncoderConfig
        cfg = SpectrogramEncoderConfig(n_mels=64, hidden_dim=128, latent_dim=64, n_layers=1, n_heads=4)
        enc = SpectrogramEncoder(cfg); emb = enc.encode_to_single(np.random.randn(11025).astype(np.float64), sr=22050)
        assert emb.ndim == 1; assert emb.shape[0] == 64
    def test_mel_computation(self):
        from models.music_foundation.spectrogram import _compute_mel_spectrogram
        mel = _compute_mel_spectrogram(np.sin(2 * np.pi * 440 * np.arange(22050) / 22050), 22050, 2048, 512, 128)
        assert mel.ndim == 2; assert mel.shape[1] == 128; assert np.all(np.isfinite(mel))
    def test_decoder_shape(self):
        from models.music_foundation.spectrogram import SpectrogramDecoder, SpectrogramEncoderConfig
        dec = SpectrogramDecoder(SpectrogramEncoderConfig(n_mels=64, hidden_dim=128, latent_dim=64, n_layers=1, n_heads=4))
        assert dec.decode(np.random.randn(10, 64)).shape == (10, 64)
    def test_params_nonempty(self):
        from models.music_foundation.spectrogram import SpectrogramEncoder, SpectrogramEncoderConfig
        p = SpectrogramEncoder(SpectrogramEncoderConfig(n_mels=64, hidden_dim=128, latent_dim=64, n_layers=1, n_heads=4)).params()
        assert len(p) > 0

class TestConditioning:
    def test_genre_encode_name(self):
        from models.music_foundation.conditioning import GenreEncoder
        emb = GenreEncoder(20, 32).encode_name("jazz"); assert emb.shape == (32,); assert np.any(emb != 0)
    def test_mood_encode_vad(self):
        from models.music_foundation.conditioning import MoodEncoder
        emb = MoodEncoder(16, 32).encode_vad(0.8, 0.6, 0.5); assert emb.shape == (32,); assert abs(emb[0] - 0.8) < 1e-10
    def test_key_encode(self):
        from models.music_foundation.conditioning import KeyEncoder
        enc = KeyEncoder(12, 2, 16); assert not np.allclose(enc.encode_name("C major"), enc.encode_name("A minor"))
    def test_tempo_encode(self):
        from models.music_foundation.conditioning import TempoEncoder
        enc = TempoEncoder(16); assert not np.allclose(enc.encode(60.0), enc.encode(180.0))
    def test_tag_encode_hash(self):
        from models.music_foundation.conditioning import TagEncoder
        assert TagEncoder(1000, 32, 10).encode_hash(["acoustic", "guitar", "fingerpicking"]).shape == (32,)
    def test_conditioning_module_full(self):
        from models.music_foundation.conditioning import ConditioningModule
        cond = ConditioningModule().encode(genre="rock", mood="energetic", key="E minor", tempo_bpm=120.0, tags=["electric"])
        assert cond.shape == (128,); assert np.all(np.isfinite(cond))
    def test_null_conditioning(self):
        from models.music_foundation.conditioning import ConditioningModule
        null = ConditioningModule().null_conditioning(); assert np.all(null == 0); assert null.shape == (128,)
    def test_film_modulate(self):
        from models.music_foundation.conditioning import FiLMLayer
        assert FiLMLayer(cond_dim=128, feature_dim=64).modulate(np.random.randn(5, 64), np.random.randn(128)).shape == (5, 64)
    def test_genre_integer_input(self):
        from models.music_foundation.conditioning import ConditioningModule
        assert ConditioningModule().encode(genre=3).shape == (128,)

class TestDiffusion:
    def test_schedule_linear(self):
        from models.music_foundation.diffusion import DiffusionConfig, _make_schedule
        sched = _make_schedule(DiffusionConfig(n_timesteps=100)); assert sched["betas"].shape == (100,)
    def test_schedule_cosine(self):
        from models.music_foundation.diffusion import DiffusionConfig, _make_schedule
        sched = _make_schedule(DiffusionConfig(n_timesteps=100, schedule="cosine")); assert sched["alpha_cumprod"][0] > sched["alpha_cumprod"][-1]
    def test_q_sample(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        model = LatentDiffusionModel(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4, n_timesteps=50), seed=42)
        x_0 = np.random.randn(4, 32); x_t = model.q_sample(x_0, t=25); assert x_t.shape == x_0.shape
    def test_training_loss_finite(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        loss = LatentDiffusionModel(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4, n_timesteps=50), seed=42).training_loss(np.random.randn(4, 32))
        assert np.isfinite(loss); assert loss > 0
    def test_training_loss_with_cond(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        assert np.isfinite(LatentDiffusionModel(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4, n_timesteps=50, cond_dim=64), seed=42).training_loss(np.random.randn(4, 32), np.random.randn(64)))
    def test_sample_shape(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        sample = LatentDiffusionModel(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4, n_timesteps=20), seed=42).sample(shape=(8, 32), n_steps=5)
        assert sample.shape == (8, 32); assert np.all(np.isfinite(sample))
    def test_sample_with_cond(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        assert LatentDiffusionModel(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4, n_timesteps=20, cond_dim=64, cfg_scale=2.0), seed=42).sample(shape=(4, 32), cond=np.random.randn(64), n_steps=5).shape == (4, 32)
    def test_sample_progressive(self):
        from models.music_foundation.diffusion import LatentDiffusionModel, DiffusionConfig
        intermediates = LatentDiffusionModel(DiffusionConfig(latent_dim=16, hidden_dim=32, n_layers=1, n_heads=4, n_timesteps=20), seed=42).sample_progressive(shape=(2, 16), save_every=5)
        assert len(intermediates) >= 2
    def test_timestep_embedding(self):
        from models.music_foundation.diffusion import TimestepEmbedding
        emb = TimestepEmbedding(dim=64); assert not np.allclose(emb.forward(0), emb.forward(50))
    def test_noise_predictor_params(self):
        from models.music_foundation.diffusion import NoisePredictor, DiffusionConfig
        assert len(NoisePredictor(DiffusionConfig(latent_dim=32, hidden_dim=64, n_layers=1, n_heads=4)).params()) > 0

class TestFrontierModel:
    def _make_model(self):
        from models.music_foundation.frontier import MusicFrontierModel, FrontierConfig
        return MusicFrontierModel(FrontierConfig(n_mels=32, n_fft=512, hop_length=128, latent_dim=32, hidden_dim=64, n_heads=4, spec_layers=1, dec_layers=1, diff_layers=1, n_timesteps=20, codebook_size=64, n_codebooks=2, max_gen_frames=32, griffin_lim_iters=4), seed=42)
    def test_encode_shape(self):
        frames = self._make_model().encode(np.random.randn(4410).astype(np.float64), sr=22050); assert frames.ndim == 2; assert frames.shape[1] == 32
    def test_encode_to_tokens(self):
        tokens = self._make_model().encode_to_tokens(np.random.randn(4410).astype(np.float64), sr=22050); assert len(tokens) == 2
    def test_generate_latents(self):
        latents = self._make_model().generate_latents(n_frames=8, genre="jazz", mood="calm", seed=42); assert latents.shape == (8, 32)
    def test_generate_mel(self):
        mel = self._make_model().generate_mel(n_frames=8, genre="rock", seed=42); assert mel.ndim == 2
    def test_generate_audio_shape(self):
        audio = self._make_model().generate_audio(duration_s=0.1, genre="electronic", seed=42); assert audio.ndim == 1; assert len(audio) > 0
    def test_training_loss(self):
        losses = self._make_model().training_loss(np.random.randn(4410).astype(np.float64), sr=22050)
        assert all(k in losses for k in ["total", "reconstruction", "commitment", "diffusion"])
    def test_reconstruct(self):
        assert self._make_model().reconstruct(np.sin(2 * np.pi * 440 * np.arange(4410) / 22050), sr=22050).ndim == 1
    def test_interpolate(self):
        m = self._make_model(); a = np.sin(2*np.pi*440*np.arange(4410)/22050); b = np.sin(2*np.pi*880*np.arange(4410)/22050)
        assert m.interpolate(a, b, alpha=0.5, sr=22050).ndim == 1
    def test_style_transfer(self):
        assert self._make_model().style_transfer(np.sin(2*np.pi*440*np.arange(4410)/22050), style_genre="jazz", strength=0.7, sr=22050).ndim == 1
    def test_params(self): assert len(self._make_model().params()) > 0
    def test_conditioning_affects_generation(self):
        m = self._make_model(); assert not np.allclose(m.generate_latents(n_frames=8, genre="rock", seed=0), m.generate_latents(n_frames=8, genre="jazz", seed=0), atol=1e-6)

class TestGriffinLim:
    def test_roundtrip_energy(self):
        from models.music_foundation.frontier import _griffin_lim
        audio = _griffin_lim(np.random.RandomState(42).rand(16, 32) * 10.0, n_fft=512, hop_length=128, sr=22050, n_iters=8, n_mels=32)
        assert len(audio) > 0; assert np.all(np.isfinite(audio))
    def test_longer_mel(self):
        from models.music_foundation.frontier import _griffin_lim
        assert len(_griffin_lim(np.random.RandomState(0).rand(64, 64) * 5.0, n_fft=1024, hop_length=256, sr=22050, n_iters=4, n_mels=64)) > 100
