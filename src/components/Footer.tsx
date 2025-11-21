import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FooterContactHandler } from "./FooterContactHandler";
import footerChromeMetal from '@/assets/footer-chrome-metal.png';
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const scrollToSection = (sectionId: string) => {
    // Open contact dialog with specific interest
    setInterestType(sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
    setContactOpen(true);
  };

  return (
    <>
      {/* Platinum separator line */}
      <div className="w-full h-px" style={{ background: 'rgba(255, 255, 255, 0.10)' }} />

      {/* Footer Content */}
      <footer 
        className="relative px-6"
        style={{
          backgroundImage: `url(${footerChromeMetal})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0A0A0C',
        }}
      >
        {/* Chrome divider line above footer */}
        <div 
          className="absolute top-0 left-0 right-0 h-px" 
          style={{ background: 'rgba(255, 255, 255, 0.12)' }} 
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Supported by section - At top of footer with proper breathing room */}
          <div className="pt-20 pb-20 mt-30">
            <div 
              className="max-w-6xl mx-auto px-12 text-center"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.02), transparent)',
                paddingTop: '80px',
                paddingBottom: '80px',
              }}
            >
              <div className="flex flex-col items-center gap-8">
                <motion.span 
                  className="text-sm uppercase tracking-wider mb-8"
                  style={{ color: 'rgba(228, 228, 228, 0.50)', letterSpacing: '0.1em' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  Supported by
                </motion.span>

                <div className="flex items-center justify-center gap-12 flex-wrap">
                  {[
                    { name: "Jacobs Technion-Cornell Institute", logo: jacobsTechnionLogo },
                    { name: "Stanford Medicine", logo: stanfordLogo },
                    { name: "Weill Cornell Medicine", logo: weillCornellLogo }
                  ].map((partner, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center"
                    >
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="object-contain transition-all duration-300"
                        style={{
                          height: '32px',
                          maxWidth: '160px',
                          filter: 'brightness(0) invert(1)',
                          opacity: '0.7',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.2))';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                          e.currentTarget.style.filter = 'brightness(0) invert(1)';
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Grid - 4 columns with proper spacing */}
          <div className="mt-30 py-20">
            <div className="max-w-4xl mx-auto px-12 grid grid-cols-4 gap-30 justify-start text-white/60">
              <div>
                <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Product
                </h4>
                <div className="space-y-3">
                  <Link to="/demo" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Demo</Link>
                  <Link to="/pricing" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Pricing</Link>
                </div>
              </div>

              <div>
                <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Resources
                </h4>
                <div className="space-y-3">
                  <Link to="/research" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Research</Link>
                </div>
              </div>

              <div>
                <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Company
                </h4>
                <div className="space-y-3">
                  <Link to="/story" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Our Story</Link>
                  <button onClick={() => scrollToSection('contact')} className="block text-sm hover:text-teal-400 transition-colors text-left" style={{ lineHeight: '2' }}>Contact</button>
                  <button onClick={() => scrollToSection('help')} className="block text-sm hover:text-teal-400 transition-colors text-left" style={{ lineHeight: '2' }}>Help</button>
                  <Link to="/partners" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Partners</Link>
                  <Link to="/api" className="block text-sm hover:text-teal-400 transition-colors" style={{ lineHeight: '2' }}>Our API</Link>
                </div>
              </div>

              <div>
                <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Language
                </h4>
                <div className="text-sm text-white/60">English</div>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div 
            className="h-px mx-auto my-12 max-w-6xl"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)'
            }}
          />

          {/* Footer Bottom with proper spacing */}
          <div className="py-12 px-12">
            <div className="max-w-6xl mx-auto flex items-center justify-between text-white/40 text-sm">
              <span>© NeuroPositive Tech, Inc. 2025</span>
              <div className="flex items-center gap-6">
                <Link to="/legal" className="hover:text-white/70 transition-colors">Legal & cookies</Link>
                <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy policy</Link>
                <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookie preferences</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    
    {/* Mobile responsive styles */}
    <style>{`
      @media (max-width: 768px) {
        footer .mt-30 {
          margin-top: 80px;
        }
        
        footer .py-20 {
          padding-top: 60px;
          padding-bottom: 60px;
        }
        
        footer .gap-12 {
          gap: 32px;
        }
        
        footer .gap-30 {
          gap: 40px;
        }
        
        footer .grid-cols-4 {
          grid-template-columns: 1fr 1fr;
          gap: 40px 60px;
        }
        
        footer .flex.items-center.justify-between {
          flex-direction: column;
          gap: 24px;
          text-align: center;
        }
        
        footer .flex.gap-6 {
          flex-direction: column;
          gap: 12px;
        }
      }
    `}</style>

    <FooterContactHandler
      isOpen={contactOpen}
      onClose={() => setContactOpen(false)}
      interestType={interestType}
    />
    </>
  );
};
