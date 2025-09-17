// Track quality assessment and filtering system
import { TitleFormatter } from './titleFormatter';

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
  stream_url?: string;
}

interface QualityScore {
  score: number;
  reasons: string[];
  isHighQuality: boolean;
}

// Common music terms that should be properly spaced
const musicTerms = [
  'instrumental', 'classical', 'piano', 'guitar', 'violin', 'orchestra',
  'ambient', 'meditation', 'relaxation', 'peaceful', 'calming', 'soothing',
  'focus', 'concentration', 'therapy', 'healing', 'nature', 'rain', 'ocean',
  'binaural', 'beats', 'frequency', 'chakra', 'mindfulness', 'yoga',
  'sleep', 'dreams', 'lullaby', 'gentle', 'soft', 'tranquil', 'zen'
];

// Low-quality indicators
const qualityRedFlags = [
  /remix\d+$/i,                    // ends with remix1, remix2, etc.
  /\d{2,}[a-z]+\d{2,}/i,          // mixed numbers and letters (118bpmremix9)
  /[a-z]{20,}/i,                   // very long concatenated words
  /[a-z]+\d+[a-z]+\d+/i,          // alternating letters and numbers
  /^[a-z]+[0-9]+$/i,               // title ending with just numbers
  /test|debug|temp|sample/i,       // test/debug files
  /untitled|unnamed|track\d+$/i,   // generic titles
];

// High-quality indicators
const qualityGreenFlags = [
  /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/,  // Proper Title Case
  /^\d+\.\s+/,                        // Numbered tracks like "1. Song Name"
  /\s-\s/,                           // Proper separators like "Artist - Song"
  /^[A-Za-z\s]+$/,                   // Only letters and spaces
];

/**
 * Assess the quality of a track title
 */
export function assessTrackQuality(track: Track): QualityScore {
  const title = track.title || '';
  let score = 50; // Start with neutral score
  const reasons: string[] = [];

  // Length checks
  if (title.length < 3) {
    score -= 30;
    reasons.push('Title too short');
  } else if (title.length > 80) {
    score -= 20;
    reasons.push('Title too long');
  }

  // Check for red flags (bad quality indicators)
  for (const redFlag of qualityRedFlags) {
    if (redFlag.test(title)) {
      score -= 25;
      reasons.push(`Poor formatting: ${redFlag.source}`);
    }
  }

  // Check for very long words without spaces (concatenated mess)
  const words = title.split(/\s+/);
  const longWords = words.filter(word => word.length > 15);
  if (longWords.length > 0) {
    score -= longWords.length * 15;
    reasons.push(`Concatenated words: ${longWords.join(', ')}`);
  }

  // Check for proper spacing between music terms
  let hasProperSpacing = true;
  for (const term of musicTerms) {
    const regex = new RegExp(`[a-z]${term}|${term}[a-z]`, 'i');
    if (regex.test(title) && !title.toLowerCase().includes(` ${term.toLowerCase()} `)) {
      hasProperSpacing = false;
      score -= 10;
    }
  }
  
  if (!hasProperSpacing) {
    reasons.push('Poor spacing between music terms');
  }

  // Check for green flags (good quality indicators)
  for (const greenFlag of qualityGreenFlags) {
    if (greenFlag.test(title)) {
      score += 15;
      reasons.push(`Good formatting: ${greenFlag.source}`);
    }
  }

  // Bonus for proper capitalization
  const formattedTitle = TitleFormatter.formatTrackTitle(title);
  if (formattedTitle !== title && formattedTitle.length > 0) {
    // Title benefited from formatting
    if (formattedTitle.split(' ').length > title.split(' ').length) {
      score += 10;
      reasons.push('Benefits from proper formatting');
    }
  }

  // Bonus for having artist/album separation
  if (title.includes(' - ') || title.includes(': ')) {
    score += 10;
    reasons.push('Has proper artist/title separation');
  }

  // Penalty for excessive numbers
  const numberMatches = title.match(/\d/g);
  if (numberMatches && numberMatches.length > 5) {
    score -= 10;
    reasons.push('Too many numbers');
  }

  // Final score normalization
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    reasons,
    isHighQuality: score >= 60
  };
}

/**
 * Filter tracks by quality, removing obviously poor tracks
 */
export function filterLowQualityTracks(tracks: Track[]): Track[] {
  return tracks.filter(track => {
    const quality = assessTrackQuality(track);
    return quality.score >= 30; // Remove really bad tracks
  });
}

/**
 * Sort tracks by quality score (best first)
 */
export function sortTracksByQuality(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => {
    const scoreA = assessTrackQuality(a).score;
    const scoreB = assessTrackQuality(b).score;
    return scoreB - scoreA;
  });
}

/**
 * Get the best quality tracks from a list
 */
export function getBestQualityTracks(tracks: Track[], count: number = 50): Track[] {
  const filtered = filterLowQualityTracks(tracks);
  const sorted = sortTracksByQuality(filtered);
  return sorted.slice(0, count);
}

/**
 * Check if a track title is considered "terrible"
 */
export function isTerribleTrack(track: Track): boolean {
  const quality = assessTrackQuality(track);
  return quality.score < 20;
}

/**
 * Get quality insights for debugging
 */
export function getQualityInsights(tracks: Track[]): {
  total: number;
  highQuality: number;
  mediumQuality: number;
  lowQuality: number;
  terrible: number;
  averageScore: number;
} {
  const scores = tracks.map(track => assessTrackQuality(track).score);
  const highQuality = scores.filter(s => s >= 70).length;
  const mediumQuality = scores.filter(s => s >= 40 && s < 70).length;
  const lowQuality = scores.filter(s => s >= 20 && s < 40).length;
  const terrible = scores.filter(s => s < 20).length;
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return {
    total: tracks.length,
    highQuality,
    mediumQuality,
    lowQuality,
    terrible,
    averageScore: Math.round(averageScore)
  };
}