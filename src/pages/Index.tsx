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
      
      {/* Cinematic Text Overlay - only show when hero is visible */}
      {showHero && <CinematicTextOverlay />}
      
      {/* Hero Section - Play Button with CTAs */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-8">
            {/* Value Proposition Tagline */}
            <div className="text-center mb-4">
              <p className="text-[#e4e4e4]/80 text-lg tracking-wide" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Clinically validated • 110+ biomarkers • Personalized therapeutics
              </p>
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlaySession}
              className="group transition-all duration-300 hover:scale-110 active:scale-105 relative"
              style={{
                filter: 'drop-shadow(0 20px 50px rgba(192, 192, 192, 0.6))'
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="transition-all duration-300 group-hover:drop-shadow-[0_0_60px_rgba(192,192,192,1)] group-active:drop-shadow-[0_0_80px_rgba(192,192,192,1)]">
                <circle cx="90" cy="90" r="87" fill="none" stroke="#c0c0c0" strokeWidth="2.5" opacity="0.5" className="group-hover:opacity-100 transition-opacity duration-300" />
                <path d="M70 50v80l65-40z" fill="none" stroke="#c0c0c0" strokeWidth="4" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
            </button>
            
            {/* Primary CTA */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#c0c0c0] text-2xl tracking-wide" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Experience Now
              </span>
              <span className="text-[#e4e4e4]/60 text-sm tracking-wider" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Preview the Experience
              </span>
            </div>

            {/* Subscribe CTA with Value Prop */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <span className="text-[#e4e4e4]/60 text-sm tracking-wider" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Start your therapeutic journey
              </span>
              <button
                onClick={handleSubscribe}
                className="px-8 py-3 rounded-full bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 text-[#c0c0c0] hover:bg-[#c0c0c0]/20 hover:border-[#c0c0c0]/50 transition-all backdrop-blur-sm"
                style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}
              >
                Subscribe
              </button>
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
    </div>
  );
};

export default Index;
