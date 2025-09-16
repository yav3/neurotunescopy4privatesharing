// Expanded album art collection for therapeutic music
// These images represent different moods and therapeutic states

import oceanWaveArt from '@/assets/album-art-ocean-wave.png';
import zenStonesArt from '@/assets/album-art-zen-stones.png';
import mountainLakeArt from '@/assets/album-art-mountain-lake.png';
import waterDropArt from '@/assets/album-art-water-drop.png';
import leafDropletsArt from '@/assets/album-art-leaf-droplets.png';
import goldenSplashArt from '@/assets/album-art-golden-splash.png';
import sunsetLakeArt from '@/assets/album-art-sunset-lake.png';
import dewdropArt from '@/assets/album-art-dewdrop.png';
import energyMotivationArt from '@/assets/energy-motivation-updated.png';

// Existing therapeutic art imports (keep for backward compatibility)
import therapeuticCard1 from '@/assets/therapeutic-card-1.png';
import therapeuticCard2 from '@/assets/therapeutic-card-2.png';
import therapeuticCard3 from '@/assets/therapeutic-card-3.png';
import therapeuticCard4 from '@/assets/therapeutic-card-4.png';

export const albumArtPool = [
  // New high-quality album art
  oceanWaveArt,          // Energetic, dynamic waves
  zenStonesArt,          // Balance, meditation, focus
  mountainLakeArt,       // Calm, serenity, nature
  waterDropArt,          // Mindfulness, precision, focus
  leafDropletsArt,       // Natural healing, freshness
  goldenSplashArt,       // Energy, vitality, movement
  sunsetLakeArt,         // Peaceful, relaxation, end of day
  dewdropArt,            // Gentle healing, morning peace
  
  // Existing therapeutic cards (fallback)
  therapeuticCard1,
  therapeuticCard2,
  therapeuticCard3,
  therapeuticCard4
];

/**
 * Get a unique album art image based on track ID
 * Uses a simple hash to ensure consistent artwork for the same track
 */
export const getAlbumArtForTrack = (trackId: string): string => {
  if (!trackId) return albumArtPool[0];
  
  // Simple hash function to map track ID to art index
  let hash = 0;
  for (let i = 0; i < trackId.length; i++) {
    const char = trackId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % albumArtPool.length;
  return albumArtPool[index];
};

/**
 * Get album art by therapeutic goal type
 * Maps therapeutic goals to appropriate artwork
 */
export const getAlbumArtByGoal = (goalId: string): string => {
  const goalArtMap: Record<string, string> = {
    'focus-enhancement': zenStonesArt,        // Balance and concentration
    'stress-anxiety': mountainLakeArt,        // Calm serenity
    'mood-boost': goldenSplashArt,           // Energy and vitality
    'pain-relief': dewdropArt,               // Gentle healing
    'energy-boost': energyMotivationArt,     // Dynamic energy with ocean wave
    'sleep-support': sunsetLakeArt,          // Peaceful rest
    'meditation': waterDropArt,              // Mindful focus
    'cardio': goldenSplashArt,              // High energy
  };
  
  return goalArtMap[goalId] || albumArtPool[0];
};
