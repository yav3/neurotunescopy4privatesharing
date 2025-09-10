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
 * Cleans track titles for display by removing metadata and making them human-readable
 */
export function formatTrackTitleForDisplay(title: string): string {
  if (!title) return '';
  
  let cleaned = title.toLowerCase();
  
  // Handle concatenated words by inserting spaces before known keywords
  musicKeywords.forEach(keyword => {
    const regex = new RegExp(`(?<!^|\\s)${keyword}(?!$|\\s)`, 'gi');
    cleaned = cleaned.replace(regex, ` ${keyword} `);
  });
  
  // Add spaces before capital letters in original title (for mixed case)
  cleaned = title.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  
  // Re-apply keyword separation on the processed string
  musicKeywords.forEach(keyword => {
    const regex = new RegExp(`(?<!^|\\s)${keyword}(?!$|\\s)`, 'gi');
    cleaned = cleaned.replace(regex, ` ${keyword} `);
  });
  
  cleaned = cleaned
    // Capitalize first letter of each word
    .replace(/\b\w/g, letter => letter.toUpperCase())
    // Remove BPM info (e.g., "118", "120 BPM", etc.)
    .replace(/\s+\d{2,3}(\s+BPM)?\s+/gi, ' ')
    // Remove genre info at the end (Rock, Jazz, Classical, etc.)
    .replace(/\s+(Rock|Jazz|Classical|Electronic|Ambient|Folk|Pop|Hip Hop|R&B|Country|Blues|Reggae|Funk|Soul|Disco|House|Techno|Trance|Dubstep|Drum and Bass|Breakbeat|Garage|UK Garage|Speed Garage|Bassline|Jungle|Hardcore|Happy Hardcore|Gabber|Industrial|Metal|Death Metal|Black Metal|Thrash Metal|Heavy Metal|Power Metal|Progressive Metal|Symphonic Metal|Gothic Metal|Doom Metal|Sludge Metal|Stoner Metal|Post Metal|Metalcore|Deathcore|Grindcore|Mathcore|Screamo|Emo|Post Hardcore|Alternative Rock|Indie Rock|Punk Rock|Pop Punk|Ska Punk|Hardcore Punk|Post Punk|New Wave|Synthwave|Retrowave|Vaporwave|Chillwave|Downtempo|Trip Hop|Lofi|Chill|Relaxing|Meditation|Therapeutic|Binaural|Nature|Soundscape|Remix|Mix|Edit|Version|Instrumental|Acoustic|Live|Demo|Extended|Radio|Club|Dance|Vocal|Original)(\s+(Mix|Remix|Edit|Version))?$/gi, '')
    // Remove trailing numbers and special characters
    .replace(/\s*[#\-_]\s*\d+\s*$/g, '')
    // Remove redundant words that appear multiple times
    .replace(/\b(\w+)(\s+\1\b)+/gi, '$1')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Remove parenthetical content at end like "(1)"
    .replace(/\s*\(\d+\)\s*$/g, '')
    .trim();
  
  return cleaned || title; // Fallback to original if cleaning results in empty string
}