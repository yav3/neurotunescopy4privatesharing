import React, { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { LandingPagePlayer } from '@/components/LandingPagePlayer';
import { LandingPageControls } from '@/components/LandingPageControls';
import { SupportChat } from '@/components/SupportChat';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string; artworkUrl?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Start music immediately on landing — no intro, no delay
  useEffect(() => {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const handleHeaderMuteToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
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

  return (
    <div
      className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col"
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
        isPlaying={isPlaying}
      />

      <LandingPagePlayer
        onPlaybackStateChange={setIsPlaying}
        onCurrentTrackChange={(track) => setCurrentTrack(track)}
        onVideoPlaybackRateChange={setVideoPlaybackRate}
        onVideoChange={setCurrentVideoIndex}
        isPlaying={isPlaying}
        isMuted={isMuted}
      />

      <NavigationHeader />

      <div className="flex-1" />

      <LandingPageControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        isSpatialAudio={isSpatialAudio}
        currentTrack={currentTrack}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSkip={handleSkip}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleSpatial={() => setIsSpatialAudio(!isSpatialAudio)}
      />

      <SupportChat buttonText="Chat Support" nextToPlayer />

      <div className="hidden"><Footer /></div>
    </div>
  );
};

export default Index;
