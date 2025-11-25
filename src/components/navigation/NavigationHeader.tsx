import { Link } from "react-router-dom";

export const NavigationHeader = () => {
  return (
    <>
      {/* Desktop Navigation - Ultra Minimal Cinematic */}
      <header className="hidden md:flex items-center justify-between px-8 py-3 bg-black border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        {/* Left: Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl tracking-tight text-white uppercase">
            +NeuroTunes
          </span>
          <span className="text-[10px] font-light tracking-wide text-white/40">
            by Neuralpositive
          </span>
        </Link>

        {/* Right: CTAs */}
        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            Login
          </Link>
          <Link 
            to="/subscribe" 
            className="px-5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200 text-sm font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Ultra Minimal Cinematic */}
      <header className="md:hidden flex items-center justify-between px-5 py-3 bg-black border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg tracking-tight text-white uppercase">
            +NeuroTunes
          </span>
          <span className="text-[9px] font-light tracking-wide text-white/40">
            by Neuralpositive
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link 
            to="/auth" 
            className="text-white/70 hover:text-white transition-colors text-xs font-medium"
          >
            Login
          </Link>
          <Link 
            to="/subscribe" 
            className="px-4 py-1 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200 text-xs font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>

    </>
  );
};
