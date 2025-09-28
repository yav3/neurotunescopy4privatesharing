// Debug utilities for track selection issues
import { EnhancedTrackSelectionService } from '@/services/enhancedTrackSelection';
import { UserFavoritesService } from '@/services/userFavorites';
import { MusicalSimilarityService } from '@/services/musicalSimilarityDetection';

declare global {
  interface Window {
    debugTrackSelection: typeof debugTrackSelection;
    clearTrackHistory: typeof clearTrackHistory;
    showFavoritesDebug: typeof showFavoritesDebug;
  }
}

// Debug function to check track selection logic
export const debugTrackSelection = async (userId?: string) => {
  try {
    console.log('🐛 === TRACK SELECTION DEBUG ===');
    
    if (!userId) {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }
    
    if (!userId) {
      console.log('❌ No user ID available for debugging');
      return;
    }
    
    console.log(`👤 User ID: ${userId.substring(0, 8)}...`);
    
    // Get debug info
    const debugInfo = EnhancedTrackSelectionService.getDebugInfo(userId);
    console.log('📊 Debug Info:', debugInfo);
    
    // Get user favorites
    const favorites = await UserFavoritesService.getUserFavorites();
    console.log(`🤍 User Favorites (${favorites.length} total):`, favorites.map(f => ({
      track_id: f.track_id,
      created_at: f.created_at
    })));
    
    // Get musical similarity report
    const similarityReport = MusicalSimilarityService.getSimilarityReport(userId);
    console.log('🎵 Musical Similarity Report:', similarityReport);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

// Clear track history for testing
export const clearTrackHistory = async (userId?: string) => {
  try {
    if (!userId) {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }
    
    if (!userId) {
      console.log('❌ No user ID available');
      return;
    }
    
    EnhancedTrackSelectionService.clearRecentlyPlayed(userId);
    console.log('✅ Track history cleared for user');
    
  } catch (error) {
    console.error('❌ Clear history error:', error);
  }
};

// Debug favorites system
export const showFavoritesDebug = async (trackId?: string) => {
  try {
    console.log('🐛 === FAVORITES DEBUG ===');
    
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No authenticated user');
      return;
    }
    
    console.log(`👤 User ID: ${user.id.substring(0, 8)}...`);
    
    // Get all favorites from database
    const { data: dbFavorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('🗄️ Database Favorites:', dbFavorites);
    console.log('❌ Database Error:', error);
    
    // Get favorites via service
    const serviceFavorites = await UserFavoritesService.getUserFavorites();
    console.log('🔧 Service Favorites:', serviceFavorites);
    
    if (trackId) {
      console.log(`🎵 Checking specific track: ${trackId}`);
      const isFav = await UserFavoritesService.isFavorite(trackId);
      console.log(`💖 Is Favorite: ${isFav}`);
      
      // Check if track hash exists
      const trackHash = (UserFavoritesService as any).generateTrackHash?.(trackId);
      console.log(`🔢 Track Hash: ${trackHash}`);
      
      // Look for this hash in database
      if (trackHash) {
        const { data: hashCheck } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('track_id', trackHash);
        console.log('🔍 Hash Check Result:', hashCheck);
      }
    }
    
  } catch (error) {
    console.error('❌ Favorites debug error:', error);
  }
};

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.debugTrackSelection = debugTrackSelection;
  window.clearTrackHistory = clearTrackHistory;
  window.showFavoritesDebug = showFavoritesDebug;
  
  console.log('🐛 Debug functions available:');
  console.log('  - window.debugTrackSelection() - Full debug report');
  console.log('  - window.clearTrackHistory() - Reset track history');
  console.log('  - window.showFavoritesDebug(trackId?) - Debug favorites system');
}