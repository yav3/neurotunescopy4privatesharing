import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import headerChromeTexture from '@/assets/header-chrome-texture.png';

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isExpanded = isHovered || isScrolled;

  return (
    <>
      {/* Desktop Navigation */}
      <header 
        className={`hidden md:flex items-center justify-between px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C] bg-cover bg-center transition-all duration-300 ${
          isExpanded ? 'py-5 lg:py-6 opacity-100' : 'py-2 opacity-60'
        }`}
        style={{
          backgroundImage: `url(${headerChromeTexture})`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Solid obsidian overlay - fully opaque */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isExpanded ? 'bg-gradient-to-b from-obsidian/98 to-obsidian/95' : 'bg-gradient-to-b from-obsidian/70 to-obsidian/60'
        }`} />
        
        {/* Chrome highlight at bottom edge */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${
          isExpanded ? 'bg-white/10 opacity-100' : 'bg-white/5 opacity-50'
        }`} />

        {/* Left: Logo */}
        <Link to="/" className={`flex flex-col relative z-10 transition-all duration-300 ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-75'
        }`}>
          <span className="text-lg lg:text-xl font-light tracking-tight text-platinum-glow/90">
            +NeuroTunes
          </span>
          <span className={`text-[9px] lg:text-[10px] font-light tracking-wide text-platinum-glow/65 transition-all duration-300 ${
            isExpanded ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
            by Neuralpositive
          </span>
        </Link>

        {/* Right: Auth + CTA */}
        <div className={`flex items-center gap-4 lg:gap-6 relative z-10 transition-all duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link to="/auth" className="text-sm lg:text-base font-light text-platinum-glow/86 hover:text-platinum-glow transition-colors">
            Log in
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header 
        className={`md:hidden flex items-center justify-between px-5 fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C] bg-cover bg-center transition-all duration-300 ${
          isScrolled ? 'py-4 opacity-100' : 'py-2 opacity-60'
        }`}
        style={{
          backgroundImage: `url(${headerChromeTexture})`,
        }}
      >
        {/* Solid obsidian overlay - fully opaque */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isScrolled ? 'bg-gradient-to-b from-obsidian/98 to-obsidian/95' : 'bg-gradient-to-b from-obsidian/70 to-obsidian/60'
        }`} />
        
        {/* Chrome highlight at bottom edge */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${
          isScrolled ? 'bg-white/10 opacity-100' : 'bg-white/5 opacity-50'
        }`} />
        
        <Link to="/" className={`flex flex-col relative z-10 transition-all duration-300 ${
          isScrolled ? 'scale-100 opacity-100' : 'scale-90 opacity-75'
        }`}>
          <span className="text-lg font-light tracking-tight text-platinum-glow/90">
            +NeuroTunes
          </span>
          <span className={`text-[9px] font-light tracking-wide text-platinum-glow/65 transition-all duration-300 ${
            isScrolled ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
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
          <div className="p-6 space-y-6">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light text-white/75 hover:text-white"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
