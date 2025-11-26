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
import chromeTexture from '@/assets/chrome-texture.png';
import darkSparkleTexture from '@/assets/dark-sparkle-texture.png';

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
      
      {/* Hero Section with Buttons - Zoomed Out */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none scale-75">
          <div className="flex flex-col gap-8 items-center pointer-events-auto">
            {/* Big High-Gloss Obsidian Play Triangle */}
            <button
              onClick={handlePlaySession}
              className="transition-all hover:scale-110 group relative"
              style={{ 
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                filter: 'drop-shadow(0 12px 32px rgba(0, 0, 0, 0.8))'
              }}
            >
              <svg 
                width="180" 
                height="210" 
                viewBox="0 0 180 210" 
                fill="none"
                className="transition-all group-hover:brightness-125"
              >
                <defs>
                  <linearGradient id="obsidianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
                    <stop offset="30%" style={{ stopColor: '#2d2d2d', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#404040', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: '#2d2d2d', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
                  </linearGradient>
                  <radialGradient id="gloss" cx="40%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
                    <stop offset="30%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                  </radialGradient>
                </defs>
                {/* Base obsidian shape */}
                <path 
                  d="M 30 15 L 165 105 L 30 195 Z" 
                  fill="url(#obsidianGradient)"
                  stroke="#000000"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.9))'
                  }}
                />
                {/* High gloss highlight */}
                <path 
                  d="M 30 15 L 165 105 L 30 195 Z" 
                  fill="url(#gloss)"
                />
              </svg>
            </button>
            
            {/* Pill-shaped Subscribe Button with Layered Textures */}
            <button
              onClick={handleSubscribe}
              className="relative px-20 py-6 rounded-full transition-all hover:scale-105 overflow-hidden"
              style={{ 
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                border: '1px solid rgba(107, 114, 128, 0.5)',
                fontSize: '24px',
                fontWeight: 400
              }}
            >
              {/* Chrome texture base */}
              <div 
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage: `url(${chromeTexture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              {/* Dark sparkle overlay */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url(${darkSparkleTexture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mixBlendMode: 'multiply'
                }}
              />
              {/* Frosted glass for text readability */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
              />
              <span className="relative z-10 text-black">Subscribe</span>
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
