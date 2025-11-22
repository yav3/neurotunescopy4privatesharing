import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { FooterContactHandler } from "../FooterContactHandler";
import headerChromeTexture from '@/assets/header-chrome-texture.png';

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");
  const [showSolutionsMega, setShowSolutionsMega] = useState(false);

  const enterpriseSolutions = [
    { title: "Environmental & Background Audio", href: "/products" },
    { title: "Senior Living & Long-Term Care", href: "/products" },
    { title: "Healthcare & Clinical Deployment", href: "/products" },
    { title: "Enterprise Well-Being", href: "/products" },
  ];

  const products = [
    { title: "Get the Web App", href: "/consumer-pricing" },
    { title: "Get the Android App", href: "/app-download" },
    { title: "Get the iOS App", href: "/app-download" },
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
      <header 
        className="hidden md:flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C] bg-cover bg-center"
        style={{
          backgroundImage: `url(${headerChromeTexture})`,
        }}
      >
        {/* Solid obsidian overlay - fully opaque */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-obsidian/98 to-obsidian/95" />
        
        {/* Chrome highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

        {/* Left: Logo */}
        <Link to="/" className="flex flex-col relative z-10">
          <span className="text-lg lg:text-xl font-light tracking-tight text-platinum-glow/90">
            +NeuroTunes
          </span>
          <span className="text-[9px] lg:text-[10px] font-light tracking-wide text-platinum-glow/65">
            by Neuralpositive
          </span>
        </Link>

        {/* Center: Menu Items */}
        <nav className="flex items-center gap-6 lg:gap-8 relative z-10">
          <Link to="/demo">
            <button className="px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-xs lg:text-sm font-medium transition-all bg-obsidian/85 border border-platinum-glow/18 text-platinum-glow/90 shadow-[0_0_24px_rgba(228,228,228,0.10),inset_0_1px_0_rgba(228,228,228,0.06)] hover:bg-obsidian-graphite/90 hover:border-platinum-glow/32 hover:shadow-[0_0_40px_rgba(228,228,228,0.18),inset_0_1px_0_rgba(228,228,228,0.10)]">
              Hear Demo
            </button>
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowSolutionsMega(true)}
            onMouseLeave={() => setShowSolutionsMega(false)}
          >
            <button 
              className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow"
            >
              Solutions
            </button>

            {/* Mega Menu */}
            {showSolutionsMega && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[920px]">
                <div
                  className="rounded-2xl overflow-hidden backdrop-blur-2xl border border-platinum-glow/12 shadow-[0_0_60px_rgba(228,228,228,0.04),0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(228,228,228,0.08)]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 12, 0.98) 0%, rgba(19, 20, 22, 0.98) 100%)',
                  }}
                >
                  <div className="p-10">
                  <div className="grid grid-cols-3 gap-10">
                    {/* Column 1: Enterprise Solutions */}
                    <div>
                      <h3 className="text-xs lg:text-sm font-semibold uppercase tracking-wider mb-4 lg:mb-5 text-platinum-glow/92">
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
                      <h3 className="text-xs lg:text-sm font-semibold uppercase tracking-wider mb-4 lg:mb-5 text-platinum-glow/92">
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
                      <h3 className="text-xs lg:text-sm font-semibold uppercase tracking-wider mb-4 lg:mb-5 text-platinum-glow/92">
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
                  <div className="mt-10 pt-8 border-t border-platinum-glow/12">
                    <Link to="/products">
                      <button className="w-full py-3 rounded-lg text-sm font-medium text-white transition-all border border-platinum-glow/18 bg-transparent hover:bg-white/8 hover:border-platinum-glow/35 hover:shadow-[0_0_20px_rgba(255,255,255,0.10)]">
                        View All Solutions →
                      </button>
                    </Link>
                  </div>
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
            className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow"
          >
            Enterprise
          </button>

          <button
            onClick={() => {
              setInterestType("Licensing");
              setContactOpen(true);
            }}
            className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow"
          >
            Licensing
          </button>

          <button
            onClick={() => {
              setInterestType("Research");
              setContactOpen(true);
            }}
            className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow"
          >
            Research
          </button>

          <button
            onClick={() => {
              setInterestType("Partners");
              setContactOpen(true);
            }}
            className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow"
          >
            Partners
          </button>
        </nav>

        {/* Right: Auth + CTA */}
        <div className="flex items-center gap-4 lg:gap-6 relative z-10">
          <Link to="/auth" className="text-sm lg:text-base font-light text-platinum-glow/86 hover:text-platinum-glow transition-colors">
            Log in
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header 
        className="md:hidden flex items-center justify-between px-5 py-4 fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C] bg-cover bg-center"
        style={{
          backgroundImage: `url(${headerChromeTexture})`,
        }}
      >
        {/* Solid obsidian overlay - fully opaque */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-obsidian/98 to-obsidian/95" />
        
        {/* Chrome highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        
        <Link to="/" className="flex flex-col relative z-10">
          <span className="text-lg font-light tracking-tight text-platinum-glow/90">
            +NeuroTunes
          </span>
          <span className="text-[9px] font-light tracking-wide text-platinum-glow/65">
            by Neuralpositive
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 relative z-10 flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex flex-col gap-1.5 w-6">
              <div className="w-full h-0.5 bg-white" />
              <div className="w-full h-0.5 bg-white" />
              <div className="w-full h-0.5 bg-white" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 overflow-y-auto bg-gradient-to-br from-obsidian/98 to-obsidian-graphite">
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-platinum-glow/92">
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
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-platinum-glow/92">
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
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-platinum-glow/92">
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

            <div className="pt-6 space-y-4 border-t border-platinum-glow/12">
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
              <button className="w-full px-6 py-3 rounded-full text-sm font-medium text-white bg-obsidian/80 border border-platinum-glow/14 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                Hear Demo
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
