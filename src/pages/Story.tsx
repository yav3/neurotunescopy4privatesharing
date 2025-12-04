import { useState, useRef } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { StoryIntro } from "@/components/StoryIntro";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Heart, Zap, Moon, Shield, Activity, Hospital, Plane, Building2 } from "lucide-react";

export const Story = () => {
  const [showIntro, setShowIntro] = useState(true);
  const benefitsRef = useRef<HTMLDivElement>(null);

  const benefits = [
    { icon: Brain, label: "Focus" },
    { icon: Heart, label: "Calm" },
    { icon: Zap, label: "Energy" },
    { icon: Moon, label: "Sleep" },
    { icon: Shield, label: "Pain Relief" },
    { icon: Activity, label: "Recovery" },
  ];

  const testimonials = [
    {
      quote: "The music was amazing. I expected 'therapeutic music' to sound boring. It didn't. I'll use the 'energise' songs when I work out.",
      name: "Matt",
      age: 28,
      location: "Poland"
    },
    {
      quote: "I didn't realise music could help my migraines. I was honestly shocked by how much relief I felt.",
      name: "Aneta",
      age: 51,
      location: "UK"
    },
    {
      quote: "I keep the focus tracks on in the background while I work. I get more done and I stay with it longer.",
      name: "Chris",
      age: 59,
      location: "USA"
    },
    {
      quote: "My mother-in-law has had severe anxiety. After just one session, she finally relaxed enough to sleep and eat.",
      name: "Josh",
      age: 58,
      location: "USA"
    },
  ];

  const scrollBenefits = (direction: 'left' | 'right') => {
    if (benefitsRef.current) {
      benefitsRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      {showIntro && <StoryIntro onComplete={() => setShowIntro(false)} />}
      
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-24 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ color: '#e4e4e4' }}>
              Music & AI For Better Brain Health
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto mb-4" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Medical-grade music, personalized by AI
            </p>
            <p className="text-base font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              NeuralPositive develops software that turns music into treatment. Our patent portfolio covers 
              how therapeutic music is created and personalized for clinical use.
            </p>
          </div>

          {/* About NeuroTunes */}
          <section className="mb-16">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                NeuroTunes, our flagship app, delivers purpose-composed sessions that adapt to each user. 
                The team behind it includes neuroscientists, physician-scientists, developers, composers, 
                and a 5x Grammy winning engineer.
              </p>
              <p className="leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                We began at Cornell Tech's Jacobs Technion–Cornell Institute and have built on more than 
                eight years of sponsored research.
              </p>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-6 text-center" style={{ color: '#e4e4e4' }}>
              Made For Real Benefits
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              Our patented, closed loop personalization adapts playlists to each user's needs and preferences
            </p>
            
            <div className="relative">
              <button
                onClick={() => scrollBenefits('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(192, 192, 192, 0.3)' }}
              >
                <ChevronLeft className="w-4 h-4" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
              </button>
              
              <div
                ref={benefitsRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-24 text-center"
                      style={{ scrollSnapAlign: 'start' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div 
                        className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-2"
                        style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                      >
                        <Icon className="w-7 h-7" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(228, 228, 228, 0.7)' }}>{benefit.label}</span>
                    </motion.div>
                  );
                })}
              </div>
              
              <button
                onClick={() => scrollBenefits('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(192, 192, 192, 0.3)' }}
              >
                <ChevronRight className="w-4 h-4" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
              </button>
            </div>
          </section>

          {/* The Right Music */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-4 text-center" style={{ color: '#e4e4e4' }}>
              The right music at the right time
            </h2>
            <p className="text-sm text-center max-w-2xl mx-auto mb-8" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              From stress to pain to low energy, NeuroTunes selects and adapts from a library of 8,500+ 
              purpose-composed tracks to help you get what you need, when you need it: Medical grade music 
              with effortless benefits and no drug side effects.
            </p>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="p-5 rounded-2xl"
                  style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <p className="text-sm italic mb-3 leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.70)' }}>
                    "{testimonial.quote}"
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(6, 182, 212, 0.8)' }}>
                    {testimonial.name}, {testimonial.age} - {testimonial.location}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Evidence Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-4 text-center" style={{ color: '#e4e4e4' }}>
              Evidence-based and clinically tested
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              NeuralPositive is built on scientific rigor, not guesswork.
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-base font-light mb-2" style={{ color: '#e4e4e4' }}>Grounded in research</h3>
                <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Our platform combines advanced AI with insights from more than 15,000 publications on music and neuroscience.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-base font-light mb-2" style={{ color: '#e4e4e4' }}>Real-world pilots</h3>
                <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Clinical deployments in healthcare settings with measurable outcomes tracking.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-base font-light mb-2" style={{ color: '#e4e4e4' }}>Clinical results</h3>
                <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Pilot studies demonstrate statistically significant anxiety reductions (p&lt;.05) and user-reported improvements in focus and pain relief.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-base font-light mb-2" style={{ color: '#e4e4e4' }}>Healthcare-grade safety and privacy</h3>
                <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  HIPAA-ready, data encrypted, role-based access. No PII collected in sessions.
                </p>
              </div>
            </div>
          </section>

          {/* Real-World Deployment */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#e4e4e4' }}>
              Real-World Deployment
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Hospital className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Healthcare Systems</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Waiting rooms, common areas, pre- and post-procedure support, bedside use, 
                  remote at-home care, elder care settings, staff resilience. Non-pharmacologic, 
                  low effort for staff, safe and secure.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Plane className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Enterprise & Performance</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Airlines, hotels, spas, peak performance programs, and employee benefit offerings. 
                  On-demand stress relief, focus support, and recovery as a premium service — 
                  no medication and no extra hardware.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Building2 className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Technology Partners</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Licensed or embedded into existing digital platforms. Our 8,500+ purpose-composed 
                  therapeutic tracks and closed-loop dosing engine plug directly into your product 
                  to enhance outcomes and retention.
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#e4e4e4' }}>
              Meet the Team
            </h2>
            
            <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Neuralpositive is a deep tech AI company that spun out of the Runway Postdoctoral Program 
                of the Jacobs Technion Institute at Cornell Tech.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Neuroscientists, physicians, AI engineers (including ex-Spotify architect/inventor), composers, 
                and a 5× Grammy-winning sound lead. Proven leadership, ready to deploy and deliver calmer care 
                and measurable relief for patients.
              </p>
              <p className="text-sm" style={{ color: 'rgba(6, 182, 212, 0.9)' }}>
                Founding team with combined total of more than $500M in exits through M&amp;A and IPO.
              </p>
            </div>

            <p className="text-center text-xs" style={{ color: 'rgba(228, 228, 228, 0.50)' }}>
              With generous support from Cornell University, Jacobs Technion-Cornell Institute, 
              Weill Cornell Medicine, and Stanford School of Medicine
            </p>
          </section>

        </div>
      </main>

        <Footer />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Story;
