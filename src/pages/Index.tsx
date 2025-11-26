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

const Index = () => {
  useWelcomeMessage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; genre: string; artist?: string; therapeuticGoal?: string } | null>(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showHero, setShowHero] = useState(true);

  const handleSkip = () => {
    if ((window as any).__skipLandingTrack) {
      (window as any).__skipLandingTrack();
    }
  };

  const handlePlaySession = () => {
    setShowHero(false);
    setIsPlaying(true);
  };

  const handleSubscribe = () => {
    setShowHero(false);
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Full-screen video background, synced to audio */}
      <BackgroundVideoCarousel
        playbackRate={videoPlaybackRate}
        currentVideoIndex={currentVideoIndex}
        isPlaying={isPlaying}
      />

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
      
      {/* Hero Section with Card - Inspired by Reference */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div 
            className="pointer-events-auto relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(10, 10, 10, 0.75) 50%, rgba(0, 0, 0, 0.75) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {/* Free Trial Badge */}
            <div 
              className="absolute top-6 right-6 px-4 py-2 rounded-full text-xs tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#1a1a1a',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
              Free Trial
            </div>

            {/* Card Content */}
            <div className="p-16 flex flex-col items-center text-center">
              <h1 className="text-5xl tracking-tight mb-4" style={{ fontWeight: 400, color: '#1a1a1a' }}>
                +NeuroTunes
              </h1>
              <p className="text-sm mb-2 max-w-lg leading-relaxed" style={{ color: '#2a2a2a' }}>
                Neuroscience-backed · Clinically Validated
              </p>
              <p className="text-sm mb-12 max-w-lg leading-relaxed" style={{ color: '#2a2a2a' }}>
                Music & AI Streaming
              </p>

              {/* Play Button and Text */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handlePlaySession}
                  className="transition-all hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6))'
                  }}
                >
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    <path d="M32 20v56l44-28z" fill="#1a1a1a" />
                  </svg>
                </button>
                <span className="text-lg tracking-wide" style={{ color: '#1a1a1a', fontWeight: 400 }}>
                  Listen Now
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer for layout */}
      <div className="flex-1" />
      
      {/* Landing Page Controls - only show when hero is hidden */}
      {!showHero && (
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
      )}
      
      {/* Footer */}
      <Footer />
      
      {/* Hidden Sales Assistant (triggered from header) */}
      <SalesAssistant externalOpen={false} />
      
      {/* Support Chat */}
      <SupportChat />
    </div>
  );
};

export default Index;
