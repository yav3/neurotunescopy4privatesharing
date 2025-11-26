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
      
      {/* Hero Section with Buttons */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col gap-6 items-center pointer-events-auto">
            {/* Big Platinum Play Triangle */}
            <button
              onClick={handlePlaySession}
              className="transition-all hover:scale-110 group"
              style={{ 
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))'
              }}
            >
              <svg 
                width="120" 
                height="140" 
                viewBox="0 0 120 140" 
                fill="none"
                className="transition-all group-hover:brightness-110"
              >
                <defs>
                  <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
                    <stop offset="30%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
                  </linearGradient>
                  <radialGradient id="platinumRadial" cx="40%" cy="40%">
                    <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 0.8 }} />
                    <stop offset="50%" style={{ stopColor: '#d1d5db', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 0 }} />
                  </radialGradient>
                  <filter id="shine">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    <feComponentTransfer>
                      <feFuncA type="discrete" tableValues="0 1" />
                    </feComponentTransfer>
                  </filter>
                </defs>
                <path 
                  d="M 20 10 L 110 70 L 20 130 Z" 
                  fill="url(#platinumGradient)"
                  stroke="#6b7280"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
                  }}
                />
                {/* Radial highlight for metallic effect */}
                <path 
                  d="M 20 10 L 110 70 L 20 130 Z" 
                  fill="url(#platinumRadial)"
                />
                {/* Edge shine */}
                <path 
                  d="M 30 20 L 100 70 L 30 120 Z" 
                  fill="rgba(255, 255, 255, 0.15)"
                  style={{ mixBlendMode: 'overlay' }}
                />
              </svg>
            </button>
            
            {/* Pill-shaped Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className="px-16 py-5 rounded-full backdrop-blur-md transition-all hover:scale-105"
              style={{ 
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'rgba(228, 228, 228, 0.15)',
                border: '1px solid rgba(228, 228, 228, 0.4)',
                color: '#0f172a',
                fontSize: '20px',
                fontWeight: 400
              }}
            >
              Subscribe
            </button>
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
