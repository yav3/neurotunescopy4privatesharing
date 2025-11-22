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

        {/* Center: Menu Items - Simplified */}
        <nav className="flex items-center gap-6 lg:gap-8 relative z-10">
          <Link to="/demo">
            <button className="px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-xs lg:text-sm font-medium transition-all bg-obsidian/85 border border-platinum-glow/18 text-platinum-glow/90 shadow-[0_0_24px_rgba(228,228,228,0.10),inset_0_1px_0_rgba(228,228,228,0.06)] hover:bg-obsidian-graphite/90 hover:border-platinum-glow/32 hover:shadow-[0_0_40px_rgba(228,228,228,0.18),inset_0_1px_0_rgba(228,228,228,0.10)]">
              Hear Demo
            </button>
          </Link>

          <Link to="/products" className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow">
            Products & Solutions
          </Link>
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

      {/* Mobile Menu - Simplified */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 overflow-y-auto bg-gradient-to-br from-obsidian/98 to-obsidian-graphite">
          <div className="p-6 space-y-6">
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light text-white/90 hover:text-white"
            >
              Products & Solutions
            </Link>

            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light text-white/75 hover:text-white"
            >
              Log in
            </Link>

            <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full px-6 py-3 rounded-full text-sm font-medium text-white bg-obsidian/80 border border-platinum-glow/14 shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:bg-white/10">
                Hear Demo
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
