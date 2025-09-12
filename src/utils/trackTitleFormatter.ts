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
 * Enhanced version with better handling of concatenated words
 */
export function formatTrackTitleForDisplay(title: string): string {
  if (!title) return '';
  
  let cleaned = title;
  
  // First, handle obvious concatenated mess like "Biophillaiinstrumentalclassicallate19thcenturyrelaxation118bpmremix9"
  // Try to break apart concatenated music terms
  const musicTermsRegex = musicKeywords.map(term => `(${term})`).join('|');
  const regex = new RegExp(`([a-z])(${musicTermsRegex})([a-z])`, 'gi');
  cleaned = cleaned.replace(regex, '$1 $2 $3');
  
  // Break apart numbers from letters
  cleaned = cleaned.replace(/([a-z])(\d+)/gi, '$1 $2');
  cleaned = cleaned.replace(/(\d+)([a-z])/gi, '$1 $2');
  
  // Handle common concatenations manually
  cleaned = cleaned
    .replace(/([a-z])(classical|instrumental|relaxation|meditation|piano|guitar|violin|orchestra)/gi, '$1 $2')
    .replace(/(classical|instrumental|relaxation|meditation|piano|guitar|violin|orchestra)([a-z])/gi, '$1 $2')
    .replace(/([a-z])(19th|20th|21st|century)/gi, '$1 $2')
    .replace(/(19th|20th|21st|century)([a-z])/gi, '$1 $2')
    .replace(/([a-z])(remix|version|edit)/gi, '$1 $2')
    .replace(/(remix|version|edit)([0-9])/gi, '$1 $2');
  
  // Extract everything before common metadata separators
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
    .replace(/\s+remix\s*\d*\s*$/i, '')  // Remove "remix", "remix1", etc.
    .trim();
  
  // Add spaces before capital letters (for PascalCase titles)
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Capitalize properly - but preserve existing good capitalization
  if (cleaned.toLowerCase() === cleaned || cleaned.toUpperCase() === cleaned) {
    // Only auto-capitalize if the title is all lowercase or all uppercase
    cleaned = cleaned
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        // Don't capitalize very short words unless they're at the beginning
        if (word.length <= 2 && word !== cleaned.split(' ')[0]) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  
  // If the cleaned title is too short or looks weird, try a different approach
  if (cleaned.length < 3 || cleaned.split(' ').length < 2) {
    // Try to salvage something from the original
    let fallback = title
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (fallback.length > cleaned.length) {
      cleaned = fallback;
    }
  }
  
  return cleaned || title; // Fallback to original if cleaning results in empty string
}