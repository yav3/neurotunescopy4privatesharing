import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { LandingPagePlayer } from '@/components/LandingPagePlayer';
import { LandingPageControls } from '@/components/LandingPageControls';
import { CinematicTextOverlay, fadeOutIntroSong } from '@/components/CinematicTextOverlay';

const Index = () => {
  useWelcomeMessage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  // Sync mute state with header
  useEffect(() => {
    const handleHeaderMuteToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
      // Also mute/unmute intro audio if it exists
      const introAudio = (window as any).__introAudio as HTMLAudioElement | null;
      if (introAudio) {
        introAudio.muted = e.detail.muted;
      }
    };
    window.addEventListener('headerMuteToggle' as any, handleHeaderMuteToggle);
    return () => window.removeEventListener('headerMuteToggle' as any, handleHeaderMuteToggle);
  }, []);

  // Emit mute state changes to header
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('landingPlayerMuteChange', { detail: { muted: isMuted } }));
  }, [isMuted]);

  const handleSkip = () => {
    if ((window as any).__skipLandingTrack) {
      (window as any).__skipLandingTrack();
    }
  };

  // Auto-start experience when intro completes
  const handleIntroComplete = () => {
    // Fade out intro song quickly (200ms)
    fadeOutIntroSong(200);
    
    // Stop intro video
    const introVideo = (window as any).__introVideo as HTMLVideoElement | null;
    if (introVideo) {
      introVideo.pause();
    }
    
    // Hide intro and start playing
    setShowIntro(false);
    setIsPlaying(true);
  };

  // Mute/unmute intro audio when user toggles mute
  const handleMuteToggle = () => {
    const introAudio = (window as any).__introAudio as HTMLAudioElement | null;
    if (introAudio) {
      introAudio.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Full-screen video background - show after intro completes */}
      {!showIntro && (
        <BackgroundVideoCarousel
          playbackRate={videoPlaybackRate}
          currentVideoIndex={currentVideoIndex}
          isPlaying={isPlaying}
        />
      )}

      {/* Landing Page Audio Player - mount after intro completes */}
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
      
      {/* Header */}
      <NavigationHeader />
      
      {/* Cinematic Text Overlay - auto-transitions to experience */}
      {showIntro && <CinematicTextOverlay onComplete={handleIntroComplete} />}
      
      {/* Spacer for layout */}
      <div className="flex-1" />
      
      {/* Landing Page Controls - show after intro */}
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
      
      {/* Footer - hidden on landing page for full-screen experience */}
      <div className="hidden">
        <Footer />
      </div>
      
      {/* Hidden Sales Assistant (triggered from header) */}
      <SalesAssistant externalOpen={false} />
    </div>
  );
};

export default Index;
