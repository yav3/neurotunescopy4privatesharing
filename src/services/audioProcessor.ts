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
  // Extract basic metadata from audio file
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

  // Basic frequency analysis using Web Audio API
  static async analyzeSpectrum(audioBuffer: AudioBuffer): Promise<SpectralAnalysisResult> {
    const channelData = audioBuffer.getChannelData(0) // Use first channel
    const sampleRate = audioBuffer.sampleRate
    
    // Simple FFT approximation - in production you'd use a proper FFT library
    const fftSize = 2048
    const frequencyBins = fftSize / 2
    const binWidth = sampleRate / fftSize
    
    // Calculate power in different frequency bands
    const deltaRange = [0.5, 4]    // Delta: 0.5-4 Hz
    const thetaRange = [4, 8]      // Theta: 4-8 Hz
    const alphaRange = [8, 13]     // Alpha: 8-13 Hz
    const betaRange = [13, 30]     // Beta: 13-30 Hz
    const gammaRange = [30, 100]   // Gamma: 30-100 Hz
    
    // Mock analysis for demonstration - replace with actual FFT
    const analysis: SpectralAnalysisResult = {
      delta_band_power: Math.random() * 0.3 + 0.2,
      theta_band_power: Math.random() * 0.4 + 0.3,
      alpha_band_power: Math.random() * 0.5 + 0.4,
      beta_band_power: Math.random() * 0.4 + 0.3,
      gamma_band_power: Math.random() * 0.3 + 0.1,
      therapeutic_delta_score: Math.random() * 0.3 + 0.7,
      therapeutic_theta_score: Math.random() * 0.2 + 0.6,
      therapeutic_alpha_score: Math.random() * 0.3 + 0.7,
      therapeutic_beta_score: Math.random() * 0.2 + 0.5,
      therapeutic_gamma_score: Math.random() * 0.3 + 0.4,
      spectral_centroid: Math.random() * 2000 + 1000,
      spectral_bandwidth: Math.random() * 500 + 200,
      fundamental_frequency: Math.random() * 200 + 100
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