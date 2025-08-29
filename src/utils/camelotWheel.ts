// Camelot Wheel implementation for harmonic music recommendation
export type CamelotKey = 
  | '1A' | '2A' | '3A' | '4A' | '5A' | '6A' | '7A' | '8A' | '9A' | '10A' | '11A' | '12A'
  | '1B' | '2B' | '3B' | '4B' | '5B' | '6B' | '7B' | '8B' | '9B' | '10B' | '11B' | '12B'

export interface CamelotMapping {
  key: CamelotKey
  musicalKey: string
  mode: 'major' | 'minor'
  compatibleKeys: CamelotKey[]
  energyLevel: number // 1-5 scale
}

export const CAMELOT_WHEEL: Record<CamelotKey, CamelotMapping> = {
  '1A': { key: '1A', musicalKey: 'A♭', mode: 'minor', compatibleKeys: ['1B', '2A', '12A'], energyLevel: 1 },
  '2A': { key: '2A', musicalKey: 'E♭', mode: 'minor', compatibleKeys: ['2B', '1A', '3A'], energyLevel: 2 },
  '3A': { key: '3A', musicalKey: 'B♭', mode: 'minor', compatibleKeys: ['3B', '2A', '4A'], energyLevel: 2 },
  '4A': { key: '4A', musicalKey: 'F', mode: 'minor', compatibleKeys: ['4B', '3A', '5A'], energyLevel: 3 },
  '5A': { key: '5A', musicalKey: 'C', mode: 'minor', compatibleKeys: ['5B', '4A', '6A'], energyLevel: 3 },
  '6A': { key: '6A', musicalKey: 'G', mode: 'minor', compatibleKeys: ['6B', '5A', '7A'], energyLevel: 4 },
  '7A': { key: '7A', musicalKey: 'D', mode: 'minor', compatibleKeys: ['7B', '6A', '8A'], energyLevel: 4 },
  '8A': { key: '8A', musicalKey: 'A', mode: 'minor', compatibleKeys: ['8B', '7A', '9A'], energyLevel: 5 },
  '9A': { key: '9A', musicalKey: 'E', mode: 'minor', compatibleKeys: ['9B', '8A', '10A'], energyLevel: 5 },
  '10A': { key: '10A', musicalKey: 'B', mode: 'minor', compatibleKeys: ['10B', '9A', '11A'], energyLevel: 4 },
  '11A': { key: '11A', musicalKey: 'F♯', mode: 'minor', compatibleKeys: ['11B', '10A', '12A'], energyLevel: 3 },
  '12A': { key: '12A', musicalKey: 'D♭', mode: 'minor', compatibleKeys: ['12B', '11A', '1A'], energyLevel: 2 },
  
  '1B': { key: '1B', musicalKey: 'B', mode: 'major', compatibleKeys: ['1A', '2B', '12B'], energyLevel: 2 },
  '2B': { key: '2B', musicalKey: 'G♭', mode: 'major', compatibleKeys: ['2A', '1B', '3B'], energyLevel: 3 },
  '3B': { key: '3B', musicalKey: 'D♭', mode: 'major', compatibleKeys: ['3A', '2B', '4B'], energyLevel: 3 },
  '4B': { key: '4B', musicalKey: 'A♭', mode: 'major', compatibleKeys: ['4A', '3B', '5B'], energyLevel: 4 },
  '5B': { key: '5B', musicalKey: 'E♭', mode: 'major', compatibleKeys: ['5A', '4B', '6B'], energyLevel: 4 },
  '6B': { key: '6B', musicalKey: 'B♭', mode: 'major', compatibleKeys: ['6A', '5B', '7B'], energyLevel: 5 },
  '7B': { key: '7B', musicalKey: 'F', mode: 'major', compatibleKeys: ['7A', '6B', '8B'], energyLevel: 5 },
  '8B': { key: '8B', musicalKey: 'C', mode: 'major', compatibleKeys: ['8A', '7B', '9B'], energyLevel: 4 },
  '9B': { key: '9B', musicalKey: 'G', mode: 'major', compatibleKeys: ['9A', '8B', '10B'], energyLevel: 4 },
  '10B': { key: '10B', musicalKey: 'D', mode: 'major', compatibleKeys: ['10A', '9B', '11B'], energyLevel: 3 },
  '11B': { key: '11B', musicalKey: 'A', mode: 'major', compatibleKeys: ['11A', '10B', '12B'], energyLevel: 3 },
  '12B': { key: '12B', musicalKey: 'E', mode: 'major', compatibleKeys: ['12A', '11B', '1B'], energyLevel: 2 }
}

export class CamelotRecommendationEngine {
  /**
   * Get harmonically compatible tracks based on Camelot wheel
   */
  static getCompatibleTracks(currentKey: CamelotKey, availableTracks: any[]): any[] {
    const currentMapping = CAMELOT_WHEEL[currentKey]
    if (!currentMapping) return []

    return availableTracks.filter(track => {
      const trackKey = track.camelot_key || track.key
      return trackKey && currentMapping.compatibleKeys.includes(trackKey)
    })
  }

  /**
   * Generate smooth energy progression for therapeutic sessions
   */
  static createEnergyProgression(
    tracks: any[],
    startEnergy: number,
    targetEnergy: number,
    duration: number
  ): any[] {
    const progression: any[] = []
    const steps = Math.max(4, Math.floor(duration / 3)) // 3-minute intervals
    const energyDelta = (targetEnergy - startEnergy) / steps

    let currentEnergy = startEnergy
    let availableTracks = [...tracks]

    for (let i = 0; i < steps && availableTracks.length > 0; i++) {
      // Find tracks matching current energy level (±0.5 tolerance)
      const suitableTracks = availableTracks.filter(track => {
        const trackEnergy = track.energy * 5 // Convert 0-1 to 1-5 scale
        return Math.abs(trackEnergy - currentEnergy) <= 0.5
      })

      if (suitableTracks.length > 0) {
        // Select random track from suitable options
        const selectedTrack = suitableTracks[Math.floor(Math.random() * suitableTracks.length)]
        progression.push(selectedTrack)
        
        // Remove selected track to avoid repetition
        availableTracks = availableTracks.filter(t => t.id !== selectedTrack.id)
      }

      currentEnergy += energyDelta
    }

    return progression
  }

  /**
   * Get tracks for therapeutic mood transition
   */
  static getTherapeuticTransition(
    tracks: any[],
    fromMood: 'anxious' | 'depressed' | 'stressed' | 'unfocused',
    toMood: 'calm' | 'uplifted' | 'focused' | 'energized'
  ): any[] {
    const moodToEnergyMap = {
      anxious: 4, depressed: 1, stressed: 5, unfocused: 2,
      calm: 2, uplifted: 3, focused: 3, energized: 4
    }

    const startEnergy = moodToEnergyMap[fromMood]
    const targetEnergy = moodToEnergyMap[toMood]

    return this.createEnergyProgression(tracks, startEnergy, targetEnergy, 15) // 15-minute session
  }

  /**
   * Detect key from musical features (simplified)
   */
  static detectCamelotKey(track: any): CamelotKey | null {
    // This would typically use audio analysis
    // For now, use valence and energy to estimate key
    const energy = track.energy || 0.5
    const valence = track.valence || 0.5
    
    // Simplified mapping based on audio features
    const keyIndex = Math.floor((energy + valence) * 12) % 12 + 1
    const mode = valence > 0.5 ? 'B' : 'A'
    
    return `${keyIndex}${mode}` as CamelotKey
  }

  /**
   * Sort tracks by harmonic compatibility
   */
  static sortByHarmonicFlow(tracks: any[], startingKey?: CamelotKey): any[] {
    if (!startingKey && tracks.length > 0) {
      startingKey = this.detectCamelotKey(tracks[0])
    }
    
    if (!startingKey) return tracks

    const sorted: any[] = []
    const remaining = [...tracks]
    let currentKey = startingKey

    while (remaining.length > 0) {
      // Find the most compatible next track
      let bestMatch = remaining[0]
      let bestScore = 0

      for (const track of remaining) {
        const trackKey = track.camelot_key || this.detectCamelotKey(track)
        if (!trackKey) continue

        const compatibility = CAMELOT_WHEEL[currentKey]?.compatibleKeys.includes(trackKey) ? 1 : 0
        const energyFlow = 1 - Math.abs((track.energy * 5) - (CAMELOT_WHEEL[currentKey]?.energyLevel || 3)) / 5

        const score = compatibility * 0.7 + energyFlow * 0.3
        
        if (score > bestScore) {
          bestScore = score
          bestMatch = track
        }
      }

      sorted.push(bestMatch)
      remaining.splice(remaining.indexOf(bestMatch), 1)
      
      const nextKey = bestMatch.camelot_key || this.detectCamelotKey(bestMatch)
      if (nextKey) currentKey = nextKey
    }

    return sorted
  }
}