import { useState, useEffect } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';
import welconyFullColour from '@/assets/welcony-full-colour.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("Contact Sales");

  // Listen for global openContactForm events so "Contact Sales" works on every page
  useEffect(() => {
    const handler = () => {
      setInterestType("Contact Sales");
      setContactOpen(true);
    };
    window.addEventListener('openContactForm', handler);
    return () => window.removeEventListener('openContactForm', handler);
  }, []);

  return (
    <>
       <footer className="relative border-t" style={{ background: 'hsl(var(--landing-bg))', borderColor: 'hsl(var(--landing-border-soft))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          
          {/* Mobile: stack vertically. Desktop: horizontal row */}
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between md:gap-6">
            
            {/* Supported By + Logos */}
            <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] uppercase tracking-[0.15em] whitespace-nowrap shrink-0" style={{ color: 'hsl(var(--landing-ink-soft))' }}>Supported by</span>
              <img 
                src={jacobsTechnionLogo} 
                alt="Jacobs Technion-Cornell" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.9 }}
              />
              <img 
                src={stanfordLogo} 
                alt="Stanford Medicine" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.9 }}
              />
              <img 
                src={weillCornellLogo} 
                alt="Weill Cornell Medicine" 
                className="h-4 sm:h-5 shrink-0"
                style={{ opacity: 0.9 }}
              />
            </div>

            {/* Contact Sales CTA */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
              className="px-6 py-2 rounded-full hover:opacity-90 transition-all duration-200 text-xs font-normal shrink-0"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--landing-electric-1)), hsl(var(--landing-electric-2)))',
                color: 'hsl(var(--landing-bg))',
                boxShadow: '0 0 16px hsl(var(--landing-electric-1) / 0.3)'
              }}
            >
              Contact Sales
            </button>

            {/* Distributed by + Copyright */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-wide" style={{ color: 'hsl(var(--landing-ink-soft))' }}>Distributed by</span>
                <img 
                  src={welconyFullColour} 
                  alt="Welcony" 
                  className="h-6"
                  style={{ opacity: 0.95 }}
                />
              </div>
              <span className="hidden sm:inline" style={{ color: 'hsl(var(--landing-ink-muted))' }}>·</span>
              <p className="text-[10px] whitespace-nowrap" style={{ color: 'hsl(var(--landing-ink-muted))' }}>
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
