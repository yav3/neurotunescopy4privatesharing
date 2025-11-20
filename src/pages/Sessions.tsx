import { motion } from 'framer-motion';
import { FeaturedGoalsCarousel } from '@/components/landing/FeaturedGoalsCarousel';
import { CredentialsBadges } from '@/components/landing/CredentialsBadges';
import { BenefitsCarousel } from '@/components/landing/BenefitsCarousel';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import staticBg from '../assets/static-bg.png';

const Sessions = () => {
  return (
    <div className="min-h-screen relative">
      {/* Static background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={staticBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floating ambient elements */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 backdrop-blur-sm"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${15 * i}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Featured Therapeutic Sessions - 160px spacing */}
        <section id="featured-goals" className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Therapeutic Sessions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Scientifically designed audio experiences for every wellness goal
              </p>
            </motion.div>
            
            <motion.div 
              id="sessions"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <FeaturedGoalsCarousel />
            </motion.div>
          </div>
        </section>

        {/* Credentials - 120px spacing */}
        <section className="py-30 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="science"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <CredentialsBadges />
            </motion.div>
          </div>
        </section>

        {/* Benefits - 160px spacing */}
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="benefits"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <BenefitsCarousel />
            </motion.div>
          </div>
        </section>

        {/* Partners - 120px spacing */}
        <section className="py-30 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="partners"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <PartnersSection />
            </motion.div>
          </div>
        </section>
        
        {/* Sales Assistant */}
        <SalesAssistant />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Sessions;
