import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Play, Pause, Brain, Heart, Moon, Zap, Wind, Smile } from "lucide-react";
import { useAudioStore } from "@/stores";
import { TherapeuticSessionsCarousel } from "@/components/demo/TherapeuticSessionsCarousel";

interface TherapeuticSession {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: any;
  benefits: string[];
  sampleTrack: {
    title: string;
    artist: string;
    duration: string;
    url: string;
  };
}

const therapeuticSessions: TherapeuticSession[] = [
  {
    id: "focus",
    title: "Enhanced Focus",
    description: "Boost concentration and mental clarity",
    longDescription: "Our focus-enhancing compositions use specific frequencies and rhythmic patterns proven to increase attention span and cognitive performance. Perfect for work, study, or any task requiring sustained concentration.",
    icon: Brain,
    benefits: [
      "Improved concentration and attention span",
      "Enhanced cognitive performance",
      "Reduced mental fatigue",
      "Better task completion rates"
    ],
    sampleTrack: {
      title: "Deep Focus Flow",
      artist: "NeuroTunes",
      duration: "15:00",
      url: "neurotunes-audio-focus/Deep_Focus_Alpha_Waves.mp3"
    }
  },
  {
    id: "stress-relief",
    title: "Stress Relief",
    description: "Release tension and find calm",
    longDescription: "Scientifically designed to lower cortisol levels and activate your parasympathetic nervous system. These compositions help you transition from stress to serenity through carefully crafted harmonics.",
    icon: Heart,
    benefits: [
      "Reduced cortisol levels",
      "Lower blood pressure and heart rate",
      "Decreased muscle tension",
      "Improved emotional regulation"
    ],
    sampleTrack: {
      title: "Calm Waters",
      artist: "NeuroTunes",
      duration: "12:30",
      url: "neurotunes-audio-stress/Stress_Relief_Ambient.mp3"
    }
  },
  {
    id: "rest",
    title: "Deep Rest",
    description: "Achieve restorative rest",
    longDescription: "Experience sleep-inducing delta wave frequencies combined with gentle melodies that guide your brain into deep, restorative sleep states. Improve both sleep quality and duration naturally.",
    icon: Moon,
    benefits: [
      "Faster sleep onset",
      "Longer deep sleep phases",
      "Reduced nighttime awakenings",
      "More refreshed mornings"
    ],
    sampleTrack: {
      title: "Dreamscape Journey",
      artist: "NeuroTunes",
      duration: "20:00",
      url: "neurotunes-audio-sleep/Deep_Sleep_Delta.mp3"
    }
  },
  {
    id: "mood-boost",
    title: "Mood Boost",
    description: "Revitalize mind and body",
    longDescription: "Energizing compositions featuring uplifting rhythms and stimulating frequencies that naturally boost alertness and motivation without artificial stimulants.",
    icon: Zap,
    benefits: [
      "Increased alertness and vitality",
      "Enhanced motivation",
      "Improved physical energy",
      "Better mood and outlook"
    ],
    sampleTrack: {
      title: "Morning Energizer",
      artist: "NeuroTunes",
      duration: "10:00",
      url: "neurotunes-audio-energy/Energy_Boost_Upbeat.mp3"
    }
  },
  {
    id: "meditation",
    title: "Meditation Support",
    description: "Deepen your practice",
    longDescription: "Theta wave compositions designed to facilitate deeper meditative states and enhance mindfulness practice. Perfect for both beginners and experienced meditators.",
    icon: Wind,
    benefits: [
      "Easier access to meditative states",
      "Enhanced mindfulness",
      "Improved mental clarity",
      "Deeper spiritual connection"
    ],
    sampleTrack: {
      title: "Zen Garden",
      artist: "NeuroTunes",
      duration: "18:00",
      url: "neurotunes-audio-meditation/Meditation_Theta_Waves.mp3"
    }
  },
  {
    id: "mood",
    title: "Mood Elevation",
    description: "Uplift your emotional state",
    longDescription: "Carefully composed music that stimulates positive neurotransmitter release, helping to naturally elevate mood and emotional well-being throughout your day.",
    icon: Smile,
    benefits: [
      "Increased positive emotions",
      "Reduced symptoms of low mood",
      "Enhanced emotional resilience",
      "Improved overall well-being"
    ],
    sampleTrack: {
      title: "Sunshine Serenade",
      artist: "NeuroTunes",
      duration: "14:00",
      url: "neurotunes-audio-mood/Mood_Elevation_Uplifting.mp3"
    }
  }
];

const Demo = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { playTrack, pause, currentTrack, isPlaying } = useAudioStore();

  // Convert MM:SS duration string to seconds
  const durationToSeconds = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const handlePlayPause = async (session: TherapeuticSession) => {
    const isCurrentlyPlaying = playingId === session.id && isPlaying;
    
    if (isCurrentlyPlaying) {
      pause();
      setPlayingId(null);
    } else {
      const track = {
        id: session.id,
        title: session.sampleTrack.title,
        artist: session.sampleTrack.artist,
        album_art_url: '',
        stream_url: session.sampleTrack.url,
        src: session.sampleTrack.url,
        duration: durationToSeconds(session.sampleTrack.duration),
        goal: session.id,
      };
      await playTrack(track);
      setPlayingId(session.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">Experience NeuroTunes</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our therapeutic music sessions. Each track is scientifically designed to support specific cognitive and emotional states.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Sessions */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Therapeutic Sessions</h2>
        <TherapeuticSessionsCarousel 
          sessions={therapeuticSessions}
          playingId={playingId}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your well-being?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with NeuroTunes and experience the power of therapeutic music with no licensing fees or restrictions.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
