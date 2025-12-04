import { useState, useRef } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Hospital, HeartPulse, Activity, Shield, BarChart3, Users, ArrowRight, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";

export default function PopulationHealth() {
  const [contactOpen, setContactOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const targetMarkets = [
    {
      title: "Hospital Systems",
      icon: Hospital,
      description: "Integrated therapeutic music for 5,000+ patient populations with EMR connectivity",
    },
    {
      title: "Health Insurance Networks",
      icon: Shield,
      description: "Value-based care programs with measurable outcomes and cost reduction",
    },
    {
      title: "Government Health Programs",
      icon: Building2,
      description: "VA, Military, and public health initiatives at population scale",
    },
    {
      title: "Pharmacy Benefit Managers",
      icon: HeartPulse,
      description: "Complementary non-pharmacological interventions for chronic conditions",
    },
    {
      title: "Accountable Care Organizations",
      icon: Users,
      description: "Quality metrics improvement and patient satisfaction enhancement",
    },
    {
      title: "National Wellness Initiatives",
      icon: Activity,
      description: "Large-scale public health programs with analytics dashboards",
    },
  ];

  const benefits = [
    {
      title: "Reduce Patient Anxiety 30-45%",
      icon: HeartPulse,
      description: "Clinically validated therapeutic music protocols for measurable anxiety reduction",
    },
    {
      title: "Lower Perceived Pain Scores",
      icon: Activity,
      description: "Non-pharmacological pain management support during procedures and recovery",
    },
    {
      title: "Improve HCAHPS Satisfaction",
      icon: BarChart3,
      description: "Enhanced patient experience scores through evidence-based music therapy",
    },
    {
      title: "EMR/EHR Integration",
      icon: Shield,
      description: "Seamless integration with existing clinical workflows and documentation systems",
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
        <section className="relative pt-16 pb-2 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              className="text-3xl lg:text-4xl font-light mb-2"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Enterprise Population Health
            </motion.h1>

            <motion.p 
              className="text-sm lg:text-base mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.60)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Clinical-grade therapeutic music at scale with HIPAA-compliant biomarker collection
            </motion.p>
          </div>
        </section>

        {/* Key Stats */}
        <section className="relative py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: ">50%", label: "Anxiety Reduction in Clinical Pilots" },
                { stat: "8,000+", label: "Purpose-Composed Tracks" },
                { stat: "5,000+", label: "Covered Lives Minimum" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div 
                    className="text-2xl lg:text-3xl font-light mb-1"
                    style={{ color: 'rgba(6, 182, 212, 0.9)' }}
                  >
                    {item.stat}
                  </div>
                  <div 
                    className="text-xs lg:text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.60)' }}
                  >
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-Powered Personalization & Clinically Validated */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>AI-Powered Personalization</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Our patented closed-loop engine continuously adapts playlists based on quick patient input 
                  and physiological response. Each session is uniquely generated—no two listening experiences 
                  are the same.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Clinically Validated</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Built on 8+ years of R&amp;D at Columbia and Cornell Tech, informed by a meta-analysis of 
                  thousands of journal articles examining the therapeutic use of music and music therapy. 
                  Pilot studies demonstrate statistically significant anxiety reductions (p&lt;.05).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Journey */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-light mb-6 text-center" style={{ color: 'rgba(255, 255, 255, 0.90)' }}>
              Patient Journey
            </h2>
            
            <div className="space-y-6">
              {/* Waiting Room */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>Pre-Procedure</span>
                  <h3 className="text-lg font-light" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Waiting Room</h3>
                </div>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Patient scans a QR code → 60-second intake (choose goal and preferred genre) → 10–15 minute sessions 
                  while waiting. Each session is newly generated from the catalog (no repeats).
                </p>
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span className="font-light">Benefits:</span> Patient arrives calmer; lower perceived pain and tension; smoother flow; higher experience scores.
                </div>
              </div>

              {/* During Procedure */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>During Treatment</span>
                  <h3 className="text-lg font-light" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Infusion / ED / Exam Room</h3>
                </div>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Patient scans QR → selects goal and genre → 15–30 minute sessions during treatment or observation. 
                  Each session is newly generated.
                </p>
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span className="font-light">Benefits:</span> Reduced anxiety and pain; potential reduction in sedatives and analgesics; higher satisfaction.
                </div>
              </div>

              {/* Take-Home */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>Post-Visit</span>
                  <h3 className="text-lg font-light" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Take-Home</h3>
                </div>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Patient leaves with a link; short sessions at home for 7–14 days. Each session newly generated.
                </p>
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span className="font-light">Benefits:</span> Simple routine to stay calm between visits; consistent experience beyond the hospital.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Pilots */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-light mb-6 text-center" style={{ color: 'rgba(255, 255, 255, 0.90)' }}>
              Clinical Pilot Options
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Oncology */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'rgba(168, 85, 247, 0.9)' }}>Pilot A</span>
                <h3 className="text-lg font-light mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Oncology</h3>
                <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Infusion &amp; RT Support</p>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  20–30 min during infusion; 10–15 min pre-RT or during setup; optional at-home after visit.
                </p>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Goal: Calmer treatments; ease anxiety &amp; pain.
                </p>
              </div>

              {/* Emergency */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'rgba(239, 68, 68, 0.9)' }}>Pilot B</span>
                <h3 className="text-lg font-light mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Emergency</h3>
                <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Triage / Observation</p>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  10–20 min sessions while awaiting labs/re-evaluation. Typical ESI 3–5 patients.
                </p>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Goal: Fast relief during the wait; ease anxiety &amp; pain.
                </p>
              </div>

              {/* Executive */}
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'rgba(34, 197, 94, 0.9)' }}>Pilot C</span>
                <h3 className="text-lg font-light mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Executive Check-Up</h3>
                <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Concierge</p>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  8–10 min in-suite demo; 14–30 days at home. Peak-performance &amp; resilience playlists.
                </p>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Goal: Reduce anxiety &amp; stress; support calm/focus.
                </p>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
              <h3 className="text-lg font-light mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Success Metrics (Any Two Met → Scale)</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                <div>
                  <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Anxiety VAS</span>
                  <p className="mt-1">≥ 25–30% mean reduction</p>
                </div>
                <div>
                  <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Pain NRS</span>
                  <p className="mt-1">−1.0 or better</p>
                </div>
                <div>
                  <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Experience</span>
                  <p className="mt-1">NPS +10 points</p>
                </div>
                <div>
                  <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Operations</span>
                  <p className="mt-1">↓ medication use, ↓ LOS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration & Privacy */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-light mb-6 text-center" style={{ color: 'rgba(255, 255, 255, 0.90)' }}>
              Integration &amp; Privacy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Low-Lift Integration</h3>
                <ul className="space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Distribution via QR posters/cards and deep links</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Secure web dashboard for clinician view</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>De-identified CSV/FHIR data exports for research/quality teams</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Security &amp; Privacy</h3>
                <ul className="space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>No PII collected in sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Tokenized access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Encryption in transit and at rest (LGPD-aligned)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Carousel */}
        <section className="relative py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              Clinical Benefits
            </h2>

            <div className="relative">
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

        {/* Target Markets */}
        <section className="relative py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              Target Markets
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

        {/* CTA */}
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
                  Ready to improve patient outcomes?
                </h2>

                <p 
                  className="text-base mb-8 max-w-2xl mx-auto"
                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                  Schedule a consultation to learn how therapeutic music can enhance your population health initiatives
                </p>

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
                    Schedule Consultation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
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

        <Footer />
        <FooterContactHandler
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          interestType="Population Health - Consultation Request"
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