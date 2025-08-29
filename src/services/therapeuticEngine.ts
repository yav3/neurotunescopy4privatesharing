import type { MusicTrack, FrequencyBand } from '@/types'
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
  | 'anxiety_relief'
  | 'focus_enhancement' 
  | 'sleep_preparation'
  | 'mood_boost'
  | 'stress_reduction'
  | 'pain_management'
  | 'meditation_support'

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
    anxiety_relief: ['alpha', 'theta'],
    focus_enhancement: ['beta', 'gamma'], 
    sleep_preparation: ['delta', 'theta'],
    mood_boost: ['alpha', 'beta'],
    stress_reduction: ['alpha', 'theta'],
    pain_management: ['theta', 'alpha'],
    meditation_support: ['theta', 'alpha']
  }

  private static readonly ENERGY_PROGRESSIONS: Record<string, number[]> = {
    anxiety_relief: [4, 3, 2, 2, 1], // High to low energy
    focus_enhancement: [2, 3, 4, 4, 3], // Build to peak focus
    sleep_preparation: [3, 2, 1, 1, 1], // Gradual wind down
    mood_boost: [2, 3, 4, 5, 4], // Build energy and mood
    stress_reduction: [4, 3, 2, 2, 2], // Release tension
    pain_management: [3, 2, 2, 1, 1], // Deep relaxation
    meditation_support: [2, 2, 2, 2, 2] // Consistent calm state
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
    
    // Create energy-based progression
    const sessionTracks = this.createTherapeuticProgression(
      suitableTracks,
      energyProgression,
      tracksNeeded,
      config.intensityLevel
    )

    // Apply harmonic mixing for smooth transitions
    const harmonicTracks = CamelotRecommendationEngine.sortByHarmonicFlow(sessionTracks)

    return {
      id: `session_${Date.now()}`,
      goal: config.goal,
      duration: config.duration,
      tracks: harmonicTracks,
      progression: this.determineProgression(energyProgression),
      startTime: new Date()
    }
  }

  /**
   * Filter tracks based on therapeutic effectiveness
   */
  private static filterTherapeuticTracks(
    tracks: MusicTrack[],
    targetFrequencies: FrequencyBand[],
    goal: TherapeuticGoal,
    personalHistory?: SessionConfig['personalHistory']
  ): MusicTrack[] {
    return tracks.filter(track => {
      // Check frequency band compatibility
      const hasTargetFrequency = track.therapeutic_applications?.some(app =>
        targetFrequencies.includes(app.frequency_band_primary)
      )

      // Check therapeutic evidence for goal
      const hasTherapeuticEvidence = track.therapeutic_applications?.some(app => {
        const goalMap: Record<TherapeuticGoal, keyof typeof app> = {
          anxiety_relief: 'anxiety_evidence_score',
          focus_enhancement: 'focus_evidence_score', 
          sleep_preparation: 'sleep_evidence_score',
          mood_boost: 'anxiety_evidence_score', // Inverse anxiety
          stress_reduction: 'anxiety_evidence_score',
          pain_management: 'sleep_evidence_score', // Related to relaxation
          meditation_support: 'focus_evidence_score'
        }

        const evidenceField = goalMap[goal]
        const score = app[evidenceField] as number || 0
        return score > 0.6 // Minimum evidence threshold
      })

      // Check condition targets
      const hasRelevantConditions = track.therapeutic_applications?.some(app =>
        app.condition_targets?.some(condition => {
          const goalConditions: Record<TherapeuticGoal, string[]> = {
            anxiety_relief: ['anxiety', 'stress_reduction'],
            focus_enhancement: ['adhd', 'focus_enhancement', 'cognitive_enhancement'],
            sleep_preparation: ['sleep_improvement'],
            mood_boost: ['depression', 'mood_enhancement'],
            stress_reduction: ['stress_reduction', 'anxiety'],
            pain_management: ['pain_relief'],
            meditation_support: ['meditation_support']
          }
          
          return goalConditions[goal]?.includes(condition)
        })
      )

      // Personal history filters
      if (personalHistory) {
        if (personalHistory.avoidedTracks.includes(track.id)) return false
        if (personalHistory.preferredGenres.length > 0) {
          if (!personalHistory.preferredGenres.includes(track.genre)) return false
        }
      }

      return hasTargetFrequency && (hasTherapeuticEvidence || hasRelevantConditions)
    })
  }

  /**
   * Create therapeutic progression with energy flow
   */
  private static createTherapeuticProgression(
    tracks: MusicTrack[],
    energyProgression: number[],
    tracksNeeded: number,
    intensityLevel: number
  ): MusicTrack[] {
    const progression: MusicTrack[] = []
    const tracksPerSegment = Math.ceil(tracksNeeded / energyProgression.length)

    for (let i = 0; i < energyProgression.length && progression.length < tracksNeeded; i++) {
      const targetEnergy = energyProgression[i] / 5 // Convert to 0-1 scale
      const energyTolerance = 0.2 + (intensityLevel - 1) * 0.05 // More precise at higher intensity

      // Find tracks matching energy level
      const matchingTracks = tracks.filter(track => {
        const trackEnergy = track.energy || 0.5
        const energyDiff = Math.abs(trackEnergy - targetEnergy)
        return energyDiff <= energyTolerance && !progression.includes(track)
      })

      // Select tracks for this segment
      const segmentTracks = matchingTracks
        .slice(0, tracksPerSegment)
        .filter((_, index) => progression.length + index < tracksNeeded)

      progression.push(...segmentTracks)
    }

    // Fill remaining slots if needed
    while (progression.length < tracksNeeded) {
      const remainingTracks = tracks.filter(track => !progression.includes(track))
      if (remainingTracks.length === 0) break
      
      progression.push(remainingTracks[Math.floor(Math.random() * remainingTracks.length)])
    }

    return progression
  }

  /**
   * Determine progression type from energy pattern
   */
  private static determineProgression(energyProgression: number[]): 'gradual' | 'maintain' | 'boost' {
    const start = energyProgression[0]
    const end = energyProgression[energyProgression.length - 1]
    
    if (end > start + 1) return 'boost'
    if (Math.abs(end - start) <= 1) return 'maintain'
    return 'gradual'
  }

  /**
   * Get real-time recommendations based on current state
   */
  static getAdaptiveRecommendations(
    currentTrack: MusicTrack,
    sessionGoal: TherapeuticGoal,
    sessionProgress: number, // 0-1
    userFeedback?: 'effective' | 'ineffective' | 'neutral'
  ): {
    nextTracks: MusicTrack[]
    adjustments: string[]
  } {
    const adjustments: string[] = []
    
    // Analyze current effectiveness
    if (userFeedback === 'ineffective') {
      adjustments.push('Adjusting energy level and frequency band')
    }

    if (sessionProgress > 0.8) {
      adjustments.push('Preparing session conclusion tracks')
    }

    return {
      nextTracks: [], // Would be implemented with full track database
      adjustments
    }
  }

  /**
   * Calculate session effectiveness score
   */
  static calculateEffectiveness(
    session: TherapeuticSession,
    userFeedback: {
      moodBefore: number // 1-10
      moodAfter: number // 1-10
      effectiveness: number // 1-10
    }
  ): {
    score: number
    insights: string[]
  } {
    const moodImprovement = userFeedback.moodAfter - userFeedback.moodBefore
    const effectivenessWeight = userFeedback.effectiveness / 10
    
    const score = (moodImprovement + userFeedback.effectiveness) / 2
    const insights: string[] = []

    if (moodImprovement > 2) {
      insights.push('Significant mood improvement detected')
    }

    if (effectivenessWeight > 0.8) {
      insights.push('High user satisfaction with track selection')
    }

    return { score, insights }
  }
}