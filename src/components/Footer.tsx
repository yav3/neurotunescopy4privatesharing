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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          {/* Tagline Section - Better mobile line breaks */}
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <p className="text-xs sm:text-sm md:text-base text-white/50 tracking-wide leading-[1.8] sm:leading-loose max-w-4xl mx-auto px-2">
              by Neuralpositive • Neuroscience-backed • Clinically Validated • Patented • Medical-grade Therapeutic Music & AI Streaming
            </p>
          </div>

          {/* Logos Section - Better mobile spacing */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 mb-14 sm:mb-16 md:mb-20 max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-xs md:text-sm text-white/30 uppercase tracking-widest w-full text-center mb-2 sm:mb-0 sm:w-auto">Supported by</span>
            <img 
              src={jacobsTechnionLogo} 
              alt="Jacobs Technion-Cornell" 
              className="h-8 sm:h-9 md:h-10 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert flex-shrink-0"
            />
            <img 
              src={stanfordLogo} 
              alt="Stanford Medicine" 
              className="h-8 sm:h-9 md:h-10 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert flex-shrink-0"
            />
            <img 
              src={weillCornellLogo} 
              alt="Weill Cornell Medicine" 
              className="h-8 sm:h-9 md:h-10 opacity-50 hover:opacity-100 transition-all duration-300 brightness-0 invert flex-shrink-0"
            />
          </div>

          {/* Mobile Accordion Footer */}
          <div className="md:hidden mb-12">
            <Accordion type="multiple" className="w-full space-y-2">
              <AccordionItem value="product" className="border-b border-white/10">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Product
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><Link to="/products/environmental" className="text-sm text-white/60 hover:text-white transition-colors block">Environmental & Background</Link></li>
                    <li><Link to="/products/population-health" className="text-sm text-white/60 hover:text-white transition-colors block">Enterprise Population Health</Link></li>
                    <li><Link to="/products/enterprise-wellness" className="text-sm text-white/60 hover:text-white transition-colors block">Enterprise Wellness</Link></li>
                    <li><Link to="/app-download" className="text-sm text-white/60 hover:text-white transition-colors block">Personal Wellness App</Link></li>
                    <li><Link to="/products/partnerships" className="text-sm text-white/60 hover:text-white transition-colors block">Partnerships & Integration</Link></li>
                    <li><Link to="/products" className="text-sm text-white/60 hover:text-white transition-colors block">View All Products</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resources" className="border-b border-white/10">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Resources
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><Link to="/research" className="text-sm text-white/60 hover:text-white transition-colors block">Research</Link></li>
                    <li><Link to="/whitepapers" className="text-sm text-white/60 hover:text-white transition-colors block">White Papers</Link></li>
                    <li><Link to="/evidence" className="text-sm text-white/60 hover:text-white transition-colors block">Clinical Evidence</Link></li>
                    <li><Link to="/press" className="text-sm text-white/60 hover:text-white transition-colors block">Press</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="company" className="border-b border-white/10">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Company
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><Link to="/story" className="text-sm text-white/60 hover:text-white transition-colors block">Our Story</Link></li>
                    <li><Link to="/team" className="text-sm text-white/60 hover:text-white transition-colors block">Leadership</Link></li>
                    <li><button onClick={() => openContact('General')} className="text-sm text-white/60 hover:text-white transition-colors text-left w-full">Contact</button></li>
                    <li><Link to="/partners" className="text-sm text-white/60 hover:text-white transition-colors block">Partners</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="legal" className="border-b border-white/10">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Legal
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors block">Privacy Policy</Link></li>
                    <li><Link to="/legal" className="text-sm text-white/60 hover:text-white transition-colors block">Terms & Conditions</Link></li>
                    <li><Link to="/cookies" className="text-sm text-white/60 hover:text-white transition-colors block">Cookie Policy</Link></li>
                    <li><Link to="/hipaa" className="text-sm text-white/60 hover:text-white transition-colors block">HIPAA Statement</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support" className="border-b border-white/10">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Support
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><Link to="/help" className="text-sm text-white/60 hover:text-white transition-colors block">Help Center</Link></li>
                    <li><Link to="/help/clinical" className="text-sm text-white/60 hover:text-white transition-colors block">Clinical Support</Link></li>
                    <li><Link to="/help/technical" className="text-sm text-white/60 hover:text-white transition-colors block">Technical Support</Link></li>
                    <li><Link to="/help/faq" className="text-sm text-white/60 hover:text-white transition-colors block">FAQs</Link></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="language" className="border-b-0">
                <AccordionTrigger className="text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:no-underline py-4">
                  Language
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pb-2">
                    <li><button className="text-sm text-white/60 hover:text-white transition-colors text-left w-full">English</button></li>
                    <li><button className="text-sm text-white/60 hover:text-white transition-colors text-left w-full">Português</button></li>
                    <li><button className="text-sm text-white/60 hover:text-white transition-colors text-left w-full">Español</button></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Grid Footer - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 sm:gap-8 lg:gap-6 mb-12 sm:mb-16">
            
            {/* PRODUCT */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Product
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><Link to="/products/environmental" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Environmental & Background</Link></li>
                <li><Link to="/products/population-health" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Enterprise Population Health</Link></li>
                <li><Link to="/products/enterprise-wellness" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Enterprise Wellness</Link></li>
                <li><Link to="/app-download" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Personal Wellness App</Link></li>
                <li><Link to="/products/partnerships" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Partnerships & Integration</Link></li>
                <li><Link to="/products" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">View All Products</Link></li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Resources
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><Link to="/research" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Research</Link></li>
                <li><Link to="/whitepapers" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">White Papers</Link></li>
                <li><Link to="/evidence" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Clinical Evidence</Link></li>
                <li><Link to="/press" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Press</Link></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><Link to="/story" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Our Story</Link></li>
                <li><Link to="/team" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Leadership</Link></li>
                <li><button onClick={() => openContact('General')} className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors text-left w-full">Contact</button></li>
                <li><Link to="/partners" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Partners</Link></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Legal
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><Link to="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Privacy Policy</Link></li>
                <li><Link to="/legal" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Terms & Conditions</Link></li>
                <li><Link to="/cookies" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Cookie Policy</Link></li>
                <li><Link to="/hipaa" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">HIPAA Statement</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><Link to="/help" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Help Center</Link></li>
                <li><Link to="/help/clinical" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Clinical Support</Link></li>
                <li><Link to="/help/technical" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">Technical Support</Link></li>
                <li><Link to="/help/faq" className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors block">FAQs</Link></li>
              </ul>
            </div>

            {/* LANGUAGE */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 text-white/90">
                Language
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li><button className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors text-left w-full">English</button></li>
                <li><button className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors text-left w-full">Português</button></li>
                <li><button className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors text-left w-full">Español</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar - Mobile optimized */}
          <div className="pt-8 sm:pt-10 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <p className="text-[10px] sm:text-xs md:text-sm text-white/30 text-center sm:text-left">
                © {new Date().getFullYear()} NeuroPositive Tech, Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a 
                  href="https://linkedin.com/company/neuralpositive" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
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
