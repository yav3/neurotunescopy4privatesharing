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
      <footer className="relative text-foreground border-t border-white/[0.06] bg-[#050607]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Stack on mobile, row on desktop */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
            {/* Left: Supported By + Logos */}
            <div className="flex items-center gap-3 sm:gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] whitespace-nowrap shrink-0">Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.45 }}
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.45 }}
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-4 sm:h-5 brightness-0 invert shrink-0"
                style={{ opacity: 0.45 }}
              />
            </div>

            {/* Right: Distributed by + Copyright */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/40 tracking-wide">Distributed by</span>
                <img 
                  src={welconyColourWhite} 
                  alt="Welcony" 
                  className="h-6"
                  style={{ opacity: 0.7 }}
                />
              </div>
              <span className="text-white/15">·</span>
              <p className="text-[10px] text-white/25 whitespace-nowrap">
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
