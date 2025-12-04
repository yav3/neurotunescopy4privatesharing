import { useState, useRef } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, Brain, TrendingUp, Users, Building2, GraduationCap, ArrowRight, ChevronLeft, ChevronRight, Target, Heart, Zap } from "lucide-react";
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
      title: "Call Centers & Customer Service",
      icon: Users,
      description: "High-stress environments benefiting from focus and stress reduction",
    },
    {
      title: "Creative Agencies & Studios",
      icon: Zap,
      description: "Teams requiring sustained creative focus and flow states",
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
    {
      title: "Reduce Anxiety & Stress",
      icon: Heart,
      description: "Clinically validated protocols shown to reduce anxiety by over 50% in studies",
    },
    {
      title: "User-Reported Focus Improvement",
      icon: TrendingUp,
      description: "Employees report feeling more focused and clear-headed during work",
    },
    {
      title: "Evidence-Based Protocols",
      icon: Brain,
      description: "Music protocols designed using principles from music therapy and neuroscience",
    },
    {
      title: "Enhance Employee Retention",
      icon: Users,
      description: "Show employees you care about their well-being and watch retention improve",
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
              Enterprise Wellness
            </motion.h1>

            <motion.p 
              className="text-sm lg:text-base mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.60)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Help your employees focus and improve their wellness
            </motion.p>
          </div>
        </section>

        {/* Benefits Carousel */}
        <section className="relative py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              Key Benefits
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

        {/* Free Trial CTA */}
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