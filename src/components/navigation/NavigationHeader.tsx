import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Pure Obsidian Glass */}
      <header 
        className="hidden md:flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5, 6, 7, 0.98)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* High gloss overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        />
        
        {/* Diamond highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Left: Logo */}
        <Link to="/" className="flex flex-col relative z-10">
          <span className="text-lg lg:text-xl font-light tracking-tight text-white/95">
            +NeuroTunes
          </span>
          <span className="text-[9px] lg:text-[10px] font-light tracking-wide text-white/60">
            by Neuralpositive
          </span>
        </Link>

        {/* Right: Chat with Sales + Login */}
        <div className="flex items-center gap-3 lg:gap-4 relative z-10">
          <button
            onClick={() => {
              const event = new CustomEvent('openSalesAssistant');
              window.dispatchEvent(event);
            }}
            className="px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-light transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: 'rgba(255, 255, 255, 0.90)',
            }}
          >
            Chat with Sales
          </button>
          
          <Link 
            to="/auth" 
            className="px-5 lg:px-6 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              color: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 16px rgba(255, 255, 255, 0.12)',
            }}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Pure Obsidian Glass */}
      <header 
        className="md:hidden flex items-center justify-between px-5 py-4 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5, 6, 7, 0.98)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* High gloss overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        />
        
        {/* Diamond highlight at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <Link to="/" className="flex flex-col relative z-10">
          <span className="text-lg font-light tracking-tight text-white/95">
            +NeuroTunes
          </span>
          <span className="text-[9px] font-light tracking-wide text-white/60">
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
        <div 
          className="md:hidden fixed inset-0 top-[65px] z-40 overflow-y-auto"
          style={{
            background: 'rgba(5, 6, 7, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-6 space-y-4">
            <button
              onClick={() => {
                const event = new CustomEvent('openSalesAssistant');
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
              className="block w-full px-6 py-3 rounded-full text-base font-medium text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: 'rgba(255, 255, 255, 0.90)',
              }}
            >
              Chat with Sales
            </button>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-6 py-3 rounded-full text-base font-medium text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                color: 'rgba(255, 255, 255, 0.98)',
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
