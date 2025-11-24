import React, { useState } from 'react';
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

  const handleSkip = () => {
    if ((window as any).__skipLandingTrack) {
      (window as any).__skipLandingTrack();
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Full-screen video background with BPM sync */}
      <BackgroundVideoCarousel 
        playbackRate={videoPlaybackRate}
        currentVideoIndex={currentVideoIndex}
        isLandingPagePlayerActive={true}
        additionalVideos={[
          '20251123_1513_01kanep60pf8mr4494225wy94z.mp4',
          '20251123_1513_01kanf03azfr5b3gy0328zj5j8.mp4',
          '20251123_1513_01kanfadzdfj8bw4v44zkkd7p6.mp4',
          '20251123_1513_01kanfhac2e0sabhsp8c9zp85w.mp4',
          '20251123_1514_01kasce44qefe9j5s49v6jkg0t.mp4',
          '20251123_1514_01kascfe9he71bcdzcw3wp3e2n.mp4',
          '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4'
        ]}
      />
      
      {/* Landing Page Audio Player */}
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
      
      {/* Single full-screen card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div 
          className="w-full h-full max-w-7xl backdrop-blur-3xl rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Card content goes here */}
        </div>
      </div>
      
      {/* Landing Page Controls */}
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
