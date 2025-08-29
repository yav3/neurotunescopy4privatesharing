import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { usePlayer, currentTrack } from '@/stores/usePlayer';
import { getAudio } from '@/player/audio-core';

export const NowPlaying: React.FC = () => {
  const navigate = useNavigate();
  const { next, prev, isPlaying, setPlaying } = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const track = currentTrack();

  useEffect(() => {
    const audio = getAudio();
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const updateVolume = () => setVolume(audio.volume);
    const updatePlaying = () => setPlaying(!audio.paused);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('volumechange', updateVolume);
    audio.addEventListener('play', updatePlaying);
    audio.addEventListener('pause', updatePlaying);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('volumechange', updateVolume);
      audio.removeEventListener('play', updatePlaying);
      audio.removeEventListener('pause', updatePlaying);
    };
  }, [setPlaying]);

  const toggle = () => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().catch(console.warn);
    } else {
      audio.pause();
    }
  };

  const seek = (time: number) => {
    const audio = getAudio();
    audio.currentTime = time;
  };

  const handleVolumeChange = (vol: number) => {
    const audio = getAudio();
    audio.volume = vol;
  };

  if (!track) {
    return null;
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-40 rounded-none border-t bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-4 p-4">
        {/* Track Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate('/player')}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-xl">
              🧠
            </div>
            <div className="min-w-0">
              <h4 className="font-medium truncate">{track.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                THERAPEUTIC MUSIC
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prev}>
            <SkipBack size={16} />
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={toggle}
            className="w-10 h-10 rounded-full"
          >
            {isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={next}>
            <SkipForward size={16} />
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 0}
            step={0.1}
            onValueChange={([value]) => seek(value)}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-2 w-32">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => handleVolumeChange(value / 100)}
          />
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};