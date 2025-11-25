import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Local video files matched to each track
const CURATED_VIDEO_FILES = [
  '/videos/landing-01.mp4', // Track 1
  '/videos/landing-02.mp4', // Track 2
  '/videos/landing-03.mp4', // Track 3
  '/videos/landing-04.mp4', // Track 4
  '/videos/landing-05.mp4', // Track 5
  '/videos/landing-06.mp4', // Track 6
  '/videos/landing-07.mp4', // Track 7
  '/videos/landing-08.mp4', // Track 8
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

  // Use local video files directly
  useEffect(() => {
    setVideoUrls(CURATED_VIDEO_FILES);
    
    // CRITICAL: Video must be muted - only music player audio should be heard
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
    }
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

  // Autoplay video immediately, independent of audio playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoUrls.length === 0) return;

    const playPromise = video.play();
    if (playPromise && (playPromise as any).catch) {
      (playPromise as Promise<void>).catch(() => {
        // Ignore autoplay block; user interaction will allow playback
        console.log('🎬 Video autoplay blocked, waiting for user interaction');
      });
    }
  }, [videoUrls]);

  // Apply BPM-derived playbackRate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate || 1.0;
  }, [playbackRate]);

  // No time sync - let video play smoothly at its own pace
  // The BPM-adjusted playback rate creates visual rhythm without forcing exact sync

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
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
