import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const openContact = (type: string) => {
    setInterestType(type);
    setContactOpen(true);
  };

  return (
    <>
      <footer className="relative text-foreground border-t border-white/8 bg-[#050607]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          
          {/* Single Row - Logos and Copyright Together */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left: Supported By + Logos */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-7 sm:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-7 sm:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-7 sm:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
            </div>

            {/* Right: Copyright */}
            <div className="flex items-center">
              <p className="text-[10px] text-white/30 text-center sm:text-right">
                © 2025 Neuralpositive, all rights reserved, content copyrighted and patented
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
