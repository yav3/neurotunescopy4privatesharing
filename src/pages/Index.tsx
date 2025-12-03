import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
    navigate('/products');
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
          <div className="pointer-events-auto flex flex-col items-center gap-4 sm:gap-6">
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

            {/* Action buttons row - perfectly centered beneath play button */}
            <div className="flex items-center justify-center gap-3 mt-2">
              {/* Subscribe CTA */}
              <button
                onClick={handleSubscribe}
                disabled={isTransitioning}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#c0c0c0]/08 border border-[#c0c0c0]/20 text-[#c0c0c0]/80 hover:bg-[#c0c0c0]/15 hover:border-[#c0c0c0]/40 hover:text-[#c0c0c0] transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm disabled:pointer-events-none"
                style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}
              >
                Subscribe
              </button>

              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c0c0c0]/08 border border-[#c0c0c0]/20 text-[#c0c0c0]/60 hover:bg-[#c0c0c0]/15 hover:border-[#c0c0c0]/40 hover:text-[#c0c0c0] transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                )}
              </button>
            </div>
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
