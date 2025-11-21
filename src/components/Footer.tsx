import { Link } from "react-router-dom";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          
          {/* Tagline Section */}
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <p className="text-xs sm:text-sm md:text-base text-white/50 tracking-wide leading-relaxed sm:leading-loose max-w-4xl mx-auto px-4">
              by Neuralpositive • Neuroscience-backed • Clinically Validated • Patented • Medical-grade Therapeutic Music & AI Streaming
            </p>
          </div>

          {/* Logos Section - Fixed mobile wrapping */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-14 sm:mb-16 md:mb-18 max-w-3xl mx-auto">
            <span className="text-xs sm:text-sm text-white/30 uppercase tracking-widest w-full text-center mb-3 sm:mb-0 sm:w-auto">Supported by</span>
            <img 
              src={jacobsTechnionLogo} 
              alt="Jacobs Technion-Cornell" 
              className="h-7 sm:h-8 md:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
            <img 
              src={stanfordLogo} 
              alt="Stanford Medicine" 
              className="h-7 sm:h-8 md:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
            <img 
              src={weillCornellLogo} 
              alt="Weill Cornell Medicine" 
              className="h-7 sm:h-8 md:h-9 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert"
            />
          </div>

          {/* Main Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 mb-12 sm:mb-16">
            
            {/* PRODUCT */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Product
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/demo" className="text-sm text-white/50 hover:text-white transition-colors">Demo</Link></li>
                <li><Link to="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/download" className="text-sm text-white/50 hover:text-white transition-colors">App Download</Link></li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Resources
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/research" className="text-sm text-white/50 hover:text-white transition-colors">Research</Link></li>
                <li><Link to="/whitepapers" className="text-sm text-white/50 hover:text-white transition-colors">White Papers</Link></li>
                <li><Link to="/evidence" className="text-sm text-white/50 hover:text-white transition-colors">Clinical Evidence</Link></li>
                <li><Link to="/press" className="text-sm text-white/50 hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Company
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/story" className="text-sm text-white/50 hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/team" className="text-sm text-white/50 hover:text-white transition-colors">Leadership</Link></li>
                <li><button onClick={() => openContact('General')} className="text-sm text-white/50 hover:text-white transition-colors text-left">Contact</button></li>
                <li><Link to="/partners" className="text-sm text-white/50 hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Legal
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal" className="text-sm text-white/50 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/cookies" className="text-sm text-white/50 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/hipaa" className="text-sm text-white/50 hover:text-white transition-colors">HIPAA Statement</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Support
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/help" className="text-sm text-white/50 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/help/clinical" className="text-sm text-white/50 hover:text-white transition-colors">Clinical Support</Link></li>
                <li><Link to="/help/technical" className="text-sm text-white/50 hover:text-white transition-colors">Technical Support</Link></li>
                <li><Link to="/help/faq" className="text-sm text-white/50 hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* LANGUAGE */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Language
              </h3>
              <ul className="space-y-2.5">
                <li><button className="text-sm text-white/50 hover:text-white transition-colors text-left w-full">English</button></li>
                <li><button className="text-sm text-white/50 hover:text-white transition-colors text-left w-full">Português</button></li>
                <li><button className="text-sm text-white/50 hover:text-white transition-colors text-left w-full">Español</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-white/30">
                © {new Date().getFullYear()} NeuroPositive Tech, Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a 
                  href="https://linkedin.com/company/neuralpositive" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
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
