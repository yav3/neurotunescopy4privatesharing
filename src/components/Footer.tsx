import { Link } from "react-router-dom";
import { useState } from "react";
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
      {/* Ultra-Compact Footer - Maximum 20vh */}
      <footer className="relative text-white border-t border-white/5" style={{ backgroundColor: '#0A0A0C' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          
          {/* Row 1: Logos (Centered) */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs text-white/30 uppercase tracking-wider">Supported by</span>
            <img 
              src={jacobsTechnionLogo} 
              alt="Jacobs Technion-Cornell" 
              className="h-4 opacity-50 hover:opacity-100 transition"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <img 
              src={stanfordLogo} 
              alt="Stanford Medicine" 
              className="h-4 opacity-50 hover:opacity-100 transition"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <img 
              src={weillCornellLogo} 
              alt="Weill Cornell Medicine" 
              className="h-4 opacity-50 hover:opacity-100 transition"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Row 2: Links (Horizontal) */}
          <nav className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mb-4 text-sm">
            <Link to="/demo" className="text-white/50 hover:text-teal-400 transition">Demo</Link>
            <span className="text-white/20">·</span>
            <Link to="/pricing" className="text-white/50 hover:text-teal-400 transition">Pricing</Link>
            <span className="text-white/20">·</span>
            <Link to="/research" className="text-white/50 hover:text-teal-400 transition">Research</Link>
            <span className="text-white/20">·</span>
            <Link to="/story" className="text-white/50 hover:text-teal-400 transition">Our Story</Link>
            <span className="text-white/20">·</span>
            <button onClick={() => scrollToSection('contact')} className="text-white/50 hover:text-teal-400 transition">Contact</button>
            <span className="text-white/20">·</span>
            <button onClick={() => scrollToSection('help')} className="text-white/50 hover:text-teal-400 transition">Help</button>
            <span className="text-white/20">·</span>
            <Link to="/partners" className="text-white/50 hover:text-teal-400 transition">Partners</Link>
          </nav>

          {/* Row 3: Copyright + Legal (Small) */}
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 text-xs text-white/30">
            <span>© NeuroPositive Tech 2025</span>
            <span>·</span>
            <Link to="/privacy" className="hover:text-white/50 transition">Privacy</Link>
            <span>·</span>
            <Link to="/legal" className="hover:text-white/50 transition">Legal</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:text-white/50 transition">Cookies</Link>
            <span>·</span>
            <select className="bg-transparent border-none cursor-pointer hover:text-white/50 transition text-xs text-white/30">
              <option>English</option>
            </select>
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
