// Fallback mapping for empty storage buckets
// Maps empty buckets to populated ones with similar content

export const BUCKET_FALLBACKS: Record<string, string[]> = {
  // Empty buckets → Working buckets with similar content
  'pop': ['ENERGYBOOST'], // Pop music - ENERGYBOOST has actual pop tracks mixed with EDM
  'HIIT': ['ENERGYBOOST', 'neuralpositivemusic'], // HIIT fallback to high-energy music
  'countryandamericana': ['NewAgeandWorldFocus'], // REMOVED ENERGYBOOST fallback - causes EDM instead of country
  'gentleclassicalforpain': ['Chopin', 'newageworldstressanxietyreduction'], // Gentle classical fallback
  'sonatasforstress': ['Chopin'], // Sonatas should ONLY fallback to Chopin classical music
  'painreducingworld': ['newageworldstressanxietyreduction', 'NewAgeandWorldFocus'], // World music fallback
  'moodboostremixesworlddance': ['ENERGYBOOST', 'neuralpositivemusic'], // House and dance music fallback
  'audio': ['ENERGYBOOST', 'neuralpositivemusic'], // Empty audio bucket fallback
  'newageworldstressanxietyreduction': ['NewAgeandWorldFocus'], // If primary new age is empty, use world focus only
  'meditation': ['newageworldstressanxietyreduction', 'Chopin'], // Non-Sleep Deep Rest fallback to calm music
  'Nocturnes': ['Chopin', 'newageworldstressanxietyreduction'], // Nocturnes fallback to piano music and new age
  'albumart': ['neuralpositivemusic', 'Chopin'], // Empty album art bucket - fallback to music buckets for now
};

// Cache of known empty buckets to avoid repeated requests
const KNOWN_EMPTY_BUCKETS = new Set([
  'sonatasforstress', // Skip this bucket - contains sleep music, not sonatas
  'albumart',
  'pop', 
  'HIIT',
  'gentleclassicalforpain',
  'painreducingworld',
  'audio'
]);

/**
 * Check if a bucket should be skipped due to being known empty
 * @param bucket - Bucket name to check
 * @returns True if bucket should be skipped
 */
export const shouldSkipEmptyBucket = (bucket: string): boolean => {
  return KNOWN_EMPTY_BUCKETS.has(bucket);
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
 * @returns Expanded array including fallback buckets, with empty buckets filtered out
 */
export const expandBucketsWithFallbacks = (buckets: string[]): string[] => {
  const allBuckets = new Set<string>();
  
  console.log(`🔄 Expanding buckets with fallbacks: ${buckets.join(', ')}`);
  
  buckets.forEach(bucket => {
    // Skip known empty buckets entirely and use only their fallbacks
    if (shouldSkipEmptyBucket(bucket)) {
      console.log(`⚡ Skipping known empty bucket: ${bucket}, using fallbacks only`);
      const fallbacks = BUCKET_FALLBACKS[bucket] || [];
      fallbacks.forEach(fallback => {
        if (!shouldSkipEmptyBucket(fallback)) {
          console.log(`📈 Adding fallback bucket: ${fallback}`);
          allBuckets.add(fallback);
        } else {
          console.log(`⚠️ Fallback bucket ${fallback} is also empty, skipping`);
        }
      });
    } else {
      // Use the bucket itself, plus fallbacks if it becomes empty
      console.log(`✅ Using original bucket: ${bucket}`);
      allBuckets.add(bucket);
      const fallbacks = BUCKET_FALLBACKS[bucket] || [];
      fallbacks.forEach(fallback => {
        if (!shouldSkipEmptyBucket(fallback)) {
          console.log(`📈 Adding additional fallback: ${fallback}`);
          allBuckets.add(fallback);
        }
      });
    }
  });
  
  const result = Array.from(allBuckets);
  console.log(`📊 Final expanded buckets: ${result.join(', ')}`);
  return result;
};

/**
 * Check if a bucket is known to be empty and needs fallbacks
 * @param bucket - Bucket name to check
 * @returns True if bucket is known to be empty
 */
export const isBucketEmpty = (bucket: string): boolean => {
  return Object.keys(BUCKET_FALLBACKS).includes(bucket);
};