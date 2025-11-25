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
          
          {/* Logos Section - Compact */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
            <span className="text-[10px] sm:text-xs text-white/30 uppercase tracking-widest">Supported by</span>
            <img 
              src={jacobsTechnionLogo} 
              alt="Jacobs Technion-Cornell" 
              className="h-6 sm:h-7 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
            <img 
              src={stanfordLogo} 
              alt="Stanford Medicine" 
              className="h-6 sm:h-7 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
            <img 
              src={weillCornellLogo} 
              alt="Weill Cornell Medicine" 
              className="h-6 sm:h-7 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
          </div>

          {/* Bottom Bar - Minimal */}
          <div className="pt-4 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] text-white/30 text-center sm:text-left">
                © 2025 Neuralpositive, all rights reserved, content copyrighted and patented
              </p>
              <a 
                href="https://linkedin.com/company/neuralpositive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
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
