import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// These must match the video filenames in CURATED_PLAYLIST from LandingPagePlayer
const CURATED_VIDEO_FILES = [
  '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4', // Spartan New Age
  '19700121_0258_6923840584fc8191a6b2658f4caceac4.mp4', // Can we cross the line
  '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',       // Expanding universe
  '20251122_0450_01kanf03azfr5b3gy0328zj5j8.mp4',       // Samba / bossa
  '20251123_1505_01kakyxn2mfma8jw0q7bjwax6x.mp4',       // DJ CHRIS vs EDward
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

  // Build public URLs for the curated video files
  useEffect(() => {
    const urls = CURATED_VIDEO_FILES.map((filename) =>
      supabase.storage.from('landingpage').getPublicUrl(filename).data
        .publicUrl,
    );
    setVideoUrls(urls);
  }, []);

  // Load/change the video source when the index changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoUrls.length === 0) return;

    const safeIndex =
      ((currentVideoIndex % videoUrls.length) + videoUrls.length) %
      videoUrls.length;
    const nextSrc = videoUrls[safeIndex];

    if (video.src !== nextSrc) {
      video.src = nextSrc;
      video.load();
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise && (playPromise as any).catch) {
          (playPromise as Promise<void>).catch(() => {
            // Autoplay might be blocked; user play will retry
          });
        }
      }
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

  // Sync video time to the active audio element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame: number;

    const sync = () => {
      const audio = (window as any).__landingActiveAudio as
        | HTMLAudioElement
        | null;

      if (audio && !audio.paused) {
        const diff = Math.abs(video.currentTime - audio.currentTime);
        if (diff > 0.05) {
          video.currentTime = audio.currentTime;
        }
      }

      frame = requestAnimationFrame(sync);
    };

    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
};
