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
  '/videos/landing-09.mp4', // Track 9
  '/videos/landing-10.mp4', // Track 10
  '/videos/landing-11.mp4', // Track 11
  '/videos/landing-12.mp4', // Track 12
  '/videos/landing-13.mp4', // Track 13
  '/videos/landing-14.mp4', // Track 14
  '/videos/landing-15.mp4', // Track 15
  '/videos/landing-16.mp4', // Track 16
  '/videos/landing-17.mp4', // Track 17
  '/videos/landing-18.mp4', // Track 18
  '/videos/landing-19.mp4', // Track 19
  '/videos/landing-20.mp4', // Track 20
  '/videos/landing-21.mp4', // Track 21
  '/videos/landing-22.mp4', // Track 22
  '/videos/landing-23.mp4', // Track 23
  '/videos/landing-24.mp4', // Track 24
  '/videos/landing-25.mp4', // Track 25
  '/videos/landing-26.mp4', // Track 26
  '/videos/landing-27.mp4', // Track 27
  '/videos/landing-28.mp4', // Track 28
  '/videos/landing-29.gif', // Track 29
  '/videos/landing-30.gif', // Track 30
  '/videos/landing-31.gif', // Track 31
  '/videos/landing-32.gif', // Track 32
  '/videos/landing-33.gif', // Track 33
  '/videos/landing-34.gif', // Track 34
  '/videos/landing-35.gif', // Track 35
  '/videos/landing-36.gif', // Track 36
  '/videos/landing-37.gif', // Track 37
  '/videos/landing-38.gif', // Track 38
  '/videos/landing-39.gif', // Track 39
  '/videos/landing-40.gif', // Track 40
  '/videos/landing-41.gif', // Track 41
  '/videos/landing-42.gif', // Track 42
  '/videos/landing-43.gif', // Track 43
  '/videos/landing-44.gif', // Track 44
  '/videos/landing-45.gif', // Track 45
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
  const [internalVideoIndex, setInternalVideoIndex] = useState(0);

  // Use local video files directly and load first video
  useEffect(() => {
    setVideoUrls(CURATED_VIDEO_FILES);
    
    const video = videoRef.current;
    if (video) {
      // CRITICAL: Video must be muted - only music player audio should be heard
      video.muted = true;
      video.volume = 0;
      
      // Load first video
      video.src = CURATED_VIDEO_FILES[0];
      video.load();
    }
  }, []);

  // Videos cycle independently from track changes - don't reset video index on track change
  // This allows all 45 videos to be shown even though there are only 23 tracks
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoUrls.length === 0) return;

    // Only log track changes, don't change video
    console.log(`🎵 Track changed to index ${currentVideoIndex}`);
  }, [currentVideoIndex, videoUrls]);

  // Control video playback based on isPlaying state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoUrls.length === 0) return;

    // Ensure video is completely muted
    video.muted = true;
    video.volume = 0;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise && (playPromise as any).catch) {
        (playPromise as Promise<void>).catch(() => {
          console.log('🎬 Video play blocked, waiting for user interaction');
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, videoUrls]);

  // Apply BPM-derived playbackRate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate || 1.0;
  }, [playbackRate]);

  // No time sync - let video play smoothly at its own pace
  // The BPM-adjusted playback rate creates visual rhythm without forcing exact sync

  // When video ends, advance to next video (not next track)
  const handleVideoEnded = () => {
    console.log('🎬 Video ended, cycling to next video');
    const nextVideoIndex = (internalVideoIndex + 1) % videoUrls.length;
    setInternalVideoIndex(nextVideoIndex);
    
    const video = videoRef.current;
    if (!video) return;
    
    const nextSrc = videoUrls[nextVideoIndex];
    console.log(`🎬 Cycling from video ${internalVideoIndex} to ${nextVideoIndex}`);
    
    // Fade to black
    setFadeOpacity(1);
    
    setTimeout(() => {
      // Switch video while black
      video.src = nextSrc;
      video.muted = true;
      video.volume = 0;
      video.load();
      
      const playPromise = video.play();
      if (playPromise && (playPromise as any).catch) {
        (playPromise as Promise<void>).catch(() => {});
      }
      
      console.log('🎬 New video loaded, fading back in');
      // Fade back in
      setTimeout(() => {
        setFadeOpacity(0);
      }, 100);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        className="w-full h-full object-cover"
        style={{ transform: 'scale(1.0)' }}
      />
      {/* Fade-to-black transition overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: fadeOpacity }}
      />
      {/* Black frosting overlay for depth */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};
