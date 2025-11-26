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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Single Row - Logos and Copyright Together */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Supported By + Logos */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-5 sm:h-6 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-5 sm:h-6 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-5 sm:h-6 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
              />
            </div>

            {/* Right: Copyright + LinkedIn */}
            <div className="flex items-center gap-4">
              <p className="text-[10px] text-white/30 text-center sm:text-right">
                © 2025 Neuralpositive, all rights reserved, content copyrighted and patented
              </p>
              <a 
                href="https://linkedin.com/company/neuralpositive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors flex-shrink-0"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
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
