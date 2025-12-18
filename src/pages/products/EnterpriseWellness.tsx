import { useState, useRef } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, Brain, TrendingUp, Users, Building2, GraduationCap, ArrowRight, ChevronLeft, ChevronRight, Trophy, Wrench, Heart, Zap, Moon, Shield, Activity } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";
import { Link } from "react-router-dom";

export default function EnterpriseWellness() {
  const [contactOpen, setContactOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const targetMarkets = [
    {
      title: "Corporate Offices",
      icon: Building2,
      description: "Enterprises seeking employee wellness and focus solutions",
    },
    {
      title: "Sports Teams",
      icon: Trophy,
      description: "Pre-game focus, recovery sessions, and mental performance support",
    },
    {
      title: "Engineering Teams",
      icon: Wrench,
      description: "Deep work support for complex problem-solving and sustained concentration",
    },
    {
      title: "Universities & Academic Institutions",
      icon: GraduationCap,
      description: "Student wellness programs and faculty stress management",
    },
    {
      title: "Government Offices",
      icon: Briefcase,
      description: "Public sector organizations improving employee well-being",
    },
    {
      title: "Tech Companies & Startups",
      icon: Brain,
      description: "Fast-paced environments with high cognitive demands",
    },
  ];

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

        {/* Hero */}
        <section className="relative pt-16 pb-8 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              className="text-3xl lg:text-4xl font-light mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Music & AI For Better Brain Health
            </motion.h1>

            <motion.p 
              className="text-lg font-light leading-relaxed max-w-3xl mx-auto mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.75)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Medical-grade music, personalized by AI
            </motion.p>

            <motion.p 
              className="text-base font-light leading-relaxed max-w-3xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.60)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              NeuralPositive develops software that turns music into treatment. Our patent portfolio covers 
              how therapeutic music is created and personalized for clinical use.
            </motion.p>
          </div>
        </section>

        {/* Free Trial CTA - Moved to top */}
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
                  Ready to transform your workplace?
                </h2>

                <p 
                  className="text-base mb-8 max-w-2xl mx-auto"
                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                  Reach out to discuss pricing and see the impact on your team's wellness
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/products/enterprise-wellness/trial"
                    className="group relative px-10 py-4 rounded-full text-lg transition-all duration-300"
                    style={{
                      background: '#000000',
                      color: '#c0c0c0',
                      border: '1px solid rgba(192, 192, 192, 0.3)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
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
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  
                  <button
                    onClick={() => setContactOpen(true)}
                    className="px-10 py-4 rounded-full text-lg transition-all duration-300"
                    style={{
                      background: 'transparent',
                      color: '#c0c0c0',
                      border: '1px solid rgba(192, 192, 192, 0.2)',
                      fontWeight: 400,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                    }}
                  >
                    Contact Sales
                  </button>
                </div>
              </div>

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

        {/* About NeuroTunes */}
        <section className="relative py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                NeuroTunes, our flagship app, delivers purpose-composed sessions that adapt to each user. 
                The team behind it includes neuroscientists, physician-scientists, developers, composers, 
                and a 5x Grammy winning engineer.
              </p>
            </div>
          </div>
        </section>

        {/* Made For Real Benefits */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-light mb-6 text-center" style={{ color: '#e4e4e4' }}>
              Made For Real Benefits
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              Our patented, closed loop personalization adapts playlists to each user's needs and preferences
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="w-20 text-center"
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
          </div>
        </section>

        {/* The Right Music */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-light mb-4 text-center" style={{ color: '#e4e4e4' }}>
              The right music at the right time
            </h2>
            <p className="text-sm text-center max-w-2xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
              From stress to pain to low energy, NeuroTunes selects and adapts from a library of 8,500+ 
              purpose-composed tracks to help you get what you need, when you need it: Medical grade music 
              with effortless benefits and no drug side effects.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
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
          </div>
        </section>

        {/* Evidence Section */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
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
          </div>
        </section>

        {/* Target Markets */}
        <section className="relative py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              We Love to Serve
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {targetMarkets.map((market, index) => {
                const Icon = market.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-sm font-light mb-1"
                          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                        >
                          {market.title}
                        </h3>
                        <p 
                          className="text-xs leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.60)' }}
                        >
                          {market.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
        <FooterContactHandler
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          interestType="Enterprise Wellness - Sales Inquiry"
        />

        <style>{`
          @keyframes pulse-soft {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}