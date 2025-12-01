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
  
  const [isPlaying, setIsPlaying] = useState(false);
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
          <div className="pointer-events-auto flex flex-col items-center gap-16">
            {/* Play Button */}
            <button
              onClick={handlePlaySession}
              disabled={isTransitioning}
              className="group transition-all duration-300 hover:scale-110 active:scale-105 relative disabled:pointer-events-none"
              style={{
                filter: 'drop-shadow(0 20px 50px rgba(192, 192, 192, 0.6))'
              }}
            >
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="transition-all duration-300 group-hover:drop-shadow-[0_0_60px_rgba(192,192,192,1)] group-active:drop-shadow-[0_0_80px_rgba(192,192,192,1)]">
                <circle cx="100" cy="100" r="97" fill="none" stroke="#c0c0c0" strokeWidth="2.5" opacity="0.5" className="group-hover:opacity-100 transition-opacity duration-300" />
                <path d="M78 56v88l72-44z" fill="none" stroke="#c0c0c0" strokeWidth="4" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
            </button>
            
            {/* Experience Now Label */}
            <span className="text-[#c0c0c0] text-2xl tracking-wide" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
              Experience Now
            </span>

            {/* Subscribe CTA */}
            <button
              onClick={handleSubscribe}
              disabled={isTransitioning}
              className="px-10 py-3.5 rounded-full bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 text-[#c0c0c0] hover:bg-[#c0c0c0]/20 hover:border-[#c0c0c0]/50 hover:scale-105 active:scale-100 transition-all duration-300 backdrop-blur-sm text-base disabled:pointer-events-none"
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
