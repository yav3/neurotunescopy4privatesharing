import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const scrollToSection = (sectionId: string) => {
    setInterestType(sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
    setContactOpen(true);
  };

  return (
    <>
      {/* Compact Two-Line Footer */}
      <footer className="relative bg-[#0A0A0C] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Line 1: Logos + Main Links */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            
            {/* Institutional Logos */}
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/30 uppercase tracking-wider">Supported by</span>
              <motion.img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-5 opacity-60 hover:opacity-100 transition"
                style={{ filter: 'brightness(0) invert(1)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              />
              <motion.img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-5 opacity-60 hover:opacity-100 transition"
                style={{ filter: 'brightness(0) invert(1)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                viewport={{ once: true }}
              />
              <motion.img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-5 opacity-60 hover:opacity-100 transition"
                style={{ filter: 'brightness(0) invert(1)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-6 text-sm">
              <Link to="/demo" className="text-white/60 hover:text-teal-400 transition">Demo</Link>
              <Link to="/pricing" className="text-white/60 hover:text-teal-400 transition">Pricing</Link>
              <Link to="/research" className="text-white/60 hover:text-teal-400 transition">Research</Link>
              <Link to="/story" className="text-white/60 hover:text-teal-400 transition">Our Story</Link>
              <button onClick={() => scrollToSection('contact')} className="text-white/60 hover:text-teal-400 transition">Contact</button>
              <Link to="/partners" className="text-white/60 hover:text-teal-400 transition">Partners</Link>
              <Link to="/api" className="text-white/60 hover:text-teal-400 transition">API</Link>
            </nav>
          </div>

          {/* Line 2: Copyright + Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 border-t border-white/5 pt-6">
            <span>© NeuroPositive Tech, Inc. 2025</span>
            <nav className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-white/70 transition">Privacy</Link>
              <span>•</span>
              <Link to="/legal" className="hover:text-white/70 transition">Legal</Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-white/70 transition">Cookies</Link>
              <span>•</span>
              <select className="bg-transparent border-none cursor-pointer hover:text-white/70 transition text-white/40">
                <option>English</option>
              </select>
            </nav>
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
