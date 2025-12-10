import { useState, useRef, useEffect } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Building2, ShoppingBag, Coffee, Dumbbell, Home, Users, Volume2, Clock, Shield, Cloud, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

export default function EnvironmentalBackground() {
  const background = usePageBackground();
  const [contactOpen, setContactOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play audio when video plays
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video && audio) {
      audio.loop = true;
      audio.volume = 0.6;
      
      const playAudio = () => {
        audio.play().catch(console.error);
      };
      
      video.addEventListener('play', playAudio);
      
      // Auto-play audio on mount if video is already playing
      if (!video.paused) {
        playAudio();
      }
      
      return () => {
        video.removeEventListener('play', playAudio);
        audio.pause();
      };
    }
  }, []);

  const useCases = [
    {
      title: "Hotels & hospitality",
      icon: Building2,
      description: "Create calming atmospheres for guests across lobbies, spas, and common areas",
    },
    {
      title: "Retail stores & shopping centers",
      icon: ShoppingBag,
      description: "Enhance customer experience and increase dwell time with therapeutic background music",
    },
    {
      title: "Restaurants & cafés",
      icon: Coffee,
      description: "Set the perfect ambiance for dining experiences that encourage return visits",
    },
    {
      title: "Gyms & fitness centers",
      icon: Dumbbell,
      description: "Motivate members with energizing, scientifically-optimized workout soundtracks",
    },
    {
      title: "Senior living facilities",
      icon: Home,
      description: "Support cognitive health and emotional well-being for residents",
    },
    {
      title: "Spas & wellness centers",
      icon: Users,
      description: "Deepen relaxation and therapeutic outcomes with clinical-grade audio",
    },
  ];

  const benefits = [
    {
      title: "Zero PRO licensing fees",
      icon: Shield,
      description: "No ASCAP, BMI, or SESAC costs. All music is owned and produced by NeuroPositive.",
    },
    {
      title: "Multi-room zone control",
      icon: Volume2,
      description: "Manage different therapeutic music programs across multiple spaces simultaneously",
    },
    {
      title: "Time-of-day programming",
      icon: Clock,
      description: "Automatically adjust music energy levels throughout the day to match natural rhythms",
    },
    {
      title: "Cloud-managed system",
      icon: Cloud,
      description: "Update playlists, monitor playback, and manage settings from anywhere",
    },
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white overflow-hidden relative">
      <div className="relative z-10">
        <NavigationHeader />

      {/* Condensed Hero - Minimal Padding */}
      <section className="relative pt-16 pb-2 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-3xl lg:text-4xl font-light mb-2"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Environmental & Background
          </motion.h1>

          <motion.p 
            className="text-sm lg:text-base mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.60)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            PRO-free environmental music for facilities, retail, hospitality, and public spaces
          </motion.p>
        </div>
      </section>

      {/* Commercial Video - Moved Up */}
      <section className="relative py-6 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(192, 192, 192, 0.2)',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
            >
              <source src="/videos/environmental-commercial.mp4" type="video/mp4" />
            </video>
            <audio ref={audioRef} src="/audio/oh-day-of-fire-and-sun.mp3" preload="auto" />
          </motion.div>
        </div>
      </section>

      {/* Environmental Music Overview */}
      <section className="relative py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
            <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
              NeuroTunes is a premium AI-guided environmental music streaming SaaS delivered as an app for desktop and native download. 
              It enables seamless control of numerous administrative accounts across a customizable, scalable number of locations and set-ups.
            </p>
            <p className="leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
              Each space an administrative user controls is designed to enhance the experience of those within it. Continuous play 
              with advanced schedule programming enables the delivery of music sessions that meet the specific needs of environments, taking 
              environmental factors, staff needs, community health, and visitor comfort into consideration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>The Science Behind It</h3>
              <p className="leading-relaxed text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Our streaming SaaS is a patented, evidence-based, and clinically-validated system that uses core principles from 
                music therapy, music cognition, and neuropsychiatry. All music has been purpose-composed using specific musical 
                patterns, frequencies, audio settings, and beats to support anxiety reduction and cognitive clarity.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>AI-Powered Scheduling</h3>
              <p className="leading-relaxed text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Our machine learning and AI technology pre-programs ideal music streaming playlists for specific times of day and 
                environmental needs. Administrative users can add notes and teach the playlists to improve through favoriting and 
                skipping, ensuring the right music plays at the right time and place.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl" style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
            <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Evidence-Based Principles</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
              <li className="flex items-start gap-3">
                <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                <span>Protocol design informed by thousands of publications across music therapy, music cognition, AI, machine learning, neuropsychiatry, neurology, and neuroscience</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                <span>Informed by the principles of music therapy—a field with decades of documented best practices—made scalable and on-demand through our streaming service</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                <span>Delivers benefits for members, visitors, patients, staff, and employees—reduced anxiety and improved focus</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits - Horizontal Carousel */}
      <section className="relative py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-2xl lg:text-3xl font-light mb-6 text-center"
            style={{ color: 'rgba(255, 255, 255, 0.90)' }}
          >
            Key Benefits
          </h2>

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(192, 192, 192, 0.3)',
              }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
            </button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-12 pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-72"
                    style={{ scrollSnapAlign: 'start' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div 
                      className="p-6 rounded-2xl backdrop-blur-xl h-full transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div 
                        className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                      </div>

                      <h3 
                        className="text-base font-light mb-2"
                        style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                      >
                        {benefit.title}
                      </h3>

                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(192, 192, 192, 0.3)',
              }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Prominent CTA */}
      <section className="relative py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="relative z-10 p-10 text-center">
              <h2 
                className="text-3xl lg:text-4xl font-light mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                Ready to transform your space?
              </h2>


              <button
                onClick={() => setContactOpen(true)}
                className="group relative px-12 py-5 rounded-full text-lg transition-all duration-300"
                style={{
                  background: '#000000',
                  color: '#c0c0c0',
                  border: '1px solid rgba(192, 192, 192, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.background = '#0a0a0a';
                  e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.3)';
                }}
              >
                <span className="flex items-center gap-2 justify-center">
                  Request Site Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Animated glow background */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%)',
                animation: 'pulse-soft 3s ease-in-out infinite',
              }}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
      <FooterContactHandler
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        interestType="Environmental & Background Music - Site Assessment"
      />

      <style>{`
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      </div>
    </div>
  );
}
