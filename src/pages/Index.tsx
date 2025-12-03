import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { SupportChat } from '@/components/SupportChat';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { LandingPagePlayer } from '@/components/LandingPagePlayer';
import { LandingPageControls } from '@/components/LandingPageControls';
import { CinematicTextOverlay } from '@/components/CinematicTextOverlay';

const Index = () => {
  useWelcomeMessage();
  
  const [isPlaying, setIsPlaying] = useState(true); // Start playing immediately for intro
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [overlayComplete, setOverlayComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSkip = () => {
    if ((window as any).__skipLandingTrack) {
      (window as any).__skipLandingTrack();
    }
  };

  const handlePlaySession = () => {
    // Start crossfade transition
    setIsTransitioning(true);
    setIsPlaying(true);
    
    // After crossfade completes, hide hero
    setTimeout(() => {
      setShowHero(false);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleSubscribe = () => {
    setShowHero(false);
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Full-screen video background, synced to audio - only show after overlay completes */}
      {overlayComplete && (
        <BackgroundVideoCarousel
          playbackRate={videoPlaybackRate}
          currentVideoIndex={currentVideoIndex}
          isPlaying={isPlaying}
        />
      )}

      {/* Landing Page Audio Player (drives audio + video state) */}
      <LandingPagePlayer
        onPlaybackStateChange={setIsPlaying}
        onCurrentTrackChange={(track) => setCurrentTrack(track)}
        onVideoPlaybackRateChange={setVideoPlaybackRate}
        onVideoChange={setCurrentVideoIndex}
        isPlaying={isPlaying}
        isMuted={isMuted}
      />
      
      {/* Header */}
      <NavigationHeader />
      
      {/* Cinematic Text Overlay - only show when hero is visible */}
      {showHero && !overlayComplete && <CinematicTextOverlay onComplete={() => setOverlayComplete(true)} />}
      
      {/* Hero Section - Play Button with CTAs - with crossfade transition */}
      {showHero && overlayComplete && (
        <div 
          className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="pointer-events-auto flex flex-col items-center gap-6 sm:gap-8 md:gap-12">
            {/* Glass Play Button - Responsive sizing */}
            <button
              onClick={handlePlaySession}
              disabled={isTransitioning}
              className="group transition-all duration-500 hover:scale-110 active:scale-105 relative disabled:pointer-events-none w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px]"
            >
              {/* Outer glow ring */}
              <div className="absolute inset-[-10px] sm:inset-[-15px] md:inset-[-20px] rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-xl sm:blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glass circle background */}
              <div 
                className="absolute inset-0 rounded-full backdrop-blur-md transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
                  boxShadow: `
                    0 0 40px rgba(192, 192, 192, 0.25),
                    inset 0 1px 1px rgba(255,255,255,0.3),
                    inset 0 -1px 1px rgba(0,0,0,0.2)
                  `,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              
              <svg viewBox="0 0 200 200" fill="none" className="relative z-10 transition-all duration-300 w-full h-full">
                {/* Outer ring with glass effect */}
                <circle 
                  cx="100" cy="100" r="97" 
                  fill="none" 
                  stroke="url(#glassGradient)" 
                  strokeWidth="2" 
                  className="group-hover:stroke-white/80 transition-all duration-300" 
                />
                {/* Inner highlight */}
                <circle 
                  cx="100" cy="100" r="90" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="1" 
                />
                {/* Play triangle with gradient */}
                <path 
                  d="M82 60v80l64-40z" 
                  fill="url(#playGradient)" 
                  className="group-hover:fill-white transition-colors duration-300"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
                />
                <defs>
                  <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="50%" stopColor="rgba(192,192,192,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                  </linearGradient>
                  <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="100%" stopColor="rgba(192,192,192,0.7)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            {/* Subscribe CTA */}
            <button
              onClick={handleSubscribe}
              disabled={isTransitioning}
              className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 text-[#c0c0c0] hover:bg-[#c0c0c0]/20 hover:border-[#c0c0c0]/50 hover:scale-105 active:scale-100 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base disabled:pointer-events-none"
              style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}
            >
              Subscribe
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
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleSpatial={() => setIsSpatialAudio(!isSpatialAudio)}
          />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
      
      {/* Hidden Sales Assistant (triggered from header) */}
      <SalesAssistant externalOpen={false} />
    </div>
  );
};

export default Index;
