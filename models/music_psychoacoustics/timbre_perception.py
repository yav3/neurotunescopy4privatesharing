"""Timbre perception: multidimensional descriptors, roughness, distance metrics."""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np

@dataclass
class TimbreDescriptors:
    brightness: float
    warmth: float
    roughness: float
    attack_time_ms: float
    spectral_centroid: float
    spectral_spread: float
    spectral_flatness: float
    spectral_rolloff: float
    spectral_flux: float
    odd_even_ratio: float
    inharmonicity: float
    temporal_centroid: float

def spectral_centroid(magnitude: np.ndarray, freqs: np.ndarray) -> float:
    total = np.sum(magnitude)
    if total < 1e-12: return 0.0
    return float(np.sum(freqs * magnitude) / total)

def spectral_spread(magnitude: np.ndarray, freqs: np.ndarray) -> float:
    sc = spectral_centroid(magnitude, freqs)
    total = np.sum(magnitude)
    if total < 1e-12: return 0.0
    return float(np.sqrt(np.sum(magnitude * (freqs - sc) ** 2) / total))

def spectral_flatness(magnitude: np.ndarray) -> float:
    mag = magnitude[magnitude > 0]
    if len(mag) == 0: return 0.0
    geo = np.exp(np.mean(np.log(mag + 1e-20)))
    arith = np.mean(mag)
    if arith < 1e-12: return 0.0
    return float(geo / arith)

def spectral_rolloff(magnitude: np.ndarray, freqs: np.ndarray, percentile: float = 0.85) -> float:
    cumsum = np.cumsum(magnitude)
    total = cumsum[-1] if len(cumsum) > 0 else 0
    if total < 1e-12: return 0.0
    idx = np.searchsorted(cumsum, percentile * total)
    idx = min(idx, len(freqs) - 1)
    return float(freqs[idx])

def spectral_flux(mag_current: np.ndarray, mag_previous: np.ndarray) -> float:
    return float(np.sqrt(np.sum((mag_current - mag_previous) ** 2)))

def odd_even_ratio(magnitude: np.ndarray, f0: float, sr: int, n_fft: int, n_harmonics: int = 10) -> float:
    bin_res = sr / n_fft
    odd_energy = even_energy = 0.0
    for h in range(1, n_harmonics + 1):
        b = int(round(f0 * h / bin_res))
        if b >= len(magnitude): break
        e = float(magnitude[b] ** 2)
        if h % 2 == 1: odd_energy += e
        else: even_energy += e
    if even_energy < 1e-12:
        return float("inf") if odd_energy > 1e-12 else 1.0
    return float(odd_energy / even_energy)

def inharmonicity(magnitude: np.ndarray, f0: float, sr: int, n_fft: int, n_harmonics: int = 10) -> float:
    if f0 < 1.0: return 0.0
    bin_res = sr / n_fft
    total_weight = weighted_dev = 0.0
    for h in range(1, n_harmonics + 1):
        ideal_freq = f0 * h
        centre = int(round(ideal_freq / bin_res))
        lo = max(0, centre - 3)
        hi = min(len(magnitude) - 1, centre + 3)
        if lo >= len(magnitude): break
        region = magnitude[lo : hi + 1]
        if len(region) == 0: continue
        actual_bin = lo + int(np.argmax(region))
        dev = abs(actual_bin * bin_res - ideal_freq) / ideal_freq
        weight = float(magnitude[actual_bin] ** 2)
        weighted_dev += dev * weight
        total_weight += weight
    if total_weight < 1e-12: return 0.0
    return float(weighted_dev / total_weight)

def attack_time(envelope: np.ndarray, sr: int, threshold: float = 0.9) -> float:
    if len(envelope) == 0: return 0.0
    peak = np.max(envelope)
    if peak < 1e-12: return 0.0
    idx = np.searchsorted(envelope, threshold * peak)
    if idx >= len(envelope): idx = len(envelope) - 1
    return float(idx / sr * 1000.0)

def brightness(magnitude: np.ndarray, freqs: np.ndarray, cutoff: float = 1500.0) -> float:
    mask = freqs >= cutoff
    high = np.sum(magnitude[mask] ** 2) if mask.any() else 0.0
    total = np.sum(magnitude ** 2)
    if total < 1e-12: return 0.0
    return float(high / total)

def warmth(magnitude: np.ndarray, freqs: np.ndarray, low: float = 100.0, high: float = 500.0) -> float:
    mask = (freqs >= low) & (freqs <= high)
    band = np.sum(magnitude[mask] ** 2) if mask.any() else 0.0
    total = np.sum(magnitude ** 2)
    if total < 1e-12: return 0.0
    return float(band / total)

def roughness_dissonance(f1: float, f2: float, a1: float = 1.0, a2: float = 1.0) -> float:
    s = 0.24 / (0.0207 * min(f1, f2) + 18.96)
    diff = abs(f2 - f1)
    r = a1 * a2 * (np.exp(-3.5 * s * diff) - np.exp(-5.75 * s * diff))
    return float(max(0.0, r))

def total_roughness(frequencies: np.ndarray, amplitudes: np.ndarray) -> float:
    n = len(frequencies)
    r = 0.0
    for i in range(n):
        for j in range(i + 1, n):
            r += roughness_dissonance(frequencies[i], frequencies[j], amplitudes[i], amplitudes[j])
    return float(r)

def temporal_centroid(envelope: np.ndarray, sr: int) -> float:
    if len(envelope) == 0: return 0.0
    t = np.arange(len(envelope)) / sr
    total = np.sum(envelope)
    if total < 1e-12: return 0.0
    return float(np.sum(t * envelope) / total)

def analyze_timbre(signal: np.ndarray, sr: int = 44100, n_fft: int = 4096, f0: float = 0.0) -> TimbreDescriptors:
    windowed = signal[: n_fft] * np.hanning(min(n_fft, len(signal)))
    spectrum = np.abs(np.fft.rfft(windowed, n=n_fft))
    freqs = np.fft.rfftfreq(n_fft, d=1.0 / sr)
    sc = spectral_centroid(spectrum, freqs)
    ss = spectral_spread(spectrum, freqs)
    sf = spectral_flatness(spectrum)
    sr_ = spectral_rolloff(spectrum, freqs)
    oer = odd_even_ratio(spectrum, f0, sr, n_fft) if f0 > 0 else 1.0
    inh = inharmonicity(spectrum, f0, sr, n_fft) if f0 > 0 else 0.0
    env = np.abs(signal)
    at = attack_time(env, sr)
    br = brightness(spectrum, freqs)
    wm = warmth(spectrum, freqs)
    tc = temporal_centroid(env, sr)
    freqs_partial = freqs[spectrum > np.max(spectrum) * 0.01]
    amps_partial = spectrum[spectrum > np.max(spectrum) * 0.01]
    rg = total_roughness(freqs_partial[:20], amps_partial[:20]) if len(freqs_partial) > 1 else 0.0
    return TimbreDescriptors(brightness=br, warmth=wm, roughness=rg, attack_time_ms=at,
        spectral_centroid=sc, spectral_spread=ss, spectral_flatness=sf, spectral_rolloff=sr_,
        spectral_flux=0.0, odd_even_ratio=oer, inharmonicity=inh, temporal_centroid=tc)

def timbre_distance(a: TimbreDescriptors, b: TimbreDescriptors, weights: dict[str, float] | None = None) -> float:
    default_w = {"brightness": 1.0, "warmth": 1.0, "roughness": 1.0, "attack_time_ms": 0.5,
        "spectral_centroid": 0.001, "spectral_spread": 0.001, "spectral_flatness": 1.0,
        "spectral_rolloff": 0.0005, "spectral_flux": 1.0, "odd_even_ratio": 0.5,
        "inharmonicity": 2.0, "temporal_centroid": 1.0}
    w = weights or default_w
    d2 = sum(scale * (getattr(a, fn, 0.0) - getattr(b, fn, 0.0)) ** 2 for fn, scale in w.items())
    return float(np.sqrt(d2))
