import { useState, useCallback, useEffect } from 'react';
import { TherapeuticUseCaseManager, type TherapeuticSession, type TherapeuticUseCase } from '@/services/therapeuticUseCases';
import { useAudioStore } from '@/stores/audioStore';
import { toast } from 'sonner';
import type { Track } from '@/types';

interface UseTherapeuticSessionOptions {
  autoTrackProgress?: boolean;
  enableOutcomeTracking?: boolean;
  syncWithAudioStore?: boolean;
}

interface TherapeuticSessionState {
  currentSession: TherapeuticSession | null;
  isActive: boolean;
  progress: {
    currentPhase: number;
    timeElapsed: number;
    phaseProgress: number;
    overallProgress: number;
  };
  outcomes: {
    baseline: Record<string, number>;
    current: Record<string, number>;
    improvements: Record<string, number>;
  };
  vadJourney: Array<{
    timestamp: number;
    valence: number;
    arousal: number;
    dominance?: number;
    phase: number;
  }>;
}

export function useTherapeuticSession(options: UseTherapeuticSessionOptions = {}) {
  const {
    autoTrackProgress = true,
    enableOutcomeTracking = true,
    syncWithAudioStore = true
  } = options;

  const audioStore = useAudioStore();
  
  const [state, setState] = useState<TherapeuticSessionState>({
    currentSession: null,
    isActive: false,
    progress: {
      currentPhase: 0,
      timeElapsed: 0,
      phaseProgress: 0,
      overallProgress: 0
    },
    outcomes: {
      baseline: {},
      current: {},
      improvements: {}
    },
    vadJourney: []
  });

  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Start a new therapeutic session
   */
  const startSession = useCallback(async (
    useCaseId: string,
    duration: number,
    intensity: number,
    availableTracks: Track[]
  ): Promise<boolean> => {
    try {
      const session = await TherapeuticUseCaseManager.createTherapeuticSession(
        useCaseId,
        duration,
        intensity,
        availableTracks
      );

      if (!session) {
        toast.error('Failed to create therapeutic session');
        return false;
      }

      // Initialize baseline measurements if outcome tracking is enabled
      const baseline = enableOutcomeTracking ? await collectBaselineMeasurements(session.useCase) : {};

      setState({
        currentSession: session,
        isActive: true,
        progress: {
          currentPhase: 0,
          timeElapsed: 0,
          phaseProgress: 0,
          overallProgress: 0
        },
        outcomes: {
          baseline,
          current: { ...baseline },
          improvements: {}
        },
        vadJourney: [{
          timestamp: Date.now(),
          valence: session.useCase.sessionStructure.vadProgression.entry.valence,
          arousal: session.useCase.sessionStructure.vadProgression.entry.arousal,
          dominance: session.useCase.sessionStructure.vadProgression.entry.dominance,
          phase: 0
        }]
      });

      // Sync with audio store if enabled
      if (syncWithAudioStore && session.tracks.length > 0) {
        await audioStore.setQueue(session.tracks, 0);
        await audioStore.playTrack(session.tracks[0]);
      }

      // Start progress tracking
      if (autoTrackProgress) {
        startProgressTracking();
      }

      toast.success(`Started ${session.useCase.name}`, {
        description: `${duration} minute session with ${session.tracks.length} tracks`
      });

      return true;
    } catch (error) {
      console.error('Failed to start therapeutic session:', error);
      toast.error('Failed to start therapeutic session');
      return false;
    }
  }, [audioStore, autoTrackProgress, enableOutcomeTracking, syncWithAudioStore]);

  /**
   * End the current therapeutic session
   */
  const endSession = useCallback(async (collectOutcomes: boolean = true): Promise<void> => {
    if (!state.currentSession) return;

    // Stop progress tracking
    if (progressTimer) {
      clearInterval(progressTimer);
      setProgressTimer(null);
    }

    // Collect final outcomes if enabled
    if (enableOutcomeTracking && collectOutcomes) {
      await collectFinalOutcomes();
    }

    // Calculate session effectiveness
    const effectiveness = calculateSessionEffectiveness();
    
    toast.success('Therapeutic session completed', {
      description: `Session effectiveness: ${Math.round(effectiveness * 100)}%`
    });

    // Store session data for learning
    await storeSessionData();

    setState(prev => ({
      ...prev,
      isActive: false,
      currentSession: null
    }));
  }, [state.currentSession, progressTimer, enableOutcomeTracking]);

  /**
   * Start automatic progress tracking
   */
  const startProgressTracking = useCallback(() => {
    if (progressTimer) clearInterval(progressTimer);

    const timer = setInterval(() => {
      setState(prev => {
        if (!prev.currentSession || !prev.isActive) return prev;

        const newTimeElapsed = prev.progress.timeElapsed + 1; // Increment by 1 second
        const session = prev.currentSession;
        const phases = session.useCase.sessionStructure.phases;
        
        // Calculate current phase
        let currentPhase = 0;
        let phaseStartTime = 0;
        
        for (let i = 0; i < phases.length; i++) {
          const phaseEndTime = phaseStartTime + (phases[i].duration * 60); // Convert to seconds
          if (newTimeElapsed <= phaseEndTime) {
            currentPhase = i;
            break;
          }
          phaseStartTime = phaseEndTime;
          if (i === phases.length - 1) currentPhase = i; // Last phase
        }

        // Calculate phase progress
        const currentPhaseStartTime = phases.slice(0, currentPhase).reduce((sum, phase) => sum + (phase.duration * 60), 0);
        const currentPhaseDuration = phases[currentPhase].duration * 60;
        const phaseProgress = Math.min(1, (newTimeElapsed - currentPhaseStartTime) / currentPhaseDuration);

        // Calculate overall progress
        const totalDuration = session.duration * 60; // Convert to seconds
        const overallProgress = Math.min(1, newTimeElapsed / totalDuration);

        // Update VAD journey with current expected values
        const currentPhaseTargets = phases[currentPhase].vadTargets;
        const newVADPoint = {
          timestamp: Date.now(),
          valence: currentPhaseTargets.valence.target,
          arousal: currentPhaseTargets.arousal.target,
          dominance: currentPhaseTargets.dominance?.target,
          phase: currentPhase
        };

        return {
          ...prev,
          progress: {
            currentPhase,
            timeElapsed: newTimeElapsed,
            phaseProgress,
            overallProgress
          },
          vadJourney: [...prev.vadJourney, newVADPoint]
        };
      });
    }, 1000); // Update every second

    setProgressTimer(timer);
  }, [progressTimer]);

  /**
   * Pause/resume the session
   */
  const togglePause = useCallback(() => {
    if (state.isActive && progressTimer) {
      clearInterval(progressTimer);
      setProgressTimer(null);
      toast.info('Session paused');
    } else if (state.isActive && !progressTimer) {
      startProgressTracking();
      toast.info('Session resumed');
    }
  }, [state.isActive, progressTimer, startProgressTracking]);

  /**
   * Record subjective measurement during session
   */
  const recordMeasurement = useCallback((metric: string, value: number) => {
    setState(prev => ({
      ...prev,
      outcomes: {
        ...prev.outcomes,
        current: {
          ...prev.outcomes.current,
          [metric]: value
        }
      }
    }));

    // Calculate improvement
    const baseline = state.outcomes.baseline[metric] || 5;
    const improvement = value - baseline;
    
    setState(prev => ({
      ...prev,
      outcomes: {
        ...prev.outcomes,
        improvements: {
          ...prev.outcomes.improvements,
          [metric]: improvement
        }
      }
    }));

    toast.success(`Recorded ${metric}: ${value}`);
  }, [state.outcomes.baseline]);

  /**
   * Get current phase information
   */
  const getCurrentPhaseInfo = useCallback(() => {
    if (!state.currentSession) return null;

    const phase = state.currentSession.useCase.sessionStructure.phases[state.progress.currentPhase];
    return {
      ...phase,
      progress: state.progress.phaseProgress,
      timeRemaining: (phase.duration * 60) - ((state.progress.timeElapsed % (phase.duration * 60)))
    };
  }, [state.currentSession, state.progress]);

  /**
   * Validate session progress and get recommendations
   */
  const validateProgress = useCallback(() => {
    if (!state.currentSession) return null;
    
    return TherapeuticUseCaseManager.validateSessionProgress(state.currentSession);
  }, [state.currentSession]);

  /**
   * Helper function to collect baseline measurements
   */
  const collectBaselineMeasurements = async (useCase: TherapeuticUseCase): Promise<Record<string, number>> => {
    const baseline: Record<string, number> = {};
    
    // For demo purposes, using default values
    // In a real implementation, this would prompt the user or use stored data
    useCase.measurableOutcomes.forEach(outcome => {
      baseline[outcome.name] = 5; // Default middle value on 1-10 scale
    });
    
    return baseline;
  };

  /**
   * Collect final outcome measurements
   */
  const collectFinalOutcomes = async (): Promise<void> => {
    // In a real implementation, this would prompt for final measurements
    // For now, simulate slight improvements
    setState(prev => {
      const improvements: Record<string, number> = {};
      Object.keys(prev.outcomes.baseline).forEach(metric => {
        const baseline = prev.outcomes.baseline[metric];
        const improvement = Math.random() * 2 - 0.5; // Random improvement between -0.5 and 1.5
        improvements[metric] = improvement;
      });
      
      return {
        ...prev,
        outcomes: {
          ...prev.outcomes,
          improvements
        }
      };
    });
  };

  /**
   * Calculate overall session effectiveness
   */
  const calculateSessionEffectiveness = (): number => {
    const improvements = Object.values(state.outcomes.improvements);
    if (improvements.length === 0) return 0.5; // Default neutral effectiveness
    
    const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
    return Math.max(0, Math.min(1, 0.5 + (avgImprovement / 5))); // Normalize to 0-1
  };

  /**
   * Store session data for machine learning
   */
  const storeSessionData = async (): Promise<void> => {
    if (!state.currentSession) return;

    const sessionData = {
      sessionId: state.currentSession.id,
      useCaseId: state.currentSession.useCase.id,
      duration: state.currentSession.duration,
      intensity: state.currentSession.intensity,
      tracks: state.currentSession.tracks.map(t => t.id),
      vadJourney: state.vadJourney,
      outcomes: state.outcomes,
      effectiveness: calculateSessionEffectiveness(),
      completedAt: new Date().toISOString()
    };

    // Store in localStorage for now (could be sent to backend)
    const storedSessions = JSON.parse(localStorage.getItem('therapeuticSessions') || '[]');
    storedSessions.push(sessionData);
    localStorage.setItem('therapeuticSessions', JSON.stringify(storedSessions.slice(-100))); // Keep last 100
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    };
  }, [progressTimer]);

  return {
    // State
    currentSession: state.currentSession,
    isActive: state.isActive,
    progress: state.progress,
    outcomes: state.outcomes,
    vadJourney: state.vadJourney,
    
    // Actions
    startSession,
    endSession,
    togglePause,
    recordMeasurement,
    
    // Utilities
    getCurrentPhaseInfo,
    validateProgress,
    
    // Computed
    isPaused: state.isActive && !progressTimer,
    effectiveness: calculateSessionEffectiveness(),
    timeRemaining: state.currentSession ? (state.currentSession.duration * 60) - state.progress.timeElapsed : 0
  };
}