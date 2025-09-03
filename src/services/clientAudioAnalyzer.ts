// Client-side audio analysis using Web Audio API
// Provides real-time analysis capabilities for uploaded tracks

interface BasicAudioFeatures {
  duration: number
  sampleRate: number
  channels: number
  
  // Spectral features
  spectralCentroid: number
  spectralRolloff: number
  zeroCrossingRate: number
  
  // Energy features
  rmsEnergy: number
  peakLevel: number
  dynamicRange: number
  
  // Frequency content
  bassEnergy: number
  midEnergy: number
  trebleEnergy: number
  
  // Estimated musical features
  estimatedTempo?: number
  estimatedKey?: string
  estimatedCamelot?: string
  
  // Mood estimation
  estimatedValence: number // 0-1 (sad to happy)
  estimatedArousal: number // 0-1 (calm to energetic)
}

export class ClientAudioAnalyzer {
  private audioContext: AudioContext
  private analyzer: AnalyserNode
  
  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.analyzer = this.audioContext.createAnalyser()
    this.analyzer.fftSize = 2048
  }
  
  async analyzeFile(file: File): Promise<BasicAudioFeatures> {
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    
    return this.analyzeBuffer(audioBuffer)
  }
  
  analyzeBuffer(audioBuffer: AudioBuffer): BasicAudioFeatures {
    const channelData = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    const duration = audioBuffer.duration
    
    // Basic properties
    const features: BasicAudioFeatures = {
      duration,
      sampleRate,
      channels: audioBuffer.numberOfChannels,
      spectralCentroid: 0,
      spectralRolloff: 0,
      zeroCrossingRate: 0,
      rmsEnergy: 0,
      peakLevel: 0,
      dynamicRange: 0,
      bassEnergy: 0,
      midEnergy: 0,
      trebleEnergy: 0,
      estimatedValence: 0.5,
      estimatedArousal: 0.5
    }
    
    // Calculate RMS energy and peak level
    let sumSquares = 0
    let peak = 0
    let zeroCrossings = 0
    
    for (let i = 0; i < channelData.length; i++) {
      const sample = channelData[i]
      sumSquares += sample * sample
      peak = Math.max(peak, Math.abs(sample))
      
      // Zero crossing detection
      if (i > 0) {
        if ((channelData[i-1] >= 0) !== (sample >= 0)) {
          zeroCrossings++
        }
      }
    }
    
    features.rmsEnergy = Math.sqrt(sumSquares / channelData.length)
    features.peakLevel = peak
    features.dynamicRange = features.peakLevel - features.rmsEnergy
    features.zeroCrossingRate = zeroCrossings / channelData.length
    
    // Frequency domain analysis
    const fftSize = 2048
    const hopSize = fftSize / 2
    const numFrames = Math.floor((channelData.length - fftSize) / hopSize)
    
    let spectralCentroidSum = 0
    let spectralRolloffSum = 0
    let bassEnergySum = 0
    let midEnergySum = 0
    let trebleEnergySum = 0
    
    for (let frame = 0; frame < numFrames; frame++) {
      const startSample = frame * hopSize
      const frameData = channelData.slice(startSample, startSample + fftSize)
      
      // Simple FFT approximation using DFT for key frequencies
      const spectrum = this.computeSpectrum(frameData)
      
      // Calculate spectral features
      const { centroid, rolloff } = this.calculateSpectralFeatures(spectrum, sampleRate)
      spectralCentroidSum += centroid
      spectralRolloffSum += rolloff
      
      // Energy in frequency bands
      const bands = this.calculateBandEnergies(spectrum)
      bassEnergySum += bands.bass
      midEnergySum += bands.mid
      trebleEnergySum += bands.treble
    }
    
    features.spectralCentroid = spectralCentroidSum / numFrames
    features.spectralRolloff = spectralRolloffSum / numFrames
    features.bassEnergy = bassEnergySum / numFrames
    features.midEnergy = midEnergySum / numFrames
    features.trebleEnergy = trebleEnergySum / numFrames
    
    // Estimate tempo using onset detection
    features.estimatedTempo = this.estimateTempo(channelData, sampleRate)
    
    // Estimate key using chroma features (simplified)
    features.estimatedKey = this.estimateKey(channelData, sampleRate)
    features.estimatedCamelot = this.keyToCamelot(features.estimatedKey)
    
    // Estimate mood based on audio features
    const mood = this.estimateMood(features)
    features.estimatedValence = mood.valence
    features.estimatedArousal = mood.arousal
    
    return features
  }
  
  private computeSpectrum(frameData: Float32Array): Float32Array {
    const N = frameData.length
    const spectrum = new Float32Array(N / 2)
    
    // Simple DFT for demonstration (in practice, use FFT library)
    for (let k = 0; k < N / 2; k++) {
      let real = 0
      let imag = 0
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N
        real += frameData[n] * Math.cos(angle)
        imag += frameData[n] * Math.sin(angle)
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag)
    }
    
    return spectrum
  }
  
  private calculateSpectralFeatures(spectrum: Float32Array, sampleRate: number) {
    let weightedSum = 0
    let magnitudeSum = 0
    let cumulativeEnergy = 0
    let totalEnergy = 0
    
    for (let i = 0; i < spectrum.length; i++) {
      const frequency = (i * sampleRate) / (2 * spectrum.length)
      const magnitude = spectrum[i]
      
      weightedSum += frequency * magnitude
      magnitudeSum += magnitude
      totalEnergy += magnitude
    }
    
    const centroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
    
    // Calculate rolloff (frequency below which 85% of energy lies)
    const rolloffThreshold = totalEnergy * 0.85
    let rolloff = 0
    
    for (let i = 0; i < spectrum.length; i++) {
      cumulativeEnergy += spectrum[i]
      if (cumulativeEnergy >= rolloffThreshold) {
        rolloff = (i * sampleRate) / (2 * spectrum.length)
        break
      }
    }
    
    return { centroid, rolloff }
  }
  
  private calculateBandEnergies(spectrum: Float32Array) {
    const bassEnd = Math.floor(spectrum.length * 0.1)    // ~0-2kHz
    const midEnd = Math.floor(spectrum.length * 0.5)     // ~2-10kHz
    
    let bass = 0, mid = 0, treble = 0
    
    for (let i = 0; i < spectrum.length; i++) {
      if (i < bassEnd) {
        bass += spectrum[i]
      } else if (i < midEnd) {
        mid += spectrum[i]
      } else {
        treble += spectrum[i]
      }
    }
    
    return { bass, mid, treble }
  }
  
  private estimateTempo(audioData: Float32Array, sampleRate: number): number {
    // Simple onset-based tempo estimation
    const hopSize = 512
    const onsetStrength = []
    
    for (let i = hopSize; i < audioData.length - hopSize; i += hopSize) {
      const prev = audioData.slice(i - hopSize, i)
      const curr = audioData.slice(i, i + hopSize)
      
      const prevEnergy = prev.reduce((sum, x) => sum + x * x, 0)
      const currEnergy = curr.reduce((sum, x) => sum + x * x, 0)
      
      onsetStrength.push(Math.max(0, currEnergy - prevEnergy))
    }
    
    // Autocorrelation to find periodic patterns
    const maxLag = Math.floor(onsetStrength.length / 2)
    let bestTempo = 120 // Default
    let bestCorrelation = 0
    
    for (let lag = 10; lag < maxLag; lag++) {
      let correlation = 0
      let count = 0
      
      for (let i = lag; i < onsetStrength.length; i++) {
        correlation += onsetStrength[i] * onsetStrength[i - lag]
        count++
      }
      
      correlation /= count
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        const timePerFrame = hopSize / sampleRate
        const period = lag * timePerFrame
        bestTempo = 60 / period
      }
    }
    
    return Math.max(60, Math.min(200, bestTempo)) // Clamp to reasonable range
  }
  
  private estimateKey(audioData: Float32Array, sampleRate: number): string {
    // Simplified key estimation using chromagram
    const chromaBins = 12
    const chroma = new Array(chromaBins).fill(0)
    
    // Calculate chroma features (simplified)
    const fftSize = 2048
    const hopSize = fftSize / 4
    
    for (let start = 0; start < audioData.length - fftSize; start += hopSize) {
      const frame = audioData.slice(start, start + fftSize)
      const spectrum = this.computeSpectrum(frame)
      
      for (let i = 1; i < spectrum.length; i++) {
        const frequency = (i * sampleRate) / fftSize
        if (frequency > 80 && frequency < 2000) { // Focus on musical range
          const pitchClass = this.frequencyToPitchClass(frequency)
          chroma[pitchClass] += spectrum[i]
        }
      }
    }
    
    // Find dominant pitch class
    let maxEnergy = 0
    let dominantPitch = 0
    
    for (let i = 0; i < chromaBins; i++) {
      if (chroma[i] > maxEnergy) {
        maxEnergy = chroma[i]
        dominantPitch = i
      }
    }
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    return noteNames[dominantPitch] || 'C'
  }
  
  private frequencyToPitchClass(frequency: number): number {
    const A4 = 440
    const semitone = Math.round(12 * Math.log2(frequency / A4))
    return ((semitone % 12) + 12) % 12 // Ensure positive
  }
  
  private keyToCamelot(key: string): string {
    const camelotMap: Record<string, string> = {
      'C': '8B', 'C#': '3B', 'D': '10B', 'D#': '5B',
      'E': '12B', 'F': '7B', 'F#': '2B', 'G': '9B',
      'G#': '4B', 'A': '11B', 'A#': '6B', 'B': '1B'
    }
    return camelotMap[key] || '8B'
  }
  
  private estimateMood(features: BasicAudioFeatures): { valence: number; arousal: number } {
    // Simple mood estimation based on audio features
    let valence = 0.5
    let arousal = 0.5
    
    // Higher spectral centroid and treble energy suggest brightness (higher valence)
    const brightness = (features.spectralCentroid / 2000 + features.trebleEnergy) / 2
    valence += (brightness - 0.5) * 0.4
    
    // Higher RMS energy and dynamic range suggest higher arousal
    arousal += (features.rmsEnergy - 0.1) * 2
    arousal += (features.dynamicRange - 0.1) * 1.5
    
    // Tempo influences both valence and arousal
    if (features.estimatedTempo) {
      const tempoFactor = Math.max(0, Math.min(1, (features.estimatedTempo - 60) / 140))
      valence += tempoFactor * 0.3
      arousal += tempoFactor * 0.4
    }
    
    return {
      valence: Math.max(0, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal))
    }
  }
}

export default ClientAudioAnalyzer