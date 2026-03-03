import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';
import welconyLogo from '@/assets/welcony-logo.png';

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
                className="h-7 sm:h-9 opacity-40 hover:opacity-80 transition-opacity duration-300 brightness-0 invert shrink-0"
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-5 sm:h-7 opacity-40 hover:opacity-80 transition-opacity duration-300 brightness-0 invert shrink-0"
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-6 sm:h-8 opacity-40 hover:opacity-80 transition-opacity duration-300 brightness-0 invert shrink-0"
              />
            </div>

            {/* Right: Copyright + Welcony */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/30 tracking-wide">Distributed by</span>
                <div className="h-5 overflow-hidden" style={{ width: '78px' }}>
                  <img 
                    src={welconyLogo} 
                    alt="Welcony" 
                    className="h-5"
                    style={{ filter: 'brightness(0) invert(0.6)', opacity: 0.7, objectFit: 'cover', objectPosition: 'right center' }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/25 text-center sm:text-right whitespace-nowrap">
                © 2025 Neuralpositive, all rights reserved
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
