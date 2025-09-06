import { useState, useEffect, useCallback } from 'react';
import { 
  THERAPEUTIC_GOALS, 
  type TherapeuticGoal 
} from '@/config/therapeuticGoals';
import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import { filterTracksForGoal } from '@/utils/therapeuticFiltering';
import { API } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface UseTherapeuticGoalsOptions {
  autoLoad?: boolean;
  enableCaching?: boolean;
  cacheTimeout?: number; // in milliseconds
}

interface GoalWithMetrics extends TherapeuticGoal {
  trackCount?: number;
  effectiveness?: number;
  isLoading?: boolean;
  error?: string;
}

interface TherapeuticGoalsState {
  goals: GoalWithMetrics[];
  selectedGoal: TherapeuticGoal | null;
  isLoading: boolean;
  error: string | null;
  cache: Map<string, { data: any; timestamp: number }>;
}

export function useTherapeuticGoals(options: UseTherapeuticGoalsOptions = {}) {
  const {
    autoLoad = true,
    enableCaching = true,
    cacheTimeout = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [state, setState] = useState<TherapeuticGoalsState>({
    goals: THERAPEUTIC_GOALS.map(goal => ({ ...goal })),
    selectedGoal: null,
    isLoading: false,
    error: null,
    cache: new Map()
  });

  // Cache helper
  const getCachedData = useCallback((key: string) => {
    if (!enableCaching) return null;
    
    const cached = state.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cacheTimeout;
    if (isExpired) {
      state.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }, [enableCaching, cacheTimeout, state.cache]);

  const setCachedData = useCallback((key: string, data: any) => {
    if (!enableCaching) return;
    
    setState(prev => ({
      ...prev,
      cache: new Map(prev.cache).set(key, {
        data,
        timestamp: Date.now()
      })
    }));
  }, [enableCaching]);

  // Load track counts for all goals
  const loadGoalMetrics = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedGoals = await Promise.all(
        THERAPEUTIC_GOALS.map(async (goal) => {
          const cacheKey = `goal-metrics-${goal.id}`;
          const cached = getCachedData(cacheKey);
          
          if (cached) {
            return { ...goal, ...cached };
          }
          
          try {
            // Load tracks for this goal
            const response = await API.playlist(goal.slug as any, 1000); // Get all tracks
            const trackCount = response.tracks?.length || 0;
            
            // Calculate effectiveness based on BPM matching using new therapeutic filtering
            const matchingTracks = filterTracksForGoal(
              response.tracks?.map((t: any) => ({
                id: t.id,
                bpm: t.bpm,
                valence: t.valence,
                energy_level: t.energy_level,
                musical_key_est: t.musical_key_est,
                camelot: t.camelot,
              })) || [], 
              goal.slug as any
            );
            
            const effectiveness = trackCount > 0 
              ? Math.round((matchingTracks.length / trackCount) * 100)
              : 0;
            
            const metrics = { trackCount, effectiveness };
            setCachedData(cacheKey, metrics);
            
            return { ...goal, ...metrics };
          } catch (error) {
            console.warn(`Failed to load metrics for ${goal.name}:`, error);
            return { ...goal, trackCount: 0, effectiveness: 0, error: error instanceof Error ? error.message : 'Failed to load' };
          }
        })
      );
      
      setState(prev => ({
        ...prev,
        goals: updatedGoals,
        isLoading: false
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load goal metrics';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      
      toast({
        title: "Failed to load therapeutic goals",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [getCachedData, setCachedData]);

  // Select a goal by any identifier
  const selectGoal = useCallback((goalInput: string) => {
    const goal = TherapeuticGoalMapper.findGoal(goalInput);
    
    if (!goal) {
      toast({
        title: "Invalid therapeutic goal",
        description: `Could not find goal: ${goalInput}`,
        variant: "destructive"
      });
      return false;
    }
    
    setState(prev => ({ ...prev, selectedGoal: goal }));
    return true;
  }, []);

  // Get goal by any identifier
  const getGoal = useCallback((goalInput: string): TherapeuticGoal | null => {
    return TherapeuticGoalMapper.findGoal(goalInput);
  }, []);

  // Get filtered goals
  const getFilteredGoals = useCallback((filters: {
    minTrackCount?: number;
    minEffectiveness?: number;
    bpmRange?: { min: number; max: number };
  } = {}) => {
    return state.goals.filter(goal => {
      if (filters.minTrackCount && (goal.trackCount || 0) < filters.minTrackCount) {
        return false;
      }
      
      if (filters.minEffectiveness && (goal.effectiveness || 0) < filters.minEffectiveness) {
        return false;
      }
      
      if (filters.bpmRange) {
        const hasOverlap = goal.bpmRange.max >= filters.bpmRange.min && 
                          goal.bpmRange.min <= filters.bpmRange.max;
        if (!hasOverlap) return false;
      }
      
      return true;
    });
  }, [state.goals]);

  // Refresh cache
  const refreshCache = useCallback(() => {
    setState(prev => ({ ...prev, cache: new Map() }));
    loadGoalMetrics();
  }, [loadGoalMetrics]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadGoalMetrics();
    }
  }, [autoLoad, loadGoalMetrics]);

  return {
    // State
    goals: state.goals,
    selectedGoal: state.selectedGoal,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    selectGoal,
    getGoal,
    loadGoalMetrics,
    getFilteredGoals,
    refreshCache,
    
    // Utilities
    mapper: TherapeuticGoalMapper,
    
    // Shortcuts for common operations
    getGoalBySlug: TherapeuticGoalMapper.getBySlug,
    getGoalById: TherapeuticGoalMapper.getById,
    toBackendKey: TherapeuticGoalMapper.toBackendKey,
    toGoalSlug: TherapeuticGoalMapper.toGoalSlug,
    getDisplayName: TherapeuticGoalMapper.getDisplayName
  };
}