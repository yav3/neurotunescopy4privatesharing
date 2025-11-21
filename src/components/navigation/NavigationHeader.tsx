import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { FooterContactHandler } from "../FooterContactHandler";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");
  const [showSolutionsMega, setShowSolutionsMega] = useState(false);

  const enterpriseSolutions = [
    { title: "Environmental Therapeutic Audio", href: "/products/environmental" },
    { title: "Senior Living & Long-Term Care", href: "/products/senior-living" },
    { title: "Healthcare & Clinical Deployment", href: "/products/healthcare" },
    { title: "Enterprise Well-Being", href: "/products/enterprise-wellness" },
    { title: "Population Health Programs", href: "/products/population-health" },
    { title: "Hospitality & Travel Wellness", href: "/products/hospitality" },
  ];

  const products = [
    { title: "Therapeutic Sessions Library", href: "/products/library" },
    { title: "Spatial Therapeutic Audio", href: "/products/spatial-audio" },
    { title: "Web App", href: "/products/web-app" },
    { title: "iOS & Android Apps", href: "/products/mobile-apps" },
    { title: "Admin Dashboard", href: "/products/admin-dashboard" },
  ];

  const integrations = [
    { title: "API Access", href: "/products/api" },
    { title: "OEM & White-label", href: "/products/oem" },
    { title: "Platform Embedding", href: "/products/embedding" },
    { title: "AI Assistant Integration", href: "/products/ai-integration" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex items-center justify-between px-8 py-5 relative z-50">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(3, 26, 31, 0.75) 0%, rgba(2, 11, 15, 0.85) 100%)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(55, 213, 196, 0.12)',
            boxShadow: '0 4px 30px rgba(2, 11, 15, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
          }}
        />

        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <Plus className="w-7 h-7" style={{ color: 'hsl(174, 62%, 58%)' }} strokeWidth={2} />
          <span className="text-xl font-light text-white tracking-wide">NeuroTunes</span>
        </Link>

        {/* Center: Menu Items */}
        <nav className="flex items-center gap-8 relative z-10">
          <div
            className="relative"
            onMouseEnter={() => setShowSolutionsMega(true)}
            onMouseLeave={() => setShowSolutionsMega(false)}
          >
            <button className="text-base font-light text-white/90 transition-colors hover:text-white">
              Solutions
            </button>

            {/* Mega Menu */}
            {showSolutionsMega && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[920px] rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(3, 26, 31, 0.95) 0%, rgba(1, 48, 57, 0.98) 100%)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(55, 213, 196, 0.12)',
                  boxShadow: '0 0 60px rgba(55, 213, 196, 0.08), 0 30px 80px rgba(2, 11, 15, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
                }}
              >
                <div className="p-10">
                  <div className="grid grid-cols-3 gap-10">
                    {/* Column 1: Enterprise Solutions */}
                    <div>
                      <h3 
                        className="text-sm font-semibold uppercase tracking-wider mb-5"
                        style={{ color: 'rgba(55, 213, 196, 0.8)' }}
                      >
                        Enterprise Solutions
                      </h3>
                      <div className="space-y-3">
                        {enterpriseSolutions.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.href}
                            className="block text-sm font-light text-white/75 hover:text-white transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                      <h3 
                        className="text-sm font-semibold uppercase tracking-wider mb-5"
                        style={{ color: 'rgba(55, 213, 196, 0.8)' }}
                      >
                        Products
                      </h3>
                      <div className="space-y-3">
                        {products.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.href}
                            className="block text-sm font-light text-white/75 hover:text-white transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Integrations */}
                    <div>
                      <h3 
                        className="text-sm font-semibold uppercase tracking-wider mb-5"
                        style={{ color: 'rgba(55, 213, 196, 0.8)' }}
                      >
                        Integrations
                      </h3>
                      <div className="space-y-3">
                        {integrations.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.href}
                            className="block text-sm font-light text-white/75 hover:text-white transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(55, 213, 196, 0.12)' }}>
                    <Link to="/products">
                      <button 
                        className="w-full py-3 rounded-lg text-sm font-medium text-white transition-all"
                        style={{
                          border: '1px solid rgba(55, 213, 196, 0.2)',
                          background: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(55, 213, 196, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(55, 213, 196, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(55, 213, 196, 0.2)';
                        }}
                      >
                        View All Solutions →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setInterestType("Enterprise");
              setContactOpen(true);
            }}
            className="text-base font-light text-white/90 hover:text-white transition-colors"
          >
            Enterprise
          </button>

          <button
            onClick={() => {
              setInterestType("Licensing");
              setContactOpen(true);
            }}
            className="text-base font-light text-white/90 hover:text-white transition-colors"
          >
            Licensing
          </button>

          <button
            onClick={() => {
              setInterestType("Research");
              setContactOpen(true);
            }}
            className="text-base font-light text-white/90 hover:text-white transition-colors"
          >
            Research
          </button>

          <button
            onClick={() => {
              setInterestType("Partners");
              setContactOpen(true);
            }}
            className="text-base font-light text-white/90 hover:text-white transition-colors"
          >
            Partners
          </button>
        </nav>

        {/* Right: Auth + CTA */}
        <div className="flex items-center gap-6 relative z-10">
          <Link to="/auth" className="text-base font-light text-white/75 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/demo">
            <button 
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all"
              style={{
                background: 'rgba(55, 213, 196, 0.08)',
                border: '1px solid rgba(55, 213, 196, 0.3)',
                boxShadow: '0 0 20px rgba(55, 213, 196, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(55, 213, 196, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(55, 213, 196, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(55, 213, 196, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(55, 213, 196, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(55, 213, 196, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(55, 213, 196, 0.15)';
              }}
            >
              See Samples
            </button>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 relative z-50">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(3, 26, 31, 0.9) 0%, rgba(2, 11, 15, 0.95) 100%)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(55, 213, 196, 0.12)',
          }}
        />
        
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <Plus className="w-6 h-6" style={{ color: 'hsl(174, 62%, 58%)' }} strokeWidth={2} />
          <span className="text-lg font-light text-white">NeuroTunes</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 relative z-10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-[57px] z-40 overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(3, 26, 31, 0.98) 0%, rgba(2, 11, 15, 1) 100%)',
          }}
        >
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(174, 62%, 58%)' }}>
                Enterprise Solutions
              </h3>
              <div className="space-y-3">
                {enterpriseSolutions.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-light text-white/75 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(174, 62%, 58%)' }}>
                Products
              </h3>
              <div className="space-y-3">
                {products.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-light text-white/75 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(174, 62%, 58%)' }}>
                Integrations
              </h3>
              <div className="space-y-3">
                {integrations.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-light text-white/75 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-4" style={{ borderTop: '1px solid rgba(55, 213, 196, 0.12)' }}>
              <button
                onClick={() => {
                  setInterestType("Enterprise");
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block text-white/75 hover:text-white text-left"
              >
                Enterprise
              </button>
              <button
                onClick={() => {
                  setInterestType("Licensing");
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block text-white/75 hover:text-white text-left"
              >
                Licensing
              </button>
              <button
                onClick={() => {
                  setInterestType("Research");
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block text-white/75 hover:text-white text-left"
              >
                Research
              </button>
              <button
                onClick={() => {
                  setInterestType("Partners");
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block text-white/75 hover:text-white text-left"
              >
                Partners
              </button>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white/75 hover:text-white"
              >
                Log in
              </Link>
            </div>

            <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
              <button 
                className="w-full px-6 py-3 rounded-full text-sm font-medium text-white"
                style={{
                  background: 'rgba(55, 213, 196, 0.08)',
                  border: '1px solid rgba(55, 213, 196, 0.3)',
                  boxShadow: '0 0 20px rgba(55, 213, 196, 0.15)',
                }}
              >
                See Samples
              </button>
            </Link>
          </div>
        </div>
      )}

      <FooterContactHandler 
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        interestType={interestType}
      />
    </>
  );
};
