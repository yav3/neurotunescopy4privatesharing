// Updated to use centralized therapeutic goals configuration
import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import type { GoalSlug } from '@/config/therapeuticGoals';

export { 
  GOALS, 
  type GoalSlug 
} from '@/config/therapeuticGoals';

/** turn any UI label into a canonical slug */
export function toGoalSlug(input: string): GoalSlug {
  return TherapeuticGoalMapper.toGoalSlug(input) as GoalSlug;
}

/** Get display name for a goal slug */
export function getGoalDisplayName(slug: GoalSlug): string {
  return TherapeuticGoalMapper.getDisplayName(slug);
}

/** Get goal categories for UI display - uses centralized config */
export { THERAPEUTIC_GOALS as GOAL_CATEGORIES } from '@/config/therapeuticGoals';