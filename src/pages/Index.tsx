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
      
      {/* Hero Section - Floating Elements */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-6">
            {/* Description Text Floating Element */}
            <div 
              className="rounded-2xl px-6 py-3 animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(0, 0, 0, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              <p className="text-sm leading-snug text-center" style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 400 }}>
                Neuroscience-backed · Clinically Validated
              </p>
            </div>

            {/* Music & AI Text Floating Element */}
            <div 
              className="rounded-2xl px-6 py-3 animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(0, 0, 0, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                animationDelay: '0.1s'
              }}
            >
              <p className="text-sm leading-snug text-center" style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 400 }}>
                Music & AI Streaming
              </p>
            </div>

            {/* Play Button Floating Element */}
            <div 
              className="rounded-2xl px-8 py-6 flex flex-col items-center gap-3 animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(0, 0, 0, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                animationDelay: '0.2s'
              }}
            >
              <button
                onClick={handlePlaySession}
                className="transition-all hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.8))'
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path d="M28 18v44l36-22z" fill="none" stroke="#c0c0c0" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-base tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 400 }}>
                Listen Now
              </span>
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
