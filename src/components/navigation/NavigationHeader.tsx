import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Ultra Minimal Glass */}
      <header 
        className="hidden md:flex items-center justify-between px-8 py-3 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px) saturate(120%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Left: Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl font-medium tracking-tight text-white/95">
            +NeuroTunes
          </span>
          <span className="text-[10px] font-light tracking-wide text-white/40">
            by Neuralpositive
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              const event = new CustomEvent('openSalesAssistant');
              window.dispatchEvent(event);
            }}
            className="text-sm text-white/60 hover:text-white/90 transition-colors duration-200"
          >
            Chat with Sales
          </button>
          
          <Link 
            to="/auth" 
            className="px-5 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Ultra Minimal Glass */}
      <header 
        className="md:hidden flex items-center justify-between px-5 py-3 fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px) saturate(120%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg font-medium tracking-tight text-white/95">
            +NeuroTunes
          </span>
          <span className="text-[9px] font-light tracking-wide text-white/40">
            by Neuralpositive
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white/80" />
          ) : (
            <div className="flex flex-col gap-1.5 w-5">
              <div className="w-full h-0.5 bg-white/80" />
              <div className="w-full h-0.5 bg-white/80" />
              <div className="w-full h-0.5 bg-white/80" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-[57px] z-40 overflow-y-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-6 space-y-3">
            <button
              onClick={() => {
                const event = new CustomEvent('openSalesAssistant');
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
              className="block w-full py-3 text-center text-white/60 hover:text-white/90 transition-colors"
            >
              Chat with Sales
            </button>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full px-6 py-2.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-center hover:bg-white/10 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
