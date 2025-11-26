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
          <div className="flex flex-col gap-6 pointer-events-auto">
            {/* Big Play Button */}
            <button
              onClick={handlePlaySession}
              className="w-32 h-32 rounded-full backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center group"
              style={{ 
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'rgba(228, 228, 228, 0.15)',
                border: '1px solid rgba(228, 228, 228, 0.4)'
              }}
            >
              <svg 
                className="w-12 h-12 ml-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                style={{ color: '#0f172a' }}
              >
                <path 
                  d="M5 3l14 9-14 9V3z" 
                  fill="currentColor"
                  strokeWidth="0"
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
