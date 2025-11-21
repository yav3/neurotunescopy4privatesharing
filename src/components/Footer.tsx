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
        className="relative py-24 px-6"
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
          {/* Supported by section - At top of footer */}
          <div className="mb-10 pb-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <motion.span 
                className="text-xs font-light tracking-wide"
                style={{ color: 'rgba(228, 228, 228, 0.65)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                Supported by
              </motion.span>

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
                      height: '28px',
                      maxWidth: '140px',
                      filter: 'brightness(0) invert(1)',
                      opacity: '0.7',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.95';
                      e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.15))';
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
          {/* Main Footer Grid - 4 columns */}
          <div className="max-w-[1500px] mx-auto grid grid-cols-4 gap-20 px-12 py-20 text-white/70">
            <div>
              <h4 className="text-white mb-4 font-medium">Product</h4>
              <div className="space-y-2">
                <Link to="/demo" className="block hover:text-white/90 transition-colors">Demo</Link>
                <Link to="/pricing" className="block hover:text-white/90 transition-colors">Pricing</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 font-medium">Resources</h4>
              <div className="space-y-2">
                <Link to="/research" className="block hover:text-white/90 transition-colors">Research</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 font-medium">Company</h4>
              <div className="space-y-2">
                <Link to="/story" className="block hover:text-white/90 transition-colors">Our Story</Link>
                <button onClick={() => scrollToSection('contact')} className="block hover:text-white/90 transition-colors text-left">Contact</button>
                <button onClick={() => scrollToSection('help')} className="block hover:text-white/90 transition-colors text-left">Help</button>
                <Link to="/partners" className="block hover:text-white/90 transition-colors">Partners</Link>
                <Link to="/api" className="block hover:text-white/90 transition-colors">Our API</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 font-medium">Language</h4>
              <div className="text-white/70">English</div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="w-full border-t border-white/10 py-6 px-12 flex justify-between text-white/50 text-xs">
            <span>© NeuroPositive Tech, Inc. 2025</span>
            <div className="flex gap-6">
              <Link to="/legal" className="hover:text-white/70 transition-colors">Legal & cookies</Link>
              <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy policy</Link>
              <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookie preferences</Link>
            </div>
          </div>
        </div>
      </footer>
    
    <FooterContactHandler 
      isOpen={contactOpen}
      onClose={() => setContactOpen(false)}
      interestType={interestType}
    />
    </>
  );
};
