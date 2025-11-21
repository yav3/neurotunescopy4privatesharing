import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Brain, Heart, Moon, Zap, Wind, Smile } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(228, 228, 228, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(228, 228, 228, 0.06) 0%, transparent 50%)',
          }}
        />
      </div>

      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-32 pb-40">
        <div 
          className="max-w-5xl mx-auto backdrop-blur-3xl rounded-[40px] p-16 border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.10)',
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="text-center">
            <h1 
              className="text-[64px] md:text-[80px] font-light leading-[1.1] mb-10"
              style={{ color: 'rgba(228, 228, 228, 0.95)' }}
            >
              Experience NeuroTunes
            </h1>
            <p 
              className="text-[22px] md:text-[26px] font-extralight max-w-3xl mx-auto leading-relaxed mb-12"
              style={{ color: 'rgba(228, 228, 228, 0.70)' }}
            >
              Explore our therapeutic music sessions. Each track is scientifically designed to support specific cognitive and emotional states.
            </p>
            <Link to="/auth">
              <button
                className="px-10 py-4 rounded-2xl text-base font-medium transition-all hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: 'rgba(228, 228, 228, 0.90)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Sessions */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <div 
          className="backdrop-blur-2xl rounded-[40px] py-24 px-10 max-w-6xl mx-auto mb-20 border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.10)',
          }}
        >
          <h2 
            className="text-[56px] md:text-[64px] font-light leading-[1.1] text-center"
            style={{ color: 'rgba(228, 228, 228, 0.95)' }}
          >
            Featured Therapeutic Sessions
          </h2>
        </div>
        <TherapeuticSessionsCarousel 
          sessions={therapeuticSessions}
          playingId={playingId}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40">
        <div className="container mx-auto px-6">
          <div 
            className="max-w-5xl mx-auto backdrop-blur-3xl rounded-[40px] p-20 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 80px rgba(255, 255, 255, 0.08)',
            }}
          >
            <h2 
              className="text-[56px] md:text-[64px] font-light leading-[1.1] mb-10"
              style={{ color: 'rgba(228, 228, 228, 0.95)' }}
            >
              Ready to transform your well-being?
            </h2>
            <p 
              className="text-[20px] md:text-[24px] font-extralight max-w-3xl mx-auto leading-relaxed mb-14"
              style={{ color: 'rgba(228, 228, 228, 0.70)' }}
            >
              Get started with NeuroTunes and experience the power of therapeutic music with no licensing fees or restrictions.
            </p>
            <Link to="/auth">
              <button
                className="px-10 py-4 rounded-2xl text-base font-medium transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: 'rgba(228, 228, 228, 0.90)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
