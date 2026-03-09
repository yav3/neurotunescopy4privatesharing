import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';
import welconyColourWhite from '@/assets/welcony-colour-white.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const openContact = (type: string) => {
    setInterestType(type);
    setContactOpen(true);
  };

  return (
    <>
      <footer className="relative border-t" style={{ background: 'transparent', borderColor: 'hsla(190, 60%, 70%, 0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
            {/* Left: Supported By + Logos */}
            <div className="flex items-center gap-3 sm:gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] uppercase tracking-[0.15em] whitespace-nowrap shrink-0" style={{ color: 'hsla(195, 60%, 90%, 0.5)' }}>Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.5 }}
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.5 }}
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.5 }}
              />
            </div>

            {/* Right: Distributed by + Copyright */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-wide" style={{ color: 'hsla(195, 60%, 90%, 0.5)' }}>Distributed by</span>
                <img 
                  src={welconyColourWhite} 
                  alt="Welcony" 
                  className="h-6"
                  style={{ opacity: 0.7 }}
                />
              </div>
              <span style={{ color: 'hsla(195, 60%, 80%, 0.2)' }}>·</span>
              <p className="text-[10px] whitespace-nowrap" style={{ color: 'hsla(195, 60%, 90%, 0.4)' }}>
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
