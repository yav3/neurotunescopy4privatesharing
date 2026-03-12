import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';
import welconyFullColour from '@/assets/welcony-full-colour.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const openContact = (type: string) => {
    setInterestType(type);
    setContactOpen(true);
  };

  return (
    <>
       <footer className="relative border-t" style={{ background: 'transparent', borderColor: 'hsl(210, 30%, 90%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
            {/* Left: Supported By + Logos */}
            <div className="flex items-center gap-3 sm:gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] uppercase tracking-[0.15em] whitespace-nowrap shrink-0" style={{ color: 'hsl(215, 15%, 45%)' }}>Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.5, filter: 'grayscale(100%)' }}
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.5, filter: 'grayscale(100%)' }}
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.5, filter: 'grayscale(100%)' }}
              />
            </div>

            {/* Center: Contact Sales CTA */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
              className="px-6 py-2 rounded-full text-white hover:opacity-90 transition-all duration-200 text-xs font-normal shrink-0"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.25)'
              }}
            >
              Contact Sales
            </button>

            {/* Right: Distributed by + Copyright */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-wide" style={{ color: 'hsl(215, 15%, 45%)' }}>Distributed by</span>
                <img 
                  src={welconyFullColour} 
                  alt="Welcony" 
                  className="h-6"
                  style={{ opacity: 0.85 }}
                />
              </div>
              <span style={{ color: 'hsl(210, 20%, 80%)' }}>·</span>
              <p className="text-[10px] whitespace-nowrap" style={{ color: 'hsl(215, 15%, 55%)' }}>
                © 2026 Neuralpositive, all rights reserved
              </p>
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
