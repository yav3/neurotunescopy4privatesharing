import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// These must match the video filenames in CURATED_PLAYLIST from LandingPagePlayer
const CURATED_VIDEO_FILES = [
  '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4', // The Spartan Age
  '19700121_0258_6923840584fc8191a6b2658f4caceac4.mp4', // Cross The Line
  '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',       // Expanding Universe
  '20251122_0450_01kanf03azfr5b3gy0328zj5j8.mp4',       // Venha ao Meu Jardim
  '20251123_1505_01kakyxn2mfma8jw0q7bjwax6x.mp4',       // House World
  '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',       // Quietude Nocturne (shares video with Expanding Universe)
];

interface BackgroundVideoCarouselProps {
  playbackRate: number;
  currentVideoIndex: number;
  isPlaying: boolean;
}

export const BackgroundVideoCarousel: React.FC<BackgroundVideoCarouselProps> = ({
  playbackRate,
  currentVideoIndex,
  isPlaying,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  // Build public URLs for the curated video files
  useEffect(() => {
    const urls = CURATED_VIDEO_FILES.map((filename) =>
      supabase.storage.from('landingpage').getPublicUrl(filename).data
        .publicUrl,
    );
    setVideoUrls(urls);
  }, []);

  // Load/change the video source with fade-to-black transition
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoUrls.length === 0) return;

    const safeIndex =
      ((currentVideoIndex % videoUrls.length) + videoUrls.length) %
      videoUrls.length;
    const nextSrc = videoUrls[safeIndex];

    console.log(`🎬 Video index ${currentVideoIndex} → ${safeIndex}, URL: ${nextSrc.substring(nextSrc.lastIndexOf('/') + 1)}`);

    if (video.src !== nextSrc) {
      console.log('🎬 Starting fade-to-black transition');
      // Fade to black
      setFadeOpacity(1);
      
      setTimeout(() => {
        // Switch video while black
        video.src = nextSrc;
        video.load();
        
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise && (playPromise as any).catch) {
            (playPromise as Promise<void>).catch(() => {});
          }
        }
        
        console.log('🎬 Video switched, fading back in');
        // Fade back in
        setTimeout(() => {
          setFadeOpacity(0);
        }, 100);
      }, 500);
    }
  }, [currentVideoIndex, videoUrls, isPlaying]);

  // Play / pause in sync with audio isPlaying
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise && (playPromise as any).catch) {
        (playPromise as Promise<void>).catch(() => {
          // Ignore autoplay block; user interaction will fix
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Apply BPM-derived playbackRate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate || 1.0;
  }, [playbackRate]);

  // Sync video time to the active audio element (gentle sync to avoid flickering)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use interval instead of requestAnimationFrame to reduce sync frequency
    const syncInterval = setInterval(() => {
      const audio = (window as any).__landingActiveAudio as
        | HTMLAudioElement
        | null;

      if (audio && !audio.paused) {
        const diff = Math.abs(video.currentTime - audio.currentTime);
        // Only sync if drift is significant (300ms) to avoid visible flickering
        if (diff > 0.3) {
          video.currentTime = audio.currentTime;
          console.log(`🎬 Video sync correction: ${diff.toFixed(2)}s drift`);
        }
      }
    }, 500); // Check every 500ms instead of every frame

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        loop
        className="w-full h-full object-cover"
      />
      {/* Fade-to-black transition overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: fadeOpacity }}
      />
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
};
