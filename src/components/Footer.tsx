import { Link } from "react-router-dom";
import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4">
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

          {/* Minimal Accordion Footer */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="footer-links" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm text-white/60 hover:text-white hover:no-underline py-3 justify-center">
                More
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 pt-4 pb-6">
                  
                  {/* PRODUCT */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Product
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><Link to="/products/environmental" className="text-xs text-white/50 hover:text-white transition-colors block">Environmental & Background</Link></li>
                      <li><Link to="/products/population-health" className="text-xs text-white/50 hover:text-white transition-colors block">Enterprise Population Health</Link></li>
                      <li><Link to="/products/enterprise-wellness" className="text-xs text-white/50 hover:text-white transition-colors block">Enterprise Wellness</Link></li>
                      <li><Link to="/app-download" className="text-xs text-white/50 hover:text-white transition-colors block">Personal Wellness App</Link></li>
                    </ul>
                  </div>

                  {/* RESOURCES */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Resources
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><Link to="/research" className="text-xs text-white/50 hover:text-white transition-colors block">Research</Link></li>
                      <li><Link to="/whitepapers" className="text-xs text-white/50 hover:text-white transition-colors block">White Papers</Link></li>
                      <li><Link to="/evidence" className="text-xs text-white/50 hover:text-white transition-colors block">Clinical Evidence</Link></li>
                      <li><Link to="/press" className="text-xs text-white/50 hover:text-white transition-colors block">Press</Link></li>
                    </ul>
                  </div>

                  {/* COMPANY */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Company
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><Link to="/story" className="text-xs text-white/50 hover:text-white transition-colors block">Our Story</Link></li>
                      <li><Link to="/team" className="text-xs text-white/50 hover:text-white transition-colors block">Leadership</Link></li>
                      <li><button onClick={() => openContact('General')} className="text-xs text-white/50 hover:text-white transition-colors text-left w-full">Contact</button></li>
                    </ul>
                  </div>

                  {/* LEGAL */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Legal
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><Link to="/privacy" className="text-xs text-white/50 hover:text-white transition-colors block">Privacy</Link></li>
                      <li><Link to="/legal" className="text-xs text-white/50 hover:text-white transition-colors block">Terms</Link></li>
                      <li><Link to="/cookies" className="text-xs text-white/50 hover:text-white transition-colors block">Cookies</Link></li>
                      <li><Link to="/hipaa" className="text-xs text-white/50 hover:text-white transition-colors block">HIPAA</Link></li>
                    </ul>
                  </div>

                  {/* SUPPORT */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Support
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><Link to="/help" className="text-xs text-white/50 hover:text-white transition-colors block">Help Center</Link></li>
                      <li><Link to="/help/clinical" className="text-xs text-white/50 hover:text-white transition-colors block">Clinical</Link></li>
                      <li><Link to="/help/faq" className="text-xs text-white/50 hover:text-white transition-colors block">FAQs</Link></li>
                    </ul>
                  </div>

                  {/* LANGUAGE */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-white/90">
                      Language
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li><button className="text-xs text-white/50 hover:text-white transition-colors text-left w-full">English</button></li>
                      <li><button className="text-xs text-white/50 hover:text-white transition-colors text-left w-full">Português</button></li>
                      <li><button className="text-xs text-white/50 hover:text-white transition-colors text-left w-full">Español</button></li>
                    </ul>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bottom Bar - Minimal */}
          <div className="pt-4 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] text-white/30 text-center sm:text-left">
                © {new Date().getFullYear()} NeuroPositive Tech, Inc.
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
