// Fallback mapping for empty storage buckets
// Maps empty buckets to populated ones with similar content

export const BUCKET_FALLBACKS: Record<string, string[]> = {
  // Empty buckets → Working buckets with similar content
  'pop': ['ENERGYBOOST'], // Pop music - ENERGYBOOST has actual pop tracks mixed with EDM
  'HIIT': ['ENERGYBOOST', 'neuralpositivemusic'], // HIIT fallback to high-energy music
  'countryandamericana': ['NewAgeandWorldFocus'], // REMOVED ENERGYBOOST fallback - causes EDM instead of country
  'gentleclassicalforpain': ['Chopin', 'newageworldstressanxietyreduction'], // Gentle classical fallback
  'sonatasforstress': ['Chopin', 'newageworldstressanxietyreduction'], // Sonatas fallback to working classical buckets
  'painreducingworld': ['newageworldstressanxietyreduction', 'NewAgeandWorldFocus'], // World music fallback
  'moodboostremixesworlddance': ['ENERGYBOOST', 'neuralpositivemusic'], // Empty mood boost bucket fallback
  'audio': ['ENERGYBOOST', 'neuralpositivemusic'], // Empty audio bucket fallback
  'newageworldstressanxietyreduction': ['NewAgeandWorldFocus', 'neuralpositivemusic'], // If primary new age is empty, use these working buckets
  'meditation': ['newageworldstressanxietyreduction', 'Chopin'], // Non-Sleep Deep Rest fallback to calm music
  'Nocturnes': ['Chopin', 'newageworldstressanxietyreduction'], // Nocturnes fallback to piano music and new age
};

/**
 * Get fallback buckets for a given bucket if it's empty
 * @param originalBucket - The original bucket that might be empty
 * @returns Array of fallback bucket names, or original bucket if no fallbacks needed
 */
export const getFallbackBuckets = (originalBucket: string): string[] => {
  const fallbacks = BUCKET_FALLBACKS[originalBucket];
  return fallbacks || [originalBucket];
};

/**
 * Get all possible buckets including fallbacks for an array of buckets
 * @param buckets - Original bucket array
 * @returns Expanded array including fallback buckets
 */
export const expandBucketsWithFallbacks = (buckets: string[]): string[] => {
  const allBuckets = new Set<string>();
  
  buckets.forEach(bucket => {
    const bucketsToTry = getFallbackBuckets(bucket);
    bucketsToTry.forEach(b => allBuckets.add(b));
  });
  
  return Array.from(allBuckets);
};

/**
 * Check if a bucket is known to be empty and needs fallbacks
 * @param bucket - Bucket name to check
 * @returns True if bucket is known to be empty
 */
export const isBucketEmpty = (bucket: string): boolean => {
  return Object.keys(BUCKET_FALLBACKS).includes(bucket);
};