import { 
  THERAPEUTIC_GOALS, 
  SYNONYM_TO_GOAL, 
  GOALS_BY_ID, 
  GOALS_BY_SLUG, 
  GOALS_BY_BACKEND_KEY,
  type TherapeuticGoal 
} from '@/config/therapeuticGoals';

/**
 * Central therapeutic goal mapping system
 * Handles translation between frontend, backend, and legacy systems
 */
export class TherapeuticGoalMapper {
  
  /**
   * Find a therapeutic goal by any identifier (flexible input)
   */
  static findGoal(input: string): TherapeuticGoal | null {
    if (!input) return null;
    
    // Normalize input
    const normalized = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    // Try direct lookup first
    if (SYNONYM_TO_GOAL[normalized]) {
      return SYNONYM_TO_GOAL[normalized];
    }
    
    // Try original input
    if (SYNONYM_TO_GOAL[input.toLowerCase()]) {
      return SYNONYM_TO_GOAL[input.toLowerCase()];
    }
    
    // Fallback: find by partial match
    for (const goal of THERAPEUTIC_GOALS) {
      if (goal.name.toLowerCase().includes(input.toLowerCase()) ||
          goal.description.toLowerCase().includes(input.toLowerCase())) {
        return goal;
      }
    }
    
    return null;
  }
  
  /**
   * Get goal by exact ID
   */
  static getById(id: string): TherapeuticGoal | null {
    return GOALS_BY_ID[id] || null;
  }
  
  /**
   * Get goal by slug (for URL routing)
   */
  static getBySlug(slug: string): TherapeuticGoal | null {
    return GOALS_BY_SLUG[slug] || null;
  }
  
  /**
   * Get goal by backend key (for API calls)
   */
  static getByBackendKey(key: string): TherapeuticGoal | null {
    return GOALS_BY_BACKEND_KEY[key] || null;
  }
  
  /**
   * Convert any input to a goal slug (backwards compatibility)
   */
  static toGoalSlug(input: string): string {
    const goal = this.findGoal(input);
    return goal?.slug || 'mood-boost'; // Default fallback
  }
  
  /**
   * Convert any input to backend key for API calls
   */
  static toBackendKey(input: string): string {
    const goal = this.findGoal(input);
    return goal?.backendKey || 'mood-boost';
  }
  
  /**
   * Get display name for any input
   */
  static getDisplayName(input: string): string {
    const goal = this.findGoal(input);
    return goal?.name || 'Mood Boost';
  }
  
  /**
   * Generate SQL WHERE clause for therapeutic goal filtering
   */
  static generateSQLFilter(goalInput: string, bpmColumn = 'bpm'): string {
    const goal = this.findGoal(goalInput);
    if (!goal) return '1=1'; // Return all if no goal found
    
    return `${bpmColumn} >= ${goal.bpmRange.min} AND ${bpmColumn} <= ${goal.bpmRange.max}`;
  }
  
  /**
   * Get all goals with optional filtering
   */
  static getAllGoals(filter?: {
    includeInactive?: boolean;
    category?: string;
  }): TherapeuticGoal[] {
    let goals = [...THERAPEUTIC_GOALS];
    
    if (filter?.includeInactive === false) {
      goals = goals.filter(g => g.isActive !== false);
    }
    
    return goals;
  }
  
  /**
   * Validate if input is a valid therapeutic goal
   */
  static isValidGoal(input: string): boolean {
    return this.findGoal(input) !== null;
  }
  
  /**
   * Get therapeutic insights for a goal
   */
  static getTherapeuticInsights(goalInput: string): {
    goal: TherapeuticGoal;
    bpmRange: string;
    vadProfile: string;
    effectiveness: string;
  } | null {
    const goal = this.findGoal(goalInput);
    if (!goal) return null;
    
    return {
      goal,
      bpmRange: `${goal.bpmRange.min}-${goal.bpmRange.max} BPM (optimal: ${goal.bpmRange.optimal})`,
      vadProfile: `Valence: ${goal.vadProfile.valence}, Arousal: ${goal.vadProfile.arousal}`,
      effectiveness: `Optimized for ${goal.description.toLowerCase()}`
    };
  }
}