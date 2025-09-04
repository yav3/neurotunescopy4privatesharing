import React from 'react';

interface SoundCloudFallbackProps {
  goal: string;
}

export default function SoundCloudFallback({ goal }: SoundCloudFallbackProps) {
  if (goal !== 'mood-boost' && goal !== 'mood_boost' && goal !== 'energy-boost') {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-b from-background to-secondary/20 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Mood Boost Backup</h2>
        <p className="text-muted-foreground">
          Our curated mood boost playlist from SoundCloud
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <iframe 
          width="100%" 
          height="300" 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2076063783&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          className="rounded-lg"
        />
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <a 
            href="https://soundcloud.com/dr-yasmine-van-wilt-frsa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            neural+
          </a>
          {' · '}
          <a 
            href="https://soundcloud.com/dr-yasmine-van-wilt-frsa/sets/mood-boost-energy-boost" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Mood Boost & Energy Boost
          </a>
        </div>
      </div>
    </div>
  );
}