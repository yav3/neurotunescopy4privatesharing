import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import obsidianLiquid from '@/assets/obsidian-liquid-1.png';

interface SessionData {
  id: string;
  title: string;
  description: string;
  coverArtUrl: string;
  previewUrl?: string;
  bucketName: string;
  benefits: string[];
}

// Mock data for initial display - will be replaced with real Supabase data
const MOCK_SESSIONS: SessionData[] = [
  {
    id: "stress-relief",
    title: "Stress Relief",
    description: "Scientifically designed to lower cortisol levels and support parasympathetic recovery through theta-wave frequencies.",
    coverArtUrl: "/placeholder.svg",
    bucketName: "meditation",
    benefits: ["Reduced stress and anxiety", "Easier emotional regulation", "More stable mood"],
  },
  {
    id: "deep-sleep",
    title: "Deep Sleep",
    description: "Delta-wave inspired frequencies and gentle melodic architecture for deeper, restorative sleep cycles.",
    coverArtUrl: "/placeholder.svg",
    bucketName: "gentleclassicalforpain",
    benefits: ["Faster sleep onset", "Deeper REM cycles", "Improved morning clarity"],
  },
  {
    id: "natural-energy",
    title: "Natural Energy",
    description: "Energizing compositions with uplifting rhythms and activating spectral patterns to boost cognitive performance.",
    coverArtUrl: "/placeholder.svg",
    bucketName: "ENERGYBOOST",
    benefits: ["Increased motivation", "Sustained cognitive energy", "Reduced fatigue"],
  },
  {
    id: "meditation",
    title: "Meditation Support",
    description: "Theta-focused soundscapes to support deeper meditative states and mindful presence through binaural entrainment.",
    coverArtUrl: "/placeholder.svg",
    bucketName: "NewAgeandWorldFocus",
    benefits: ["Easier entry into meditation", "Improved focus", "Greater sense of calm"],
  },
];

export default function FeaturedSessions() {
  const [sessions, setSessions] = useState<SessionData[]>(MOCK_SESSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      // TODO: Replace with actual Supabase view query when playlists_index is created
      // const { data, error } = await supabase
      //   .from("playlists_index")
      //   .select("*");
      // if (!error && data) {
      //   setSessions(data);
      // }
      
      // For now, use mock data
      setSessions(MOCK_SESSIONS);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Obsidian liquid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${obsidianLiquid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Radial gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 
            className="text-5xl lg:text-6xl font-light mb-6"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.15)',
            }}
          >
            Featured Therapeutic Sessions
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.65)' }}
          >
            Scientifically engineered audio experiences for wellbeing & performance
          </p>
        </motion.div>

        {/* Session Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Chrome glow border effect */}
              <div 
                className="absolute -inset-[1px] rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                }}
              />
              
              {/* Card container */}
              <div 
                className="relative rounded-[28px] overflow-hidden backdrop-blur-2xl h-full"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(255, 255, 255, 0.02)',
                }}
              >
                <div className="p-6 flex flex-col h-full">
                  
                  {/* Cover art */}
                  <div 
                    className="relative rounded-2xl mb-5 overflow-hidden"
                    style={{
                      height: '200px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={session.coverArtUrl}
                      alt={session.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    
                    {/* Subtle overlay gradient */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h2 
                    className="text-2xl font-light mb-3"
                    style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                  >
                    {session.title}
                  </h2>

                  {/* Description */}
                  <p 
                    className="text-sm mb-4 flex-grow"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.55)',
                      lineHeight: '1.6',
                    }}
                  >
                    {session.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-4">
                    {session.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div 
                          className="mt-[6px] rounded-full"
                          style={{
                            width: '4px',
                            height: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                        <span 
                          className="text-xs"
                          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Audio preview (placeholder for now) */}
                  {session.previewUrl && (
                    <audio
                      controls
                      className="w-full mt-auto"
                      style={{
                        height: '36px',
                        filter: 'invert(1) hue-rotate(180deg)',
                      }}
                    >
                      <source src={session.previewUrl} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="inline-block rounded-[32px] p-12 backdrop-blur-2xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <h2 
              className="text-4xl font-light mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              Ready to transform your wellbeing?
            </h2>
            <p 
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Get started with NeuroTunes and experience the power of medical-grade
              therapeutic music with no additional licensing fees or restrictions.
            </p>
            <button 
              className="px-10 py-4 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              Explore Music Sessions
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
