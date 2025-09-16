import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, X, Heart, Plus } from "lucide-react";
import { useAudioStore } from "@/stores";
import { formatTrackTitleForDisplay } from "@/utils/trackTitleFormatter";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { albumArtPool, getAlbumArtForTrack } from '@/utils/albumArtPool';

export const MinimizedPlayer = () => {
  const { 
    play, 
    pause, 
    next, 
    stop,
    isPlaying, 
    currentTrack: track, 
    setPlayerMode,
    currentTime,
    duration,
    lastGoal
  } = useAudioStore();

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Local state for album artwork
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);

  // Local fallback art pool
  const localArtPool = [
    '/lovable-uploads/568fe397-023c-4d61-816d-837de0948919.png',
    '/lovable-uploads/1da41b51-e4bb-41a7-9015-6e45aebb523c.png',
    '/lovable-uploads/54738be0-6688-4c13-b54a-05591ce054f7.png',
    '/lovable-uploads/68343a15-d97c-4dd6-a85f-a0806d963bb7.png',
    '/lovable-uploads/a59ca21a-a07c-448b-bc2f-b1470dc870db.png',
    '/lovable-uploads/1c80f044-2499-45b2-9ed4-69da791f15e4.png',
    '/lovable-uploads/0032890f-a22d-4907-8823-9b8b6c2f8221.png'
  ];

  // Load album art from Supabase albumart bucket if track has no artwork
  useEffect(() => {
    let cancelled = false;
    const loadAlbumArt = async () => {
      try {
        if (!track || (track as any).artwork_url || (track as any).album_art_url) return;
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: artFiles } = await supabase.storage
          .from('albumart')
          .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
        const images = (artFiles || []).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name));
        if (!images.length) return;
        const seed = Array.from((track.id || '')).reduce((a, c) => a + c.charCodeAt(0), 0);
        const chosen = images[seed % images.length];
        const { data: urlData } = supabase.storage.from('albumart').getPublicUrl(chosen.name);
        if (!cancelled) setAlbumArtUrl(urlData.publicUrl);
      } catch (e) {
        console.warn('Album art load failed', e);
      }
    };
    loadAlbumArt();
    return () => { cancelled = true; };
  }, [track?.id]);

  if (!track) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Choose best available album artwork (track-provided -> bucket -> local pool)
  const seed = Array.from((track?.id || '')).reduce((a, c) => a + c.charCodeAt(0), 0);
  const fallbackLocalArt = localArtPool[seed % localArtPool.length];
  const artworkSrc = (track as any)?.album_art_url || (track as any)?.artwork_url || albumArtUrl || fallbackLocalArt;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-lg bg-card/30 border-t border-border shadow-glass-lg">
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted/30">
        <div 
          className="h-full bg-primary/70 transition-all duration-300 shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Player content */}
      <div 
        className="px-4 py-3 flex items-center gap-3 cursor-pointer"
        onClick={() => setPlayerMode('full')}
      >
        {/* Album art with Glass Effect */}
        <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
          <img
            src={artworkSrc}
            alt={formatTrackTitleForDisplay(track.title)}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight truncate">
            {formatTrackTitleForDisplay(track.title)}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {getTherapeuticGoalName()}
          </p>
        </div>
        
        {/* Controls with Glass Morphism */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // TODO: Add favorite functionality
            }}
          >
            <Heart className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // TODO: Add lightning playlist functionality
            }}
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={1} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 sm:w-8 sm:h-8 bg-primary/30 hover:bg-primary/40 border border-primary/50 rounded-full backdrop-blur-sm shadow-glass-inset touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              isPlaying ? pause() : play();
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-4 sm:h-4 text-primary" />
            ) : (
              <Play className="w-6 h-6 sm:w-4 sm:h-4 text-primary" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-foreground/80 hover:text-foreground hover:bg-card/40 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              next();
            }}
          >
            <SkipForward className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              stop();
            }}
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};