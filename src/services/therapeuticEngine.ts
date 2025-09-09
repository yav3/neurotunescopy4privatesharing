import type { Track, MusicTrack, FrequencyBand } from '@/types'
import { CamelotRecommendationEngine, type CamelotKey } from '@/utils/camelotWheel'
import { FREQUENCY_BANDS } from '@/utils/constants'

export interface TherapeuticSession {
  id: string
  goal: TherapeuticGoal
  duration: number // in minutes
  tracks: MusicTrack[]
  progression: 'gradual' | 'maintain' | 'boost'
  startTime: Date
}

export type TherapeuticGoal = 
  | 'stress_anxiety_support'
  | 'focus_enhancement' 
  | 'sleep_preparation'
  | 'mood_boost'
  | 'pain_support'

export interface SessionConfig {
  goal: TherapeuticGoal
  duration: number
  intensityLevel: 1 | 2 | 3 | 4 | 5
  personalHistory?: {
    preferredGenres: string[]
    effectiveTracks: string[]
    avoidedTracks: string[]
  }
}

export class TherapeuticEngine {
  private static readonly GOAL_TO_FREQUENCY_MAP: Record<TherapeuticGoal, FrequencyBand[]> = {
    stress_anxiety_support: ['alpha', 'theta'],
    focus_enhancement: ['beta', 'gamma'],
    sleep_preparation: ['delta', 'theta'],
    mood_boost: ['beta', 'alpha'],
    pain_support: ['theta', 'alpha']
  }

  private static readonly ENERGY_PROGRESSIONS: Record<string, number[]> = {
    stress_anxiety_support: [4, 3, 2, 2, 1], // High to low energy for stress & anxiety relief
    focus_enhancement: [2, 3, 4, 4, 3], // Build to peak focus
    sleep_preparation: [3, 2, 1, 1, 1], // Gradual wind down
    mood_boost: [2, 3, 4, 5, 4], // Build energy and mood
    pain_support: [3, 2, 2, 1, 1] // Deep relaxation for pain relief
  }

  /**
   * Create a personalized therapeutic session
   */
  static async createSession(
    config: SessionConfig,
    availableTracks: MusicTrack[]
  ): Promise<TherapeuticSession> {
    const targetFrequencies = this.GOAL_TO_FREQUENCY_MAP[config.goal]
    const energyProgression = this.ENERGY_PROGRESSIONS[config.goal]
    
    // Filter tracks by therapeutic criteria
    const suitableTracks = this.filterTherapeuticTracks(
      availableTracks,
      targetFrequencies,
      config.goal,
      config.personalHistory
    )

    if (suitableTracks.length === 0) {
      throw new Error(`No suitable tracks found for ${config.goal}`)
    }

    // Calculate tracks needed based on duration
    const averageTrackLength = 4 // minutes
    const tracksNeeded = Math.max(3, Math.floor(config.duration / averageTrackLength))
    
    // Select and sequence tracks
    const sessionTracks = this.selectOptimalTracks(
      suitableTracks,
      tracksNeeded,
      energyProgression,
      config.intensityLevel
    )

    // Apply Camelot harmonic mixing if possible
    const harmonicSequence = this.applyHarmonicProgression(sessionTracks)

    return {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      goal: config.goal,
      duration: config.duration,
      tracks: harmonicSequence,
      progression: this.determineProgression(config.goal),
      startTime: new Date()
    }
  }

  /**
   * Filter tracks based on therapeutic criteria using available data
   */
  private static filterTherapeuticTracks(
    tracks: MusicTrack[],
    targetFrequencies: FrequencyBand[],
    goal: TherapeuticGoal,
    personalHistory?: SessionConfig['personalHistory']
  ): MusicTrack[] {
    return tracks.filter(track => {
      // Use genre as proxy for frequency band mapping
      const genreToFrequency: Record<string, FrequencyBand> = {
        'classical': 'delta',
        'jazz': 'theta', 
        'rock': 'alpha',
        'dance': 'beta',
        'electronic': 'gamma'
      }

      const trackFrequency = genreToFrequency[track.genre?.toLowerCase() || '']
      
      // Filter by target frequencies if available
      if (trackFrequency && !targetFrequencies.includes(trackFrequency)) {
        return false
      }

      // Check if track has been marked as ineffective by user
      if (personalHistory?.avoidedTracks?.includes(track.id)) {
        return false
      }

      // Prioritize previously effective tracks
      if (personalHistory?.effectiveTracks?.includes(track.id)) {
        return true
      }

      // Filter by genre preferences if provided
      if (personalHistory?.preferredGenres?.length) {
        if (!personalHistory.preferredGenres.includes(track.genre)) {
          return false
        }
      }

      // Apply therapeutic criteria based on audio features
      switch (goal) {
        case 'stress_anxiety_support':
          return (track.valence || 0) < 0.6 && (track.energy || 0) < 0.5
        case 'focus_enhancement':
          return (track.energy || 0) > 0.4 && (track.energy || 0) < 0.8
        case 'sleep_preparation':
          return (track.energy || 0) < 0.4 && (track.valence || 0) < 0.7
        case 'mood_boost':
          return (track.valence || 0) > 0.5 && (track.energy || 0) > 0.3
        case 'pain_support':
          return (track.valence || 0) < 0.7 && (track.energy || 0) < 0.6
        default:
          return true
      }
    })
  }

  /**
   * Select optimal tracks for the session based on energy progression
   */
  private static selectOptimalTracks(
    suitableTracks: MusicTrack[],
    tracksNeeded: number,
    energyProgression: number[],
    intensityLevel: number
  ): MusicTrack[] {
    const selectedTracks: MusicTrack[] = []
    const segmentSize = Math.ceil(tracksNeeded / energyProgression.length)
    
    // Group tracks by energy level
    const tracksByEnergy = this.groupTracksByEnergy(suitableTracks)
    
    for (let i = 0; i < energyProgression.length && selectedTracks.length < tracksNeeded; i++) {
      const targetEnergy = energyProgression[i]
      const tracksInEnergyRange = tracksByEnergy[targetEnergy] || []
      
      // Select tracks for this energy segment
      const segmentTracks = this.selectTracksFromEnergyGroup(
        tracksInEnergyRange,
        Math.min(segmentSize, tracksNeeded - selectedTracks.length),
        intensityLevel
      )
      
      selectedTracks.push(...segmentTracks)
    }
    
    // If we don't have enough tracks, fill with best available
    while (selectedTracks.length < tracksNeeded && suitableTracks.length > selectedTracks.length) {
      const remainingTracks = suitableTracks.filter(t => !selectedTracks.includes(t))
      if (remainingTracks.length > 0) {
        selectedTracks.push(remainingTracks[0])
      } else {
        break
      }
    }
    
    return selectedTracks.slice(0, tracksNeeded)
  }

  /**
   * Group tracks by energy level (1-5 scale)
   */
  private static groupTracksByEnergy(tracks: MusicTrack[]): Record<number, MusicTrack[]> {
    return tracks.reduce((groups, track) => {
      const energyLevel = this.mapEnergyToLevel(track.energy || 0.5)
      if (!groups[energyLevel]) {
        groups[energyLevel] = []
      }
      groups[energyLevel].push(track)
      return groups
    }, {} as Record<number, MusicTrack[]>)
  }

  /**
   * Map continuous energy (0-1) to discrete level (1-5)
   */
  private static mapEnergyToLevel(energy: number): number {
    if (energy <= 0.2) return 1
    if (energy <= 0.4) return 2
    if (energy <= 0.6) return 3
    if (energy <= 0.8) return 4
    return 5
  }

  /**
   * Select tracks from an energy group based on therapeutic criteria
   */
  private static selectTracksFromEnergyGroup(
    tracks: MusicTrack[],
    count: number,
    intensityLevel: number
  ): MusicTrack[] {
    // Score tracks based on therapeutic suitability
    const scoredTracks = tracks.map(track => ({
      track,
      score: this.calculateTherapeuticScore(track, intensityLevel)
    }))
    
    // Sort by score and select best tracks
    return scoredTracks
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.track)
  }

  /**
   * Calculate therapeutic score for a track
   */
  private static calculateTherapeuticScore(track: MusicTrack, intensityLevel: number): number {
    let score = 0
    
    // Audio feature scoring
    score += (track.valence || 0.5) * 20 // Emotional positivity
    score += (1 - Math.abs((track.energy || 0.5) - 0.5)) * 15 // Balanced energy
    score += (track.acousticness || 0) * 10 // Acoustic preference for therapy
    score += (1 - (track.speechiness || 0)) * 10 // Prefer instrumental
    
    // Adjust for intensity level
    const energyBonus = Math.abs((track.energy || 0.5) - (intensityLevel / 5)) * -5
    score += energyBonus
    
    return Math.max(0, score)
  }

  /**
   * Apply harmonic progression using Camelot wheel
   */
  private static applyHarmonicProgression(tracks: MusicTrack[]): MusicTrack[] {
    if (tracks.length < 2) return tracks
    
    try {
      // Use Camelot recommendation engine for harmonic mixing
      return CamelotRecommendationEngine.sortByHarmonicFlow(tracks)
    } catch (error) {
      console.warn('Camelot progression failed, using original order:', error)
      return tracks
    }
  }

  /**
   * Determine progression type based on therapeutic goal
   */
  private static determineProgression(goal: TherapeuticGoal): 'gradual' | 'maintain' | 'boost' {
    switch (goal) {
      case 'stress_anxiety_support':
      case 'sleep_preparation':
      case 'pain_support':
        return 'gradual'
      case 'mood_boost':
        return 'boost'
      default:
        return 'gradual'
    }
  }

  /**
   * Analyze session effectiveness (for future learning)
   */
  static analyzeSessionEffectiveness(
    session: TherapeuticSession,
    userFeedback: {
      effectiveness: 1 | 2 | 3 | 4 | 5
      moodBefore: number
      moodAfter: number
      completionRate: number
      notes?: string
    }
  ): void {
    // Store effectiveness data for machine learning improvements
    console.log('Session analysis:', {
      sessionId: session.id,
      goal: session.goal,
      duration: session.duration,
      trackCount: session.tracks.length,
      effectiveness: userFeedback.effectiveness,
      moodImprovement: userFeedback.moodAfter - userFeedback.moodBefore,
      completionRate: userFeedback.completionRate
    })
    
    // In a real implementation, this would update user preferences
    // and track effectiveness for continuous improvement
  }
}