import { Link } from "react-router-dom";
import { useState } from "react";
import { FooterContactHandler } from "./FooterContactHandler";
import footerChromeMetal from '@/assets/footer-chrome-metal.png';

export const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");

  const scrollToSection = (sectionId: string) => {
    // Open contact dialog with specific interest
    setInterestType(sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
    setContactOpen(true);
  };

  return (
    <>
      {/* Platinum separator line */}
      <div className="w-full h-px" style={{ background: 'rgba(255, 255, 255, 0.10)' }} />

      {/* Footer Content */}
      <footer 
        className="relative py-24 px-6"
        style={{
          backgroundImage: `url(${footerChromeMetal})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0A0A0C',
        }}
      >
        {/* Chrome divider line above footer */}
        <div 
          className="absolute top-0 left-0 right-0 h-px" 
          style={{ background: 'rgba(255, 255, 255, 0.12)' }} 
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            {/* Column 1 - Product */}
            <div>
              <h4 className="font-medium mb-6" style={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: '15px', letterSpacing: '0.02em' }}>
                Product
              </h4>
              <ul className="space-y-4" style={{ lineHeight: '24px' }}>
                <li>
                  <Link 
                    to="/demo" 
                    className="transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/payments" 
                    className="transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 - Resources */}
            <div>
              <h4 className="font-medium mb-6" style={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: '15px', letterSpacing: '0.02em' }}>
                Resources
              </h4>
              <ul className="space-y-4" style={{ lineHeight: '24px' }}>
                <li>
                  <a 
                    href="mailto:info@neurotunes.com?subject=Research Pack Request" 
                    className="transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Research
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h4 className="font-medium mb-6" style={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: '15px', letterSpacing: '0.02em' }}>
                Company
              </h4>
              <ul className="space-y-4" style={{ lineHeight: '24px' }}>
                <li>
                  <Link 
                    to="/our-story" 
                    className="transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="transition-colors text-left"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('help')}
                    className="transition-colors text-left"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Help
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('partners')}
                    className="transition-colors text-left"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Partners
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('api')}
                    className="transition-colors text-left"
                    style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                  >
                    Our API
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 - Language */}
            <div>
              <h4 className="font-medium mb-6" style={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: '15px', letterSpacing: '0.02em' }}>
                Language
              </h4>
              <button 
                className="flex items-center gap-2 transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                English
              </button>
            </div>
          </div>

          {/* Lower footer bar with legal links */}
          <div className="relative pt-8">
            {/* Chrome divider above lower footer */}
            <div 
              className="absolute top-0 left-0 right-0 h-px" 
              style={{ background: 'rgba(255, 255, 255, 0.08)' }} 
            />
            
            <div className="flex flex-wrap justify-center gap-6 text-center" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>
              <span>+NeuroTunes</span>
              <Link 
                to="/legal" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.90)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
              >
                Legal & cookies
              </Link>
              <Link 
                to="/privacy" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.90)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
              >
                Our privacy policy
              </Link>
              <Link 
                to="/cookies" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.90)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
              >
                Cookie preferences
              </Link>
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
