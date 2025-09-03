// Client-side audio processing utilities
// Note: Full FFmpeg processing would require server-side implementation

export interface AudioMetadata {
  duration: number
  sampleRate: number
  channels: number
  bitrate?: number
  format: string
}

export interface SpectralAnalysisResult {
  delta_band_power: number
  theta_band_power: number
  alpha_band_power: number
  beta_band_power: number
  gamma_band_power: number
  therapeutic_delta_score: number
  therapeutic_theta_score: number
  therapeutic_alpha_score: number
  therapeutic_beta_score: number
  therapeutic_gamma_score: number
  spectral_centroid?: number
  spectral_bandwidth?: number
  fundamental_frequency?: number
}

export class AudioProcessor {
  // Enhanced metadata extraction with comprehensive analysis
  static async extractMetadata(file: File): Promise<AudioMetadata> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      audio.onloadedmetadata = () => {
        const metadata: AudioMetadata = {
          duration: audio.duration,
          sampleRate: 44100, // Default assumption
          channels: 2, // Default assumption
          format: file.type
        }
        
        URL.revokeObjectURL(url)
        resolve(metadata)
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      }
      
      audio.src = url
    })
  }

  // Enhanced spectral analysis using Web Audio API
  static async analyzeSpectrum(audioBuffer: AudioBuffer): Promise<SpectralAnalysisResult> {
    const channelData = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    const length = channelData.length
    
    // Create analyzer node for frequency domain analysis
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyzer = audioContext.createAnalyser()
    analyzer.fftSize = 2048
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    
    // Calculate spectral centroid (brightness)
    let weightedSum = 0
    let magnitudeSum = 0
    for (let i = 0; i < bufferLength; i++) {
      const frequency = (i * sampleRate) / (2 * bufferLength)
      const magnitude = Math.abs(dataArray[i])
      weightedSum += frequency * magnitude
      magnitudeSum += magnitude
    }
    const spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
    
    // Calculate RMS energy for different frequency bands
    const nyquist = sampleRate / 2
    const getBandPower = (lowFreq: number, highFreq: number) => {
      const lowBin = Math.floor((lowFreq / nyquist) * bufferLength)
      const highBin = Math.floor((highFreq / nyquist) * bufferLength)
      let power = 0
      for (let i = lowBin; i <= highBin; i++) {
        if (i < bufferLength) {
          power += Math.pow(Math.abs(dataArray[i]), 2)
        }
      }
      return power / (highBin - lowBin + 1)
    }
    
    // Frequency bands (adjusted for audio frequency range)
    const deltaPower = getBandPower(20, 60)     // Sub-bass
    const thetaPower = getBandPower(60, 250)    // Bass
    const alphaPower = getBandPower(250, 500)   // Low-mids
    const betaPower = getBandPower(500, 2000)   // Mids
    const gammaPower = getBandPower(2000, 8000) // High-mids/highs
    
    // Calculate tempo from zero-crossing rate (rough approximation)
    let zeroCrossings = 0
    for (let i = 1; i < length; i++) {
      if (channelData[i-1] >= 0 && channelData[i] < 0 || 
          channelData[i-1] < 0 && channelData[i] >= 0) {
        zeroCrossings++
      }
    }
    const zcr = zeroCrossings / length
    
    // Estimate fundamental frequency using autocorrelation
    const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
      const SIZE = buffer.length
      const MAX_SAMPLES = Math.floor(SIZE / 2)
      let bestOffset = -1
      let bestCorrelation = 0
      let rms = 0
      
      for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i]
      }
      rms = Math.sqrt(rms / SIZE)
      
      if (rms < 0.01) return -1
      
      let lastCorrelation = 1
      for (let offset = 1; offset < MAX_SAMPLES; offset++) {
        let correlation = 0
        for (let i = offset; i < SIZE; i++) {
          correlation += Math.abs((buffer[i]) - (buffer[i - offset]))
        }
        correlation = 1 - (correlation / SIZE)
        
        if (correlation > 0.9 && correlation > lastCorrelation) {
          bestCorrelation = correlation
          bestOffset = offset
          break
        }
        lastCorrelation = correlation
      }
      
      return bestOffset !== -1 ? sampleRate / bestOffset : -1
    }
    
    const fundamentalFreq = autoCorrelate(channelData, sampleRate)
    
    const analysis: SpectralAnalysisResult = {
      delta_band_power: Math.min(deltaPower, 1.0),
      theta_band_power: Math.min(thetaPower, 1.0),
      alpha_band_power: Math.min(alphaPower, 1.0),
      beta_band_power: Math.min(betaPower, 1.0),
      gamma_band_power: Math.min(gammaPower, 1.0),
      therapeutic_delta_score: Math.min(deltaPower * 0.8 + 0.2, 1.0),
      therapeutic_theta_score: Math.min(thetaPower * 0.7 + 0.3, 1.0),
      therapeutic_alpha_score: Math.min(alphaPower * 0.8 + 0.2, 1.0),
      therapeutic_beta_score: Math.min(betaPower * 0.6 + 0.4, 1.0),
      therapeutic_gamma_score: Math.min(gammaPower * 0.5 + 0.5, 1.0),
      spectral_centroid: spectralCentroid,
      spectral_bandwidth: zcr * 1000, // Rough approximation
      fundamental_frequency: fundamentalFreq > 0 ? fundamentalFreq : undefined
    }
    
    return analysis
  }

  // Process audio file for upload
  static async processForUpload(file: File): Promise<{
    metadata: AudioMetadata
    spectralAnalysis: SpectralAnalysisResult
    optimizedFile?: Blob
  }> {
    try {
      // Extract metadata
      const metadata = await this.extractMetadata(file)
      
      // Decode audio for analysis
      const arrayBuffer = await file.arrayBuffer()
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      // Perform spectral analysis
      const spectralAnalysis = await this.analyzeSpectrum(audioBuffer)
      
      // For now, return original file - in production you'd optimize it
      return {
        metadata,
        spectralAnalysis,
        optimizedFile: file
      }
    } catch (error) {
      throw new Error(`Audio processing failed: ${error.message}`)
    }
  }

  // Validate audio file
  static validateAudioFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4', 'audio/aac']
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Unsupported file type: ${file.type}`)
    }
    
    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: 50MB)`)
    }
    
    // Check filename
    if (file.name.length > 255) {
      errors.push('Filename too long (max: 255 characters)')
    }
    
    if (!/^[^<>:"/\\|?*\x00-\x1f]+$/.test(file.name)) {
      errors.push('Invalid characters in filename')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Generate therapeutic recommendations based on audio features
  static generateTherapeuticRecommendations(analysis: SpectralAnalysisResult): {
    primaryBand: string
    conditions: string[]
    confidence: number
    recommendations: string[]
  } {
    const bandScores = {
      delta: analysis.therapeutic_delta_score,
      theta: analysis.therapeutic_theta_score,
      alpha: analysis.therapeutic_alpha_score,
      beta: analysis.therapeutic_beta_score,
      gamma: analysis.therapeutic_gamma_score
    }
    
    // Find primary band
    const primaryBand = Object.entries(bandScores)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    // Generate conditions based on primary band
    const conditionMap = {
      delta: ['sleep', 'pain_relief', 'healing', 'deep_relaxation'],
      theta: ['meditation', 'creativity', 'emotional_processing', 'memory'],
      alpha: ['focus', 'calm_alertness', 'stress_reduction', 'learning'],
      beta: ['concentration', 'problem_solving', 'active_thinking', 'alertness'],
      gamma: ['peak_performance', 'cognitive_enhancement', 'memory_consolidation']
    }
    
    const conditions = conditionMap[primaryBand as keyof typeof conditionMap] || []
    const confidence = bandScores[primaryBand as keyof typeof bandScores]
    
    const recommendations = [
      `Primary frequency band: ${primaryBand}`,
      `Best for: ${conditions.slice(0, 2).join(', ')}`,
      `Confidence: ${Math.round(confidence * 100)}%`,
      `Recommended session length: ${this.getRecommendedDuration(primaryBand)} minutes`
    ]
    
    return {
      primaryBand,
      conditions,
      confidence,
      recommendations
    }
  }
  
  private static getRecommendedDuration(band: string): number {
    const durations = {
      delta: 60,    // Longer for sleep/healing
      theta: 30,    // Medium for meditation
      alpha: 25,    // Medium for focus
      beta: 20,     // Shorter for active concentration
      gamma: 15     // Short bursts for peak performance
    }
    
    return durations[band as keyof typeof durations] || 30
  }
}