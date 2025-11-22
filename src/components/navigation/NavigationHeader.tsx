import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Ultra Minimal Cinematic */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-transparent fixed top-0 left-0 right-0 z-50">
        {/* Left: Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl font-medium tracking-tight text-white">
            +NeuroTunes
          </span>
          <span className="text-[10px] font-light tracking-wide text-white/40">
            by Neuralpositive
          </span>
        </Link>

        {/* Right: Login */}
        <Link 
          to="/auth" 
          className="text-sm text-white/80 hover:text-white transition-colors duration-200"
        >
          Login
        </Link>
      </header>

      {/* Mobile Navigation - Ultra Minimal Cinematic */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-transparent fixed top-0 left-0 right-0 z-50">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg font-medium tracking-tight text-white">
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
        <div className="md:hidden fixed inset-0 top-[65px] z-40 overflow-y-auto bg-black/95 backdrop-blur-xl">
          <div className="p-6 space-y-4">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 text-center text-white/80 hover:text-white transition-colors text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
