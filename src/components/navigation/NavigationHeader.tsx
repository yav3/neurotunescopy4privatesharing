import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import headerChromeTexture from '@/assets/header-chrome-texture.png';

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Static Obsidian Glass */}
      <header 
        className="hidden md:flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Obsidian glass texture overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url(${headerChromeTexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Diamond highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* Left: Logo + Sales Chat */}
        <div className="flex items-center gap-4 lg:gap-6 relative z-10">
          <Link to="/" className="flex flex-col">
            <span className="text-lg lg:text-xl font-light tracking-tight text-white/95">
              +NeuroTunes
            </span>
            <span className="text-[9px] lg:text-[10px] font-light tracking-wide text-white/60">
              by Neuralpositive
            </span>
          </Link>
          
          <button
            onClick={() => {
              const event = new CustomEvent('openSalesAssistant');
              window.dispatchEvent(event);
            }}
            className="px-4 py-2 rounded-full text-xs lg:text-sm font-light transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: 'rgba(255, 255, 255, 0.88)',
            }}
          >
            Chat with Sales
          </button>
        </div>

        {/* Right: Login CTA */}
        <div className="flex items-center gap-4 lg:gap-6 relative z-10">
          <Link 
            to="/auth" 
            className="px-6 py-2.5 rounded-full text-sm lg:text-base font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              color: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Static Obsidian Glass */}
      <header 
        className="md:hidden flex items-center justify-between px-5 py-4 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Obsidian glass texture overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url(${headerChromeTexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Diamond highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        
        <div className="flex items-center gap-3 relative z-10">
          <Link to="/" className="flex flex-col">
            <span className="text-lg font-light tracking-tight text-white/95">
              +NeuroTunes
            </span>
            <span className="text-[9px] font-light tracking-wide text-white/60">
              by Neuralpositive
            </span>
          </Link>
          
          <button
            onClick={() => {
              const event = new CustomEvent('openSalesAssistant');
              window.dispatchEvent(event);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-light"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: 'rgba(255, 255, 255, 0.88)',
            }}
          >
            Sales
          </button>
        </div>

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
        <div 
          className="md:hidden fixed inset-0 top-[65px] z-40 overflow-y-auto"
          style={{
            background: 'rgba(10, 10, 12, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-6 space-y-6">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-6 py-3 rounded-full text-base font-medium text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
