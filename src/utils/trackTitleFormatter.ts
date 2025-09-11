// Common music-related keywords to identify in concatenated titles
const musicKeywords = [
  'bach', 'mozart', 'beethoven', 'chopin', 'vivaldi', 'debussy', 'classical',
  'piano', 'guitar', 'violin', 'mandolin', 'cello', 'flute', 'orchestra',
  'focus', 'relaxing', 'meditation', 'calm', 'peaceful', 'therapeutic',
  'ambient', 'nature', 'rain', 'ocean', 'forest', 'birds', 'water',
  'delta', 'theta', 'alpha', 'beta', 'gamma', 'binaural', 'hz',
  'jazz', 'blues', 'folk', 'acoustic', 'instrumental', 'solo'
];

/**
 * Extracts the core song title by removing metadata and technical information
 */
export function formatTrackTitleForDisplay(title: string): string {
  if (!title) return '';
  
  let cleaned = title;
  
  // First, extract everything before common metadata separators
  const metadataSeparators = [
    /\s+-\s+\d+\s*hz/i,           // - 432 Hz
    /\s+-\s+\d+\s*bpm/i,          // - 120 BPM
    /\s+\|\s+/,                   // |separator
    /\s+•\s+/,                    // •separator
    /\s+–\s+/,                    // –separator
    /\s+—\s+/,                    // —separator
    /\s*\(\s*\d+\s*(hz|bpm|min)\s*\)/i, // (432 Hz) or (120 BPM) or (5 min)
    /\s*\[\s*\d+\s*(hz|bpm|min)\s*\]/i, // [432 Hz] or [120 BPM] or [5 min]
  ];
  
  // Split by metadata separators and take the first part
  for (const separator of metadataSeparators) {
    const parts = cleaned.split(separator);
    if (parts.length > 1) {
      cleaned = parts[0].trim();
      break;
    }
  }
  
  // Remove technical suffixes at the end
  cleaned = cleaned
    .replace(/\s+\d{2,3}\s*(hz|bpm|min|minutes?|seconds?)\s*$/i, '')
    .replace(/\s+\d{1,2}:\d{2}\s*$/, '') // Remove duration like 5:32
    .replace(/\s*\(\s*\d+\s*\)\s*$/, '') // Remove (1), (2), etc.
    .replace(/\s*#\d+\s*$/, '')          // Remove #1, #2, etc.
    .replace(/\s*-\s*\d+\s*$/, '')       // Remove - 1, - 2, etc.
    .replace(/\s+track\s+\d+\s*$/i, '')  // Remove "Track 1", "Track 2"
    .trim();
  
  // Add spaces before capital letters (for PascalCase titles)
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Capitalize properly
  cleaned = cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Final cleanup
  cleaned = cleaned
    .replace(/\s+/g, ' ')  // Multiple spaces to single space
    .trim();
  
  return cleaned || title; // Fallback to original if cleaning results in empty string
}