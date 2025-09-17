// Advanced title formatting for machine-readable filenames
export class TitleFormatter {
  // Common musical abbreviations and their expansions
  private static abbreviations = {
    'bpm': 'BPM',
    'op': 'Op.',
    'no': 'No.',
    'vol': 'Vol.',
    'pt': 'Part',
    'mvt': 'Movement',
    'maj': 'Major',
    'min': 'Minor',
    'edm': 'EDM',
    'dj': 'DJ',
    'hiit': 'HIIT',
    'remix': 'Remix',
    'remastered': 'Remastered'
  };

  // Musical terms that should be capitalized
  private static musicalTerms = [
    'classical', 'baroque', 'romantic', 'renaissance', 'contemporary',
    'jazz', 'blues', 'rock', 'pop', 'country', 'folk', 'samba', 'tango',
    'waltz', 'mazurka', 'nocturne', 'sonata', 'concerto', 'symphony',
    'prelude', 'fugue', 'etude', 'ballade', 'scherzo', 'rondo'
  ];

  // Common conjunctions and prepositions to keep lowercase
  private static lowercaseWords = ['and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

  static formatTitle(filename: string): string {
    if (!filename) return 'Untitled Track';

    // Remove file extension
    let title = filename.replace(/\.(mp3|wav|m4a|flac|ogg)$/i, '');

    // Handle different separator patterns
    title = title
      // Replace hyphens and underscores with spaces
      .replace(/[-_]+/g, ' ')
      // Handle camelCase by adding spaces before uppercase letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();

    // Split into words for processing
    const words = title.toLowerCase().split(' ');

    // Process each word
    const processedWords = words.map((word, index) => {
      // Skip empty words
      if (!word) return '';

      // Handle abbreviations
      if (this.abbreviations[word]) {
        return this.abbreviations[word];
      }

      // Handle musical terms - always capitalize
      if (this.musicalTerms.includes(word)) {
        return this.capitalizeWord(word);
      }

      // Handle conjunctions/prepositions (keep lowercase unless first/last word)
      if (this.lowercaseWords.includes(word) && index !== 0 && index !== words.length - 1) {
        return word;
      }

      // Handle numbers with musical context
      if (/^\d+$/.test(word)) {
        // Check if it's likely a BPM, opus number, etc.
        const nextWord = words[index + 1];
        if (nextWord === 'bpm' || nextWord === 'hz') {
          return word;
        }
      }

      // Default: capitalize first letter
      return this.capitalizeWord(word);
    });

    return processedWords.filter(word => word).join(' ');
  }

  private static capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Format specifically for music track context
  static formatTrackTitle(filename: string, fallbackTitle?: string): string {
    if (fallbackTitle && fallbackTitle !== filename) {
      return fallbackTitle;
    }
    return this.formatTitle(filename);
  }

  // Extract key musical information from filename
  static extractMusicalInfo(filename: string): {
    bpm?: number;
    key?: string;
    opus?: string;
    movement?: number;
  } {
    const info: any = {};
    const lower = filename.toLowerCase();

    // Extract BPM
    const bpmMatch = lower.match(/(\d+)[-_ ]*bpm/);
    if (bpmMatch) info.bpm = parseInt(bpmMatch[1]);

    // Extract opus
    const opusMatch = lower.match(/op[-_ ]*(\d+)/);
    if (opusMatch) info.opus = `Op. ${opusMatch[1]}`;

    // Extract movement
    const movementMatch = lower.match(/mov(?:ement)?[-_ ]*(\d+)/);
    if (movementMatch) info.movement = parseInt(movementMatch[1]);

    return info;
  }
}

// Backward compatibility
export const formatTrackTitleForDisplay = TitleFormatter.formatTrackTitle;
