"""Frontier music model: end-to-end generative music system."""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any
import numpy as np
from .encoder import MusicFoundationModel, EncoderConfig
from .spectrogram import SpectrogramEncoder, SpectrogramDecoder, SpectrogramEncoderConfig
from .tokenizer import MusicTokenizer, MusicCodebook
from .decoder import MusicDecoder, DecoderConfig, GenerationHead, ReconstructionHead
from .conditioning import ConditioningModule, ConditioningConfig, FiLMLayer
from .diffusion import LatentDiffusionModel, DiffusionConfig
from .positional import sinusoidal_encoding

@dataclass
class FrontierConfig:
    sr: int = 22050; n_mels: int = 128; n_fft: int = 2048; hop_length: int = 512
    latent_dim: int = 128; hidden_dim: int = 256; n_heads: int = 4
    spec_layers: int = 4; dec_layers: int = 4; diff_layers: int = 4
    n_timesteps: int = 200; cfg_scale: float = 3.0; n_codebooks: int = 4
    codebook_size: int = 512; max_gen_frames: int = 256; griffin_lim_iters: int = 32

def _griffin_lim(mel, n_fft, hop_length, sr, n_iters=32, n_mels=128):
    f_max = sr / 2.0; mel_min = 2595.0 * np.log10(1.0 + 0.0 / 700.0)
    mel_max = 2595.0 * np.log10(1.0 + f_max / 700.0)
    mel_pts = np.linspace(mel_min, mel_max, n_mels + 2)
    hz_pts = 700.0 * (10.0 ** (mel_pts / 2595.0) - 1.0)
    bins = np.floor((n_fft + 1) * hz_pts / sr).astype(int)
    n_freq = n_fft // 2 + 1; fb = np.zeros((n_mels, n_freq))
    for m_idx in range(n_mels):
        left, center, right = bins[m_idx], bins[m_idx + 1], bins[m_idx + 2]
        for k in range(left, center):
            if center > left: fb[m_idx, k] = (k - left) / (center - left)
        for k in range(center, right):
            if right > center: fb[m_idx, k] = (right - k) / (right - center)
    fb_pinv = np.linalg.pinv(fb); linear_spec = np.maximum(fb_pinv @ mel.T, 0.0)
    n_frames = linear_spec.shape[1]; rng = np.random.RandomState(0)
    phase = np.exp(2j * np.pi * rng.rand(*linear_spec.shape))
    for _ in range(n_iters):
        stft_complex = linear_spec * phase; expected_len = n_fft + hop_length * (n_frames - 1)
        signal = np.zeros(expected_len); w = 0.5 * (1 - np.cos(2 * np.pi * np.arange(n_fft) / n_fft))
        win_sum = np.zeros(expected_len)
        for i in range(n_frames):
            start = i * hop_length; frame = np.fft.irfft(stft_complex[:, i], n=n_fft)
            signal[start:start + n_fft] += frame * w; win_sum[start:start + n_fft] += w ** 2
        nonzero = win_sum > 1e-10; signal[nonzero] /= win_sum[nonzero]
        new_stft = np.zeros((n_freq, n_frames), dtype=complex)
        padded = np.pad(signal, (n_fft // 2, n_fft // 2), mode="reflect")
        for i in range(n_frames):
            start = i * hop_length; segment = padded[start:start + n_fft] * w
            new_stft[:, i] = np.fft.rfft(segment)
        phase = np.exp(1j * np.angle(new_stft))
    final_stft = linear_spec * phase; expected_len = n_fft + hop_length * (n_frames - 1)
    output = np.zeros(expected_len); w = 0.5 * (1 - np.cos(2 * np.pi * np.arange(n_fft) / n_fft))
    win_sum = np.zeros(expected_len)
    for i in range(n_frames):
        start = i * hop_length; frame = np.fft.irfft(final_stft[:, i], n=n_fft)
        output[start:start + n_fft] += frame * w; win_sum[start:start + n_fft] += w ** 2
    nonzero = win_sum > 1e-10; output[nonzero] /= win_sum[nonzero]
    pad = n_fft // 2; return output[pad:-pad] if pad > 0 and len(output) > 2 * pad else output

class MusicFrontierModel:
    def __init__(self, config=None, seed: int = 0) -> None:
        self.config = config or FrontierConfig(); c = self.config
        spec_cfg = SpectrogramEncoderConfig(n_mels=c.n_mels, n_fft=c.n_fft, hop_length=c.hop_length, hidden_dim=c.hidden_dim, latent_dim=c.latent_dim, n_heads=c.n_heads, n_layers=c.spec_layers)
        self.spec_encoder = SpectrogramEncoder(spec_cfg, seed); self.spec_decoder = SpectrogramDecoder(spec_cfg, seed + 1000)
        self.tokenizer = MusicTokenizer(n_codes=c.codebook_size, dim=c.latent_dim, n_quantizers=c.n_codebooks, seed=seed + 2000)
        self.conditioning = ConditioningModule(seed=seed + 3000)
        diff_cfg = DiffusionConfig(latent_dim=c.latent_dim, hidden_dim=c.hidden_dim, n_heads=c.n_heads, n_layers=c.diff_layers, n_timesteps=c.n_timesteps, cfg_scale=c.cfg_scale)
        self.diffusion = LatentDiffusionModel(diff_cfg, seed + 4000)
        self.film = FiLMLayer(cond_dim=self.conditioning.config.cond_dim, feature_dim=c.latent_dim, seed=seed + 5000)
        dec_cfg = DecoderConfig(latent_dim=c.latent_dim, hidden_dim=c.hidden_dim, output_dim=c.latent_dim, n_heads=c.n_heads, n_layers=c.dec_layers)
        self.ar_decoder = MusicDecoder(dec_cfg, seed + 6000); self.recon_head = ReconstructionHead(c.latent_dim, c.n_mels, seed + 7000)
    def encode(self, audio, sr=None): return self.spec_encoder.encode_audio(audio, sr or self.config.sr)
    def encode_to_tokens(self, audio, sr=None): return self.tokenizer.tokenize(self.encode(audio, sr))
    def decode_tokens(self, tokens): return self.spec_decoder.decode(self.tokenizer.detokenize(tokens))
    def decode_to_audio(self, mel, sr=None):
        sr = sr or self.config.sr; mel_linear = np.expm1(np.maximum(mel, 0.0))
        return _griffin_lim(mel_linear, self.config.n_fft, self.config.hop_length, sr, self.config.griffin_lim_iters, self.config.n_mels)
    def generate_latents(self, n_frames=None, genre=None, mood=None, key=None, tempo_bpm=None, tags=None, seed=None):
        n_frames = n_frames or self.config.max_gen_frames
        cond = self.conditioning.encode(genre=genre, mood=mood, key=key, tempo_bpm=tempo_bpm, tags=tags)
        if seed is not None: self.diffusion.rng = np.random.RandomState(seed)
        latents = self.diffusion.sample(shape=(n_frames, self.config.latent_dim), cond=cond, n_steps=min(50, self.config.n_timesteps))
        return self.film.modulate(latents, cond)
    def generate_mel(self, **kwargs): return self.spec_decoder.decode(self.generate_latents(**kwargs))
    def generate_audio(self, duration_s=5.0, **kwargs):
        sr = kwargs.pop("sr", self.config.sr); n_frames = min(int(duration_s * sr / self.config.hop_length), self.config.max_gen_frames)
        return self.decode_to_audio(self.generate_mel(n_frames=n_frames, **kwargs), sr)
    def reconstruct(self, audio, sr=None): return self.decode_to_audio(self.spec_decoder.decode(self.encode(audio, sr)), sr or self.config.sr)
    def interpolate(self, audio_a, audio_b, alpha=0.5, sr=None):
        sr_val = sr or self.config.sr
        z_mix = (1 - alpha) * self.spec_encoder.encode_to_single(audio_a, sr_val) + alpha * self.spec_encoder.encode_to_single(audio_b, sr_val)
        return self.decode_to_audio(self.spec_decoder.decode(np.tile(z_mix, (64, 1))), sr_val)
    def style_transfer(self, content_audio, style_genre=None, style_mood=None, strength=0.5, sr=None):
        sr = sr or self.config.sr; frames = self.encode(content_audio, sr)
        cond = self.conditioning.encode(genre=style_genre, mood=style_mood)
        blended = (1 - strength) * frames + strength * self.film.modulate(frames, cond)
        return self.decode_to_audio(self.spec_decoder.decode(blended), sr)
    def training_loss(self, audio, sr=None, cond=None):
        sr = sr or self.config.sr; frames = self.encode(audio, sr)
        recon_mel = self.spec_decoder.decode(frames)
        from .spectrogram import _compute_mel_spectrogram
        target_mel = _compute_mel_spectrogram(audio.astype(np.float64), sr, self.config.n_fft, self.config.hop_length, self.config.n_mels)
        min_len = min(recon_mel.shape[0], target_mel.shape[0])
        recon_loss = float(np.mean((recon_mel[:min_len] - target_mel[:min_len]) ** 2))
        vq_loss = self.tokenizer.commitment_loss(frames); diff_loss = self.diffusion.training_loss(frames, cond)
        return {"total": recon_loss + 0.25 * vq_loss + diff_loss, "reconstruction": recon_loss, "commitment": vq_loss, "diffusion": diff_loss}
    def params(self):
        p = {}; p.update(self.spec_encoder.params()); p.update(self.diffusion.params()); return p
