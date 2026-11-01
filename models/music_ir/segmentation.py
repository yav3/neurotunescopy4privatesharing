"""Audio segmentation: onset detection, beat tracking, structural analysis, chroma."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import numpy as np


class OnsetDetector:
    """Spectral-flux onset detection."""

    def __init__(self, n_fft: int = 1024, hop: int = 512):
        self.n_fft = n_fft
        self.hop = hop

    def detect(
        self,
        signal: np.ndarray,
        sr: int = 22050,
        threshold: float = 0.5,
    ) -> list[float]:
        flux = self._spectral_flux(signal)
        if len(flux) == 0:
            return []
        norm = flux / (np.max(flux) + 1e-12)
        peaks = self._pick_peaks(norm, threshold)
        return [float(p * self.hop / sr) for p in peaks]

    def onset_strength(self, signal: np.ndarray, sr: int = 22050) -> np.ndarray:
        flux = self._spectral_flux(signal)
        if len(flux) == 0:
            return np.array([], dtype=np.float32)
        return (flux / (np.max(flux) + 1e-12)).astype(np.float32)

    def _spectral_flux(self, signal: np.ndarray) -> np.ndarray:
        sig = np.asarray(signal, dtype=np.float64)
        window = np.hanning(self.n_fft)
        n_frames = max(1, 1 + (len(sig) - self.n_fft) // self.hop)
        n_bins = self.n_fft // 2 + 1
        prev_spec = np.zeros(n_bins, dtype=np.float64)
        flux = np.zeros(n_frames, dtype=np.float64)
        for i in range(n_frames):
            start = i * self.hop
            frame = sig[start:start + self.n_fft]
            if len(frame) < self.n_fft:
                frame = np.pad(frame, (0, self.n_fft - len(frame)))
            spec = np.abs(np.fft.rfft(frame * window))
            diff = spec - prev_spec
            flux[i] = float(np.sum(np.maximum(diff, 0)))
            prev_spec = spec
        return flux.astype(np.float32)

    @staticmethod
    def _pick_peaks(signal: np.ndarray, threshold: float) -> list[int]:
        peaks: list[int] = []
        for i in range(1, len(signal) - 1):
            if signal[i] > threshold and signal[i] > signal[i - 1] and signal[i] >= signal[i + 1]:
                peaks.append(i)
        return peaks


class BeatTracker:
    """Autocorrelation-based beat tracker."""

    def __init__(self, min_bpm: float = 60.0, max_bpm: float = 200.0):
        self.min_bpm = min_bpm
        self.max_bpm = max_bpm

    def track(
        self,
        signal: np.ndarray,
        sr: int = 22050,
        hop: int = 512,
    ) -> dict[str, Any]:
        onset_det = OnsetDetector(hop=hop)
        odf = onset_det.onset_strength(signal, sr)
        if len(odf) < 4:
            return {"bpm": 0.0, "beats": [], "beat_frames": []}

        tempo = self._estimate_tempo(odf, sr, hop)
        beats = self._find_beats(odf, tempo, sr, hop)
        return {
            "bpm": tempo,
            "beats": beats,
            "beat_frames": [int(b * sr / hop) for b in beats],
        }

    def _estimate_tempo(self, odf: np.ndarray, sr: int, hop: int) -> float:
        frame_rate = sr / hop
        min_lag = int(60.0 * frame_rate / self.max_bpm)
        max_lag = int(60.0 * frame_rate / self.min_bpm)
        max_lag = min(max_lag, len(odf) - 1)
        if min_lag >= max_lag:
            return 120.0

        odf_centered = odf - np.mean(odf)
        ac = np.correlate(odf_centered, odf_centered, mode="full")
        ac = ac[len(odf_centered) - 1:]

        search = ac[min_lag:max_lag + 1]
        if len(search) == 0:
            return 120.0
        best_lag = min_lag + int(np.argmax(search))
        if best_lag == 0:
            return 120.0
        return float(60.0 * frame_rate / best_lag)

    @staticmethod
    def _find_beats(odf: np.ndarray, bpm: float, sr: int, hop: int) -> list[float]:
        if bpm <= 0:
            return []
        frame_rate = sr / hop
        beat_period_frames = 60.0 * frame_rate / bpm
        beats: list[float] = []
        pos = 0.0
        while pos < len(odf):
            window_start = max(0, int(pos) - 2)
            window_end = min(len(odf), int(pos) + 3)
            if window_start < window_end:
                local = odf[window_start:window_end]
                best_offset = int(np.argmax(local))
                actual_frame = window_start + best_offset
                beats.append(float(actual_frame * hop / sr))
            pos += beat_period_frames
        return beats


class StructuralSegmenter:
    """Self-similarity matrix segmentation for section boundary detection."""

    def __init__(self, n_fft: int = 2048, hop: int = 1024):
        self.n_fft = n_fft
        self.hop = hop

    def segment(
        self,
        signal: np.ndarray,
        sr: int = 22050,
        n_segments: int = 4,
    ) -> list[dict[str, Any]]:
        features = self._extract_frame_features(signal, sr)
        if len(features) < 2:
            return [{"start": 0.0, "end": float(len(signal) / sr), "label": "A"}]

        ssm = self._self_similarity_matrix(features)
        boundaries = self._find_boundaries(ssm, n_segments)
        boundaries = [0] + boundaries + [len(features)]

        segments: list[dict[str, Any]] = []
        labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        for i in range(len(boundaries) - 1):
            start_time = boundaries[i] * self.hop / sr
            end_time = boundaries[i + 1] * self.hop / sr
            segments.append({
                "start": float(start_time),
                "end": float(end_time),
                "label": labels[i % len(labels)],
                "frame_start": boundaries[i],
                "frame_end": boundaries[i + 1],
            })
        return segments

    def self_similarity(self, signal: np.ndarray, sr: int = 22050) -> np.ndarray:
        features = self._extract_frame_features(signal, sr)
        return self._self_similarity_matrix(features)

    def _extract_frame_features(self, signal: np.ndarray, sr: int) -> np.ndarray:
        sig = np.asarray(signal, dtype=np.float64)
        window = np.hanning(self.n_fft)
        n_frames = max(1, 1 + (len(sig) - self.n_fft) // self.hop)
        n_mfcc = 13
        features = np.zeros((n_frames, n_mfcc), dtype=np.float32)
        for i in range(n_frames):
            start = i * self.hop
            frame = sig[start:start + self.n_fft]
            if len(frame) < self.n_fft:
                frame = np.pad(frame, (0, self.n_fft - len(frame)))
            power = np.abs(np.fft.rfft(frame * window)) ** 2
            log_power = np.log(power + 1e-10)
            dct_out = np.fft.rfft(log_power).real
            features[i, :] = dct_out[:n_mfcc]
        return features

    @staticmethod
    def _self_similarity_matrix(features: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(features, axis=1, keepdims=True)
        norms = np.maximum(norms, 1e-12)
        normalized = features / norms
        return (normalized @ normalized.T).astype(np.float32)

    @staticmethod
    def _find_boundaries(ssm: np.ndarray, n_segments: int) -> list[int]:
        n = ssm.shape[0]
        if n < 2 or n_segments <= 1:
            return []
        novelty = np.zeros(n, dtype=np.float64)
        kernel_size = max(4, n // 20)
        for i in range(kernel_size, n - kernel_size):
            before = ssm[i - kernel_size:i, i - kernel_size:i]
            after = ssm[i:i + kernel_size, i:i + kernel_size]
            cross = ssm[i - kernel_size:i, i:i + kernel_size]
            novelty[i] = float(np.mean(before) + np.mean(after) - 2 * np.mean(cross))

        n_boundaries = min(n_segments - 1, max(1, n // 4))
        peaks: list[tuple[int, float]] = []
        for i in range(1, n - 1):
            if novelty[i] > novelty[i - 1] and novelty[i] >= novelty[i + 1]:
                peaks.append((i, novelty[i]))
        peaks.sort(key=lambda x: x[1], reverse=True)
        boundary_frames = sorted([p[0] for p in peaks[:n_boundaries]])
        return boundary_frames


class ChromaAnalyzer:
    """Chroma (pitch class) feature extraction."""

    NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    def __init__(self, n_fft: int = 4096, hop: int = 2048):
        self.n_fft = n_fft
        self.hop = hop

    def chromagram(self, signal: np.ndarray, sr: int = 22050) -> np.ndarray:
        sig = np.asarray(signal, dtype=np.float64)
        window = np.hanning(self.n_fft)
        n_frames = max(1, 1 + (len(sig) - self.n_fft) // self.hop)
        chroma = np.zeros((12, n_frames), dtype=np.float32)
        freqs = np.fft.rfftfreq(self.n_fft, 1.0 / sr)

        pitch_bins = np.zeros(len(freqs), dtype=int)
        for i, f in enumerate(freqs):
            if f > 20:
                midi = 12 * np.log2(f / 440.0) + 69
                pitch_bins[i] = int(round(midi)) % 12
            else:
                pitch_bins[i] = -1

        for i in range(n_frames):
            start = i * self.hop
            frame = sig[start:start + self.n_fft]
            if len(frame) < self.n_fft:
                frame = np.pad(frame, (0, self.n_fft - len(frame)))
            power = np.abs(np.fft.rfft(frame * window)) ** 2
            for j, pc in enumerate(pitch_bins):
                if pc >= 0:
                    chroma[pc, i] += power[j]

        col_norms = np.linalg.norm(chroma, axis=0, keepdims=True)
        col_norms = np.maximum(col_norms, 1e-12)
        chroma /= col_norms
        return chroma

    def key_profile(self, signal: np.ndarray, sr: int = 22050) -> dict[str, float]:
        cg = self.chromagram(signal, sr)
        avg = cg.mean(axis=1)
        total = avg.sum()
        if total < 1e-12:
            return {n: 0.0 for n in self.NOTE_NAMES}
        return {self.NOTE_NAMES[i]: float(avg[i] / total) for i in range(12)}

    def estimate_key(self, signal: np.ndarray, sr: int = 22050) -> tuple[str, str]:
        profile = self.key_profile(signal, sr)
        best_note = max(profile, key=profile.get)
        idx = self.NOTE_NAMES.index(best_note)
        minor_third = profile[self.NOTE_NAMES[(idx + 3) % 12]]
        major_third = profile[self.NOTE_NAMES[(idx + 4) % 12]]
        mode = "major" if major_third >= minor_third else "minor"
        return best_note, mode
