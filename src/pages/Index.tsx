import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { LandingPagePlayer } from '@/components/LandingPagePlayer';
import { LandingPageControls } from '@/components/LandingPageControls';
import { CinematicTextOverlay } from '@/components/CinematicTextOverlay';

const Index = () => {
  useWelcomeMessage();
  
  const [isPlaying, setIsPlaying] = useState(false); // Wait for cinematic intro to complete
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [overlayComplete, setOverlayComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync mute state with header
  useEffect(() => {
    const handleHeaderMuteToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
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

  const handlePlaySession = () => {
    // CRITICAL: Stop ALL audio on the page before starting main playback
    // First try the graceful stop
    if ((window as any).__stopIntroAudio) {
      (window as any).__stopIntroAudio();
    }
    
    // Then kill any remaining audio elements
    document.querySelectorAll('audio').forEach((audio) => {
      audio.pause();
      audio.src = '';
      audio.volume = 0;
    });
    
    // Clear the global reference
    if ((window as any).__introAudio) {
      const introAudio = (window as any).__introAudio;
      introAudio.pause();
      introAudio.src = '';
      ;(window as any).__introAudio = null;
    }
    
    // Start crossfade transition
    setIsTransitioning(true);
    setIsPlaying(true);
    
    // After crossfade completes, hide hero
    setTimeout(() => {
      setShowHero(false);
      setIsTransitioning(false);
    }, 1000);
  };

  // Stop intro audio when user mutes
  const handleMuteToggle = () => {
    if (!isMuted && (window as any).__stopIntroAudio) {
      (window as any).__stopIntroAudio();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Full-screen video background, synced to audio - only show AFTER user clicks play */}
      {!showHero && (
        <BackgroundVideoCarousel
          playbackRate={videoPlaybackRate}
          currentVideoIndex={currentVideoIndex}
          isPlaying={isPlaying}
        />
      )}

      {/* Landing Page Audio Player - only mount after overlay completes to prevent audio overlap */}
      {overlayComplete && (
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
      
      {/* Cinematic Text Overlay - only show when hero is visible */}
      {showHero && !overlayComplete && <CinematicTextOverlay onComplete={() => setOverlayComplete(true)} />}
      
      {/* Hero Section - Play Button on pure black background */}
      {showHero && overlayComplete && (
        <div 
          className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="pointer-events-auto flex flex-col items-center">
            {/* Subtle Glass Play Button - Smaller sizing */}
            <button
              onClick={handlePlaySession}
              disabled={isTransitioning}
              className="group transition-all duration-500 hover:scale-105 active:scale-100 relative disabled:pointer-events-none w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] md:w-[88px] md:h-[88px]"
            >
              {/* Subtle glow */}
              <div className="absolute inset-[-8px] rounded-full bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glass circle background */}
              <div 
                className="absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-500"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
              
              <svg viewBox="0 0 200 200" fill="none" className="relative z-10 transition-all duration-300 w-full h-full">
                <circle 
                  cx="100" cy="100" r="97" 
                  fill="none" 
                  stroke="rgba(192,192,192,0.3)" 
                  strokeWidth="1.5" 
                  className="group-hover:stroke-white/50 transition-all duration-300" 
                />
                <path 
                  d="M82 60v80l64-40z" 
                  fill="rgba(192,192,192,0.6)" 
                  className="group-hover:fill-white/80 transition-colors duration-300"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Spacer for layout */}
      <div className="flex-1" />
      
      {/* Landing Page Controls - show during transition (fade in) or when hero is hidden */}
      {(isTransitioning || !showHero) && (
        <div 
          className="transition-opacity duration-1000"
          style={{ 
            opacity: showHero ? 0 : 1,
            animation: isTransitioning ? 'fadeIn 1s ease-out forwards' : undefined
          }}
        >
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
        </div>
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
