// Re-export from unified audio store
export { playFromGoal, playTrackNow } from "@/stores";

// Helper function to play from specific genre buckets
export const playFromGenre = async (goal: string, genreBuckets: string[]) => {
  const { useAudioStore } = await import("@/stores");
  return useAudioStore.getState().playFromGoal(goal, genreBuckets);
};
