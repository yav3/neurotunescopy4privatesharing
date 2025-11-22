import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import headerChromeTexture from '@/assets/header-chrome-texture.png';

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Center: Tagline */}
        <div className="flex-1 flex justify-center relative z-10">
          <p className="text-[9px] lg:text-[10px] font-light tracking-wide text-platinum-glow/65 max-w-3xl text-center leading-relaxed">
            Neuroscience-backed • Clinically Validated • Patented • Medical-grade Therapeutic Music & AI Streaming
          </p>
        </div>

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
