import React, { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { LandingPagePlayer } from '@/components/LandingPagePlayer';
import { LandingPageControls } from '@/components/LandingPageControls';
import { fadeOutIntroSong } from '@/components/CinematicTextOverlay';
import { PremiumHero } from '@/components/landing/PremiumHero';

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string; artworkUrl?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.src = '';
    });
  }, []);

  useEffect(() => {
    const handleHeaderMuteToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
      const introAudio = (window as any).__introAudio as HTMLAudioElement | null;
      if (introAudio) introAudio.muted = e.detail.muted;
    };
    window.addEventListener('headerMuteToggle' as any, handleHeaderMuteToggle);
    return () => window.removeEventListener('headerMuteToggle' as any, handleHeaderMuteToggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('landingPlayerMuteChange', { detail: { muted: isMuted } }));
  }, [isMuted]);

  const handleSkip = () => {
    if ((window as any).__skipLandingTrack) (window as any).__skipLandingTrack();
  };

  const handleIntroComplete = () => {
    fadeOutIntroSong(200);
    const introVideo = (window as any).__introVideo as HTMLVideoElement | null;
    if (introVideo) introVideo.pause();
    setShowIntro(false);
    setIsPlaying(true);
  };

  const handleMuteToggle = () => {
    const introAudio = (window as any).__introAudio as HTMLAudioElement | null;
    if (introAudio) introAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(145deg, 
          hsl(200, 15%, 4%) 0%, 
          hsl(210, 12%, 6%) 40%,
          hsl(200, 10%, 5%) 100%
        )`
      }}
    >
      <BackgroundVideoCarousel
        playbackRate={videoPlaybackRate}
        currentVideoIndex={currentVideoIndex}
        isPlaying={!showIntro && isPlaying}
      />

      {!showIntro && (
        <LandingPagePlayer
          onPlaybackStateChange={setIsPlaying}
          onCurrentTrackChange={(track) => setCurrentTrack(track)}
          onVideoPlaybackRateChange={setVideoPlaybackRate}
          onVideoChange={setCurrentVideoIndex}
          isPlaying={isPlaying}
          isMuted={isMuted}
        />
      )}

      <NavigationHeader />

      {showIntro && <PremiumHero onComplete={handleIntroComplete} />}

      <div className="flex-1" />

      {!showIntro && (
        <LandingPageControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          isSpatialAudio={isSpatialAudio}
          currentTrack={currentTrack}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSkip={handleSkip}
          onToggleMute={handleMuteToggle}
          onToggleSpatial={() => setIsSpatialAudio(!isSpatialAudio)}
        />
      )}

      <div className="hidden"><Footer /></div>
      <SalesAssistant externalOpen={false} />
    </div>
  );
};

export default Demo;
