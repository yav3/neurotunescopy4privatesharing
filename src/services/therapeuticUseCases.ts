import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import type { TherapeuticGoal } from '@/config/therapeuticGoals';
import type { Track } from '@/types/music';

/**
 * Comprehensive Therapeutic Use Cases System
 * Defines proper therapeutic pathways using rich metadata and VAD analysis
 */

export interface TherapeuticSession {
  id: string;
  useCase: TherapeuticUseCase;
  tracks: Track[];
  duration: number;
  intensity: number;
  progression: SessionProgression;
  expectedOutcomes: TherapeuticOutcome[];
}

export interface TherapeuticUseCase {
  id: string;
  name: string;
  description: string;
  category: 'clinical' | 'wellness' | 'performance' | 'recovery';
  targetConditions: string[];
  contraindications: string[];
  sessionStructure: SessionStructure;
  progressionPath: ProgressionStep[];
  measurableOutcomes: OutcomeMeasure[];
}

export interface SessionStructure {
  phases: TherapeuticPhase[];
  totalDuration: { min: number; max: number; optimal: number };
  intensityRange: { min: number; max: number };
  vadProgression: VADProgression;
}

export interface TherapeuticPhase {
  name: string;
  duration: number; // minutes
  purpose: string;
  vadTargets: {
    valence: { min: number; max: number; target: number };
    arousal: { min: number; max: number; target: number };
    dominance?: { min: number; max: number; target: number };
  };
  bpmRange: { min: number; max: number };
  trackCharacteristics: string[];
}

export interface ProgressionStep {
  step: number;
  milestone: string;
  expectedChange: string;
  timeframe: string;
  nextAction: string;
}

export interface VADProgression {
  entry: { valence: number; arousal: number; dominance?: number };
  peak: { valence: number; arousal: number; dominance?: number };
  resolution: { valence: number; arousal: number; dominance?: number };
}

export interface SessionProgression {
  currentPhase: number;
  timeElapsed: number;
  vadJourney: Array<{ timestamp: number; valence: number; arousal: number; dominance?: number }>;
  physiologicalMarkers?: PhysiologicalMarkers;
}

export interface TherapeuticOutcome {
  metric: string;
  baseline: number;
  target: number;
  current?: number;
  timeline: string;
}

export interface OutcomeMeasure {
  name: string;
  type: 'subjective' | 'objective' | 'physiological';
  scale: string;
  frequency: 'session' | 'daily' | 'weekly';
}

export interface PhysiologicalMarkers {
  heartRate?: number;
  breathingRate?: number;
  skinConductance?: number;
  brainwaveActivity?: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
  };
}

/**
 * Comprehensive Therapeutic Use Cases Library
 */
export const THERAPEUTIC_USE_CASES: TherapeuticUseCase[] = [
  {
    id: 'anxiety-reduction-protocol',
    name: 'Anxiety Reduction Protocol',
    description: 'Evidence-based music therapy for acute and chronic anxiety management',
    category: 'clinical',
    targetConditions: ['generalized anxiety', 'panic disorder', 'social anxiety', 'performance anxiety'],
    contraindications: ['severe depression without treatment', 'active psychosis'],
    sessionStructure: {
      phases: [
        {
          name: 'Grounding Phase',
          duration: 5,
          purpose: 'Establish safety and present-moment awareness',
          vadTargets: {
            valence: { min: 0.3, max: 0.5, target: 0.4 },
            arousal: { min: 0.2, max: 0.4, target: 0.3 },
            dominance: { min: 0.4, max: 0.6, target: 0.5 }
          },
          bpmRange: { min: 60, max: 80 },
          trackCharacteristics: ['ambient', 'nature sounds', 'minimal harmonics']
        },
        {
          name: 'Active Regulation Phase',
          duration: 15,
          purpose: 'Guide nervous system toward parasympathetic activation',
          vadTargets: {
            valence: { min: 0.4, max: 0.6, target: 0.5 },
            arousal: { min: 0.1, max: 0.3, target: 0.2 },
            dominance: { min: 0.5, max: 0.7, target: 0.6 }
          },
          bpmRange: { min: 50, max: 70 },
          trackCharacteristics: ['progressive relaxation', 'binaural beats', 'theta waves']
        },
        {
          name: 'Integration Phase',
          duration: 10,
          purpose: 'Consolidate calm state and build resilience',
          vadTargets: {
            valence: { min: 0.5, max: 0.7, target: 0.6 },
            arousal: { min: 0.2, max: 0.4, target: 0.3 },
            dominance: { min: 0.6, max: 0.8, target: 0.7 }
          },
          bpmRange: { min: 60, max: 80 },
          trackCharacteristics: ['gentle melodies', 'positive harmonics', 'empowering rhythms']
        }
      ],
      totalDuration: { min: 20, max: 45, optimal: 30 },
      intensityRange: { min: 1, max: 4 },
      vadProgression: {
        entry: { valence: 0.2, arousal: 0.8, dominance: 0.3 },
        peak: { valence: 0.5, arousal: 0.2, dominance: 0.6 },
        resolution: { valence: 0.6, arousal: 0.3, dominance: 0.7 }
      }
    },
    progressionPath: [
      { step: 1, milestone: 'Immediate anxiety relief', expectedChange: '30% reduction in subjective anxiety', timeframe: 'within session', nextAction: 'practice daily for 1 week' },
      { step: 2, milestone: 'Sustained calm', expectedChange: 'maintain reduced anxiety 2+ hours post-session', timeframe: '3-5 sessions', nextAction: 'extend session duration' },
      { step: 3, milestone: 'Anticipatory regulation', expectedChange: 'proactive use before anxiety triggers', timeframe: '2 weeks', nextAction: 'integrate with CBT techniques' },
      { step: 4, milestone: 'Autonomous coping', expectedChange: 'reduced frequency of acute anxiety episodes', timeframe: '4-6 weeks', nextAction: 'maintenance protocol' }
    ],
    measurableOutcomes: [
      { name: 'Subjective Anxiety Level', type: 'subjective', scale: '1-10 Likert scale', frequency: 'session' },
      { name: 'Heart Rate Variability', type: 'physiological', scale: 'HRV score', frequency: 'session' },
      { name: 'Sleep Quality Index', type: 'objective', scale: 'Pittsburgh Sleep Quality Index', frequency: 'weekly' },
      { name: 'Generalized Anxiety Disorder Scale', type: 'subjective', scale: 'GAD-7', frequency: 'weekly' }
    ]
  },

  {
    id: 'focus-enhancement-protocol',
    name: 'Cognitive Focus Enhancement',
    description: 'Scientifically-designed protocol for sustained attention and cognitive performance',
    category: 'performance',
    targetConditions: ['ADHD', 'attention deficits', 'cognitive fatigue', 'mental fog'],
    contraindications: ['severe anxiety during focus tasks', 'auditory processing disorders'],
    sessionStructure: {
      phases: [
        {
          name: 'Mental Preparation Phase',
          duration: 3,
          purpose: 'Prime cognitive systems for sustained attention',
          vadTargets: {
            valence: { min: 0.5, max: 0.7, target: 0.6 },
            arousal: { min: 0.4, max: 0.6, target: 0.5 },
            dominance: { min: 0.6, max: 0.8, target: 0.7 }
          },
          bpmRange: { min: 70, max: 90 },
          trackCharacteristics: ['rhythmic patterns', 'beta wave entrainment', 'motivational']
        },
        {
          name: 'Deep Focus State',
          duration: 25,
          purpose: 'Maintain optimal cognitive arousal for sustained performance',
          vadTargets: {
            valence: { min: 0.4, max: 0.6, target: 0.5 },
            arousal: { min: 0.6, max: 0.8, target: 0.7 },
            dominance: { min: 0.7, max: 0.9, target: 0.8 }
          },
          bpmRange: { min: 80, max: 120 },
          trackCharacteristics: ['consistent rhythm', '40Hz gamma waves', 'minimal lyrics', 'electronic']
        },
        {
          name: 'Cognitive Recovery',
          duration: 5,
          purpose: 'Gentle transition from high focus to relaxed alertness',
          vadTargets: {
            valence: { min: 0.6, max: 0.8, target: 0.7 },
            arousal: { min: 0.3, max: 0.5, target: 0.4 },
            dominance: { min: 0.5, max: 0.7, target: 0.6 }
          },
          bpmRange: { min: 60, max: 80 },
          trackCharacteristics: ['gentle melodies', 'alpha wave support', 'restorative']
        }
      ],
      totalDuration: { min: 25, max: 90, optimal: 33 },
      intensityRange: { min: 3, max: 8 },
      vadProgression: {
        entry: { valence: 0.5, arousal: 0.4, dominance: 0.5 },
        peak: { valence: 0.5, arousal: 0.7, dominance: 0.8 },
        resolution: { valence: 0.7, arousal: 0.4, dominance: 0.6 }
      }
    },
    progressionPath: [
      { step: 1, milestone: 'Enhanced attention span', expectedChange: '25% increase in sustained attention', timeframe: 'immediate', nextAction: 'track focus metrics' },
      { step: 2, milestone: 'Reduced cognitive fatigue', expectedChange: 'maintain focus without breaks', timeframe: '1 week', nextAction: 'increase session complexity' },
      { step: 3, milestone: 'Flow state accessibility', expectedChange: 'enter deep focus within 5 minutes', timeframe: '2 weeks', nextAction: 'optimize environmental factors' },
      { step: 4, milestone: 'Cognitive resilience', expectedChange: 'maintain focus despite distractions', timeframe: '4 weeks', nextAction: 'advanced cognitive training' }
    ],
    measurableOutcomes: [
      { name: 'Attention Span Duration', type: 'objective', scale: 'minutes of sustained attention', frequency: 'session' },
      { name: 'Cognitive Performance Battery', type: 'objective', scale: 'standardized cognitive tests', frequency: 'weekly' },
      { name: 'Subjective Focus Rating', type: 'subjective', scale: '1-10 focus quality scale', frequency: 'session' },
      { name: 'Task Completion Rate', type: 'objective', scale: 'percentage of tasks completed', frequency: 'daily' }
    ]
  },

  {
    id: 'sleep-induction-protocol',
    name: 'Progressive Sleep Induction',
    description: 'Multi-phase approach to natural sleep onset and improved sleep architecture',
    category: 'clinical',
    targetConditions: ['insomnia', 'sleep onset difficulties', 'racing thoughts', 'sleep anxiety'],
    contraindications: ['sleep apnea without treatment', 'narcolepsy', 'shift work disorders'],
    sessionStructure: {
      phases: [
        {
          name: 'Wind-Down Preparation',
          duration: 10,
          purpose: 'Signal circadian system and reduce cortical arousal',
          vadTargets: {
            valence: { min: 0.4, max: 0.6, target: 0.5 },
            arousal: { min: 0.3, max: 0.5, target: 0.4 },
            dominance: { min: 0.3, max: 0.5, target: 0.4 }
          },
          bpmRange: { min: 60, max: 80 },
          trackCharacteristics: ['evening ambiance', 'gentle transitions', 'warm tones']
        },
        {
          name: 'Deep Relaxation Phase',
          duration: 20,
          purpose: 'Progressive muscle relaxation and nervous system downregulation',
          vadTargets: {
            valence: { min: 0.3, max: 0.5, target: 0.4 },
            arousal: { min: 0.1, max: 0.3, target: 0.2 },
            dominance: { min: 0.2, max: 0.4, target: 0.3 }
          },
          bpmRange: { min: 40, max: 60 },
          trackCharacteristics: ['theta waves', 'nature sounds', 'binaural beats 4-8Hz']
        },
        {
          name: 'Sleep Transition',
          duration: 30,
          purpose: 'Facilitate natural sleep onset through delta wave entrainment',
          vadTargets: {
            valence: { min: 0.2, max: 0.4, target: 0.3 },
            arousal: { min: 0.0, max: 0.2, target: 0.1 },
            dominance: { min: 0.1, max: 0.3, target: 0.2 }
          },
          bpmRange: { min: 30, max: 50 },
          trackCharacteristics: ['delta waves 0.5-4Hz', 'minimal stimulation', 'fade to silence']
        }
      ],
      totalDuration: { min: 30, max: 90, optimal: 60 },
      intensityRange: { min: 1, max: 3 },
      vadProgression: {
        entry: { valence: 0.5, arousal: 0.6, dominance: 0.5 },
        peak: { valence: 0.4, arousal: 0.2, dominance: 0.3 },
        resolution: { valence: 0.3, arousal: 0.1, dominance: 0.2 }
      }
    },
    progressionPath: [
      { step: 1, milestone: 'Reduced sleep onset time', expectedChange: 'fall asleep 50% faster', timeframe: 'within 3 nights', nextAction: 'establish consistent routine' },
      { step: 2, milestone: 'Improved sleep continuity', expectedChange: 'fewer middle-of-night awakenings', timeframe: '1 week', nextAction: 'optimize sleep environment' },
      { step: 3, milestone: 'Enhanced sleep quality', expectedChange: 'deeper, more restorative sleep', timeframe: '2 weeks', nextAction: 'integrate with sleep hygiene' },
      { step: 4, milestone: 'Natural sleep rhythm', expectedChange: 'consistent sleep-wake cycle', timeframe: '4 weeks', nextAction: 'maintenance and optimization' }
    ],
    measurableOutcomes: [
      { name: 'Sleep Onset Latency', type: 'objective', scale: 'minutes to fall asleep', frequency: 'daily' },
      { name: 'Sleep Efficiency', type: 'objective', scale: 'percentage of time asleep in bed', frequency: 'daily' },
      { name: 'Sleep Quality Rating', type: 'subjective', scale: '1-10 sleep quality scale', frequency: 'daily' },
      { name: 'Epworth Sleepiness Scale', type: 'subjective', scale: 'ESS score', frequency: 'weekly' }
    ]
  },

  {
    id: 'pain-management-protocol',
    name: 'Neurological Pain Management',
    description: 'Evidence-based music therapy for chronic pain and acute pain episodes',
    category: 'clinical',
    targetConditions: ['chronic pain', 'fibromyalgia', 'arthritis', 'neuropathic pain', 'post-surgical pain'],
    contraindications: ['acute psychiatric crisis', 'severe hearing impairment'],
    sessionStructure: {
      phases: [
        {
          name: 'Pain Assessment Phase',
          duration: 5,
          purpose: 'Establish baseline pain awareness and emotional state',
          vadTargets: {
            valence: { min: 0.3, max: 0.5, target: 0.4 },
            arousal: { min: 0.4, max: 0.6, target: 0.5 },
            dominance: { min: 0.4, max: 0.6, target: 0.5 }
          },
          bpmRange: { min: 60, max: 80 },
          trackCharacteristics: ['gentle acknowledgment', 'validating tones', 'supportive harmonies']
        },
        {
          name: 'Neurological Distraction',
          duration: 20,
          purpose: 'Engage pain gate mechanisms and cognitive distraction',
          vadTargets: {
            valence: { min: 0.5, max: 0.7, target: 0.6 },
            arousal: { min: 0.3, max: 0.5, target: 0.4 },
            dominance: { min: 0.5, max: 0.7, target: 0.6 }
          },
          bpmRange: { min: 70, max: 100 },
          trackCharacteristics: ['complex harmonies', 'engaging melodies', 'rhythmic patterns']
        },
        {
          name: 'Endorphin Release Phase',
          duration: 15,
          purpose: 'Stimulate natural pain relief mechanisms',
          vadTargets: {
            valence: { min: 0.6, max: 0.8, target: 0.7 },
            arousal: { min: 0.2, max: 0.4, target: 0.3 },
            dominance: { min: 0.6, max: 0.8, target: 0.7 }
          },
          bpmRange: { min: 50, max: 70 },
          trackCharacteristics: ['soothing progressions', 'comfort-inducing', 'healing frequencies']
        }
      ],
      totalDuration: { min: 30, max: 60, optimal: 40 },
      intensityRange: { min: 2, max: 6 },
      vadProgression: {
        entry: { valence: 0.3, arousal: 0.6, dominance: 0.4 },
        peak: { valence: 0.6, arousal: 0.4, dominance: 0.6 },
        resolution: { valence: 0.7, arousal: 0.3, dominance: 0.7 }
      }
    },
    progressionPath: [
      { step: 1, milestone: 'Acute pain relief', expectedChange: '2-3 point reduction on pain scale', timeframe: 'during session', nextAction: 'track pain patterns' },
      { step: 2, milestone: 'Extended relief duration', expectedChange: 'pain relief lasts 2+ hours', timeframe: '3-5 sessions', nextAction: 'increase session frequency' },
      { step: 3, milestone: 'Improved pain coping', expectedChange: 'better emotional response to pain', timeframe: '2 weeks', nextAction: 'integrate with physical therapy' },
      { step: 4, milestone: 'Reduced pain medication', expectedChange: '20-30% reduction in pain medication', timeframe: '4-6 weeks', nextAction: 'consult with physician' }
    ],
    measurableOutcomes: [
      { name: 'Numeric Pain Rating Scale', type: 'subjective', scale: '0-10 pain intensity', frequency: 'session' },
      { name: 'Pain Interference Scale', type: 'subjective', scale: 'Brief Pain Inventory', frequency: 'weekly' },
      { name: 'Medication Usage Log', type: 'objective', scale: 'medication frequency/dosage', frequency: 'daily' },
      { name: 'Functional Capacity Assessment', type: 'objective', scale: 'activities of daily living scale', frequency: 'weekly' }
    ]
  },

  {
    id: 'mood-elevation-protocol',
    name: 'Clinical Mood Enhancement',
    description: 'Therapeutic music intervention for depression, low mood, and emotional dysregulation',
    category: 'clinical',
    targetConditions: ['major depression', 'seasonal affective disorder', 'dysthymia', 'bipolar depression'],
    contraindications: ['manic episodes', 'severe suicidal ideation', 'psychotic features'],
    sessionStructure: {
      phases: [
        {
          name: 'Emotional Validation Phase',
          duration: 8,
          purpose: 'Acknowledge current emotional state without judgment',
          vadTargets: {
            valence: { min: 0.2, max: 0.4, target: 0.3 },
            arousal: { min: 0.3, max: 0.5, target: 0.4 },
            dominance: { min: 0.3, max: 0.5, target: 0.4 }
          },
          bpmRange: { min: 50, max: 70 },
          trackCharacteristics: ['empathetic tones', 'minor keys initially', 'gentle progression']
        },
        {
          name: 'Gradual Mood Lift',
          duration: 20,
          purpose: 'Progressive elevation through neurochemical activation',
          vadTargets: {
            valence: { min: 0.4, max: 0.7, target: 0.55 },
            arousal: { min: 0.4, max: 0.6, target: 0.5 },
            dominance: { min: 0.4, max: 0.7, target: 0.55 }
          },
          bpmRange: { min: 70, max: 100 },
          trackCharacteristics: ['major key transitions', 'uplifting melodies', 'rhythmic engagement']
        },
        {
          name: 'Positive Integration',
          duration: 12,
          purpose: 'Consolidate positive emotional state and build resilience',
          vadTargets: {
            valence: { min: 0.6, max: 0.8, target: 0.7 },
            arousal: { min: 0.5, max: 0.7, target: 0.6 },
            dominance: { min: 0.6, max: 0.8, target: 0.7 }
          },
          bpmRange: { min: 80, max: 110 },
          trackCharacteristics: ['energizing rhythms', 'hopeful harmonies', 'empowering themes']
        }
      ],
      totalDuration: { min: 25, max: 50, optimal: 40 },
      intensityRange: { min: 2, max: 7 },
      vadProgression: {
        entry: { valence: 0.2, arousal: 0.3, dominance: 0.3 },
        peak: { valence: 0.6, arousal: 0.5, dominance: 0.6 },
        resolution: { valence: 0.7, arousal: 0.6, dominance: 0.7 }
      }
    },
    progressionPath: [
      { step: 1, milestone: 'Temporary mood lift', expectedChange: 'improved mood during and 1 hour post-session', timeframe: 'immediate', nextAction: 'daily sessions for 1 week' },
      { step: 2, milestone: 'Sustained improvements', expectedChange: 'mood improvements last 4+ hours', timeframe: '1 week', nextAction: 'integrate with behavioral activation' },
      { step: 3, milestone: 'Emotional resilience', expectedChange: 'better coping with mood dips', timeframe: '3 weeks', nextAction: 'reduce session frequency gradually' },
      { step: 4, milestone: 'Stable mood baseline', expectedChange: 'consistent mood improvements', timeframe: '6-8 weeks', nextAction: 'maintenance protocol' }
    ],
    measurableOutcomes: [
      { name: 'Patient Health Questionnaire-9', type: 'subjective', scale: 'PHQ-9 depression scale', frequency: 'weekly' },
      { name: 'Daily Mood Rating', type: 'subjective', scale: '1-10 mood scale', frequency: 'daily' },
      { name: 'Behavioral Activation Scale', type: 'objective', scale: 'activity engagement metrics', frequency: 'weekly' },
      { name: 'Quality of Life Assessment', type: 'subjective', scale: 'WHO-QOL scale', frequency: 'weekly' }
    ]
  }
];

/**
 * Therapeutic Use Case Manager
 * Orchestrates therapeutic sessions and tracks outcomes
 */
export class TherapeuticUseCaseManager {
  
  /**
   * Get use case by ID
   */
  static getUseCase(id: string): TherapeuticUseCase | null {
    return THERAPEUTIC_USE_CASES.find(uc => uc.id === id) || null;
  }
  
  /**
   * Get appropriate use cases for a therapeutic goal
   */
  static getUseCasesForGoal(goalSlug: string): TherapeuticUseCase[] {
    const goal = TherapeuticGoalMapper.findGoal(goalSlug);
    if (!goal) return [];
    
    // Map goal slugs to use case patterns
    const goalToUseCaseMap: Record<string, string[]> = {
      'anxiety-down': ['anxiety-reduction-protocol'],
      'focus-up': ['focus-enhancement-protocol'],
      'sleep': ['sleep-induction-protocol'],
      'pain-down': ['pain-management-protocol'],
      'mood-boost': ['mood-elevation-protocol'],
    };
    
    const useCaseIds = goalToUseCaseMap[goal.slug] || [];
    return useCaseIds.map(id => this.getUseCase(id)).filter(Boolean) as TherapeuticUseCase[];
  }
  
  /**
   * Create therapeutic session based on use case
   */
  static async createTherapeuticSession(
    useCaseId: string,
    duration: number,
    intensity: number,
    availableTracks: Track[]
  ): Promise<TherapeuticSession | null> {
    const useCase = this.getUseCase(useCaseId);
    if (!useCase) return null;
    
    // Filter tracks based on therapeutic requirements
    const suitableTracks = this.filterTracksForUseCase(availableTracks, useCase, intensity);
    
    // Create progressive track sequence
    const sessionTracks = this.sequenceTracksForTherapy(suitableTracks, useCase, duration);
    
    return {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      useCase,
      tracks: sessionTracks,
      duration,
      intensity,
      progression: {
        currentPhase: 0,
        timeElapsed: 0,
        vadJourney: []
      },
      expectedOutcomes: this.generateExpectedOutcomes(useCase, intensity, duration)
    };
  }
  
  /**
   * Filter tracks based on use case requirements
   */
  private static filterTracksForUseCase(
    tracks: Track[],
    useCase: TherapeuticUseCase,
    intensity: number
  ): Track[] {
    return tracks.filter(track => {
      // Check if track has required metadata
      if (!track.bpm || !track.vad) return false;
      
      // Find appropriate phase based on intensity
      const phaseIndex = Math.min(
        Math.floor(intensity / 3),
        useCase.sessionStructure.phases.length - 1
      );
      const targetPhase = useCase.sessionStructure.phases[phaseIndex];
      
      // Check BPM compatibility
      if (track.bpm < targetPhase.bpmRange.min || track.bpm > targetPhase.bpmRange.max) {
        return false;
      }
      
      // Check VAD compatibility
      const { valence, arousal } = track.vad;
      const vadTargets = targetPhase.vadTargets;
      
      if (valence < vadTargets.valence.min || valence > vadTargets.valence.max) {
        return false;
      }
      
      if (arousal < vadTargets.arousal.min || arousal > vadTargets.arousal.max) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Sequence tracks according to therapeutic progression
   */
  private static sequenceTracksForTherapy(
    tracks: Track[],
    useCase: TherapeuticUseCase,
    duration: number
  ): Track[] {
    const sequence: Track[] = [];
    const phases = useCase.sessionStructure.phases;
    let timeRemaining = duration;
    
    for (let i = 0; i < phases.length && timeRemaining > 0; i++) {
      const phase = phases[i];
      const phaseTime = Math.min(phase.duration, timeRemaining);
      const tracksNeeded = Math.ceil(phaseTime / 4); // Assume 4 min average track length
      
      // Filter tracks suitable for this phase
      const phaseTracks = tracks.filter(track => {
        const vadTargets = phase.vadTargets;
        return track.vad.valence >= vadTargets.valence.min &&
               track.vad.valence <= vadTargets.valence.max &&
               track.vad.arousal >= vadTargets.arousal.min &&
               track.vad.arousal <= vadTargets.arousal.max &&
               (track.bpm || 0) >= phase.bpmRange.min &&
               (track.bpm || 0) <= phase.bpmRange.max;
      });
      
      // Select best tracks for this phase
      const selectedTracks = phaseTracks
        .sort((a, b) => this.calculatePhaseCompatibility(b, phase) - this.calculatePhaseCompatibility(a, phase))
        .slice(0, tracksNeeded);
      
      sequence.push(...selectedTracks);
      timeRemaining -= phaseTime;
    }
    
    return sequence;
  }
  
  /**
   * Calculate how well a track matches a therapeutic phase
   */
  private static calculatePhaseCompatibility(track: Track, phase: TherapeuticPhase): number {
    const vadTargets = phase.vadTargets;
    const valenceScore = 1 - Math.abs(track.vad.valence - vadTargets.valence.target);
    const arousalScore = 1 - Math.abs(track.vad.arousal - vadTargets.arousal.target);
    const bpmScore = 1 - Math.abs((track.bpm || 0) - (phase.bpmRange.min + phase.bpmRange.max) / 2) / 50;
    
    return (valenceScore + arousalScore + Math.max(0, bpmScore)) / 3;
  }
  
  /**
   * Generate expected therapeutic outcomes for a session
   */
  private static generateExpectedOutcomes(
    useCase: TherapeuticUseCase,
    intensity: number,
    duration: number
  ): TherapeuticOutcome[] {
    return useCase.measurableOutcomes.map(measure => ({
      metric: measure.name,
      baseline: 5, // Placeholder - would be personalized
      target: this.calculateTarget(measure, intensity, duration),
      timeline: `${duration} minutes`
    }));
  }
  
  /**
   * Calculate target outcome based on intensity and duration
   */
  private static calculateTarget(measure: OutcomeMeasure, intensity: number, duration: number): number {
    const baseImprovement = 2;
    const intensityMultiplier = intensity / 5;
    const durationMultiplier = Math.min(duration / 30, 2);
    
    return baseImprovement * intensityMultiplier * durationMultiplier;
  }
  
  /**
   * Get all use cases by category
   */
  static getUseCasesByCategory(category: 'clinical' | 'wellness' | 'performance' | 'recovery'): TherapeuticUseCase[] {
    return THERAPEUTIC_USE_CASES.filter(uc => uc.category === category);
  }
  
  /**
   * Validate therapeutic session progress
   */
  static validateSessionProgress(session: TherapeuticSession): {
    isOnTrack: boolean;
    recommendations: string[];
    adjustments: string[];
  } {
    const recommendations: string[] = [];
    const adjustments: string[] = [];
    
    // Analyze VAD journey for expected progression
    const currentVAD = session.progression.vadJourney[session.progression.vadJourney.length - 1];
    const expectedVAD = this.getExpectedVADForPhase(session.useCase, session.progression.currentPhase);
    
    let isOnTrack = true;
    
    if (currentVAD) {
      const vadDeviation = Math.abs(currentVAD.valence - expectedVAD.valence) + 
                          Math.abs(currentVAD.arousal - expectedVAD.arousal);
      
      if (vadDeviation > 0.3) {
        isOnTrack = false;
        recommendations.push('VAD trajectory deviating from expected therapeutic path');
        adjustments.push('Consider adjusting track selection or session intensity');
      }
    }
    
    return { isOnTrack, recommendations, adjustments };
  }
  
  /**
   * Get expected VAD values for a specific phase
   */
  private static getExpectedVADForPhase(useCase: TherapeuticUseCase, phaseIndex: number): { valence: number; arousal: number } {
    if (phaseIndex >= useCase.sessionStructure.phases.length) {
      const lastPhase = useCase.sessionStructure.phases[useCase.sessionStructure.phases.length - 1];
      return {
        valence: lastPhase.vadTargets.valence.target,
        arousal: lastPhase.vadTargets.arousal.target
      };
    }
    
    const phase = useCase.sessionStructure.phases[phaseIndex];
    return {
      valence: phase.vadTargets.valence.target,
      arousal: phase.vadTargets.arousal.target
    };
  }
}