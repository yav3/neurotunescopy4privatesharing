import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LissajousLogo } from '@/components/brand/LissajousLogo';
import welconyFullColour from '@/assets/welcony-full-colour.png';




export const NavigationHeader = () => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/index';

    // Track scroll for nav background transition on landing page
    // Landing page is all-white so header stays frosted white glass throughout
    useEffect(() => {
      if (!isLandingPage) return;
      const onScroll = () => {
        setScrolled(false); // No dark transition on all-white landing
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [isLandingPage]);

  // Listen for mute state changes from player
  useEffect(() => {
    const handleMuteChange = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
    };
    window.addEventListener('landingPlayerMuteChange' as any, handleMuteChange);
    return () => window.removeEventListener('landingPlayerMuteChange' as any, handleMuteChange);
  }, []);

  const handleSoundToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    window.dispatchEvent(new CustomEvent('headerMuteToggle', { detail: { muted: newMuted } }));
  };

  const handleSupportChat = () => {
    const event = new CustomEvent('openSupportChat');
    window.dispatchEvent(event);
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
  };
  return (
    <>
      {/* Backdrop Overlay - dims background when menu is open */}
      {(desktopMenuOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => {
            setDesktopMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}

      {/* Desktop Navigation - Ultra Minimal Cinematic */}
      <header className="hidden md:flex items-center justify-between px-8 py-2.5 fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ background: isLandingPage && !scrolled ? 'hsla(0, 0%, 100%, 0.85)' : 'hsla(0, 0%, 100%, 0.85)', backdropFilter: 'blur(24px) saturate(1.4)', borderBottom: '1px solid hsla(210, 20%, 80%, 0.3)', boxShadow: '0 1px 12px hsla(210, 20%, 50%, 0.06)' }}>
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
            <DropdownMenuTrigger className="transition-colors p-2 hover:bg-black/5 rounded">
              <Menu className="h-5 w-5" style={{ color: 'hsl(220, 15%, 25%)' }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#000000] border border-white/20 shadow-2xl z-[9999]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Explore</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/demo" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Demo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#technology" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Technology</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#science" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Science</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#how-it-works" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">How It Works</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/research" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Research</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Product</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/products/environmental" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Environmental & Background</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/population-health" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Population Health</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/enterprise-wellness" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Employee Benefits</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/partnerships" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Partnerships & APIs</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Sales</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Contact Sales</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Company</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/story" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Our Story</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/team" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Leadership</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Legal</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/privacy" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Privacy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legal" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Terms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cookies" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Cookies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/hipaa" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">HIPAA</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Support</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleSupportChat} className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">
                  Chat Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/" className="flex items-center gap-2">
            <LissajousLogo size={26} animated color="hsl(220, 15%, 25%)" />
            <span className="text-[22px] tracking-tight whitespace-nowrap font-sf font-normal" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NeuroTunes
            </span>
          </Link>
          <div className="flex items-center gap-2 ml-4 pl-4 border-l" style={{ borderColor: 'hsla(210, 15%, 70%, 0.3)' }}>
            <span className="text-[11px] tracking-wide" style={{ color: 'hsla(220, 10%, 35%, 0.6)' }}>Distributed by</span>
            <img 
              src={welconyFullColour} 
              alt="Welcony" 
              className="h-7"
              style={{ opacity: 0.85 }}
            />
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="px-6 py-2 rounded-full transition-all duration-300 text-sm font-normal hover:bg-black/5"
            style={{
              border: '1px solid hsla(210, 15%, 70%, 0.4)',
              color: 'hsl(220, 15%, 25%)',
            }}
          >
            Login
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
            className="px-7 py-2.5 rounded-full text-white hover:opacity-90 transition-all duration-200 text-sm font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            Request Access
          </button>
        </div>
      </header>

      {/* Mobile Navigation - Ultra Minimal Cinematic */}
      <header className="md:hidden flex items-center justify-between px-5 py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ background: 'hsla(0, 0%, 100%, 0.85)', backdropFilter: 'blur(24px) saturate(1.4)', borderBottom: '1px solid hsla(210, 20%, 80%, 0.3)', boxShadow: '0 1px 12px hsla(210, 20%, 50%, 0.06)' }}>
        <div className="flex items-center gap-3">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger className="transition-colors p-1.5 rounded" style={{ color: 'hsl(220, 15%, 30%)' }}>
              <Menu className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#000000] border border-white/20 shadow-2xl z-[9999]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Explore</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/demo" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Demo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#technology" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Technology</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#science" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Science</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#how-it-works" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">How It Works</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/research" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Research</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Product</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/products/environmental" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Environmental & Background</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/population-health" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Population Health</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/enterprise-wellness" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Employee Benefits</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/partnerships" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Partnerships & APIs</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Sales</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Contact Sales</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Company</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/story" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Our Story</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/team" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Leadership</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Legal</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/privacy" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Privacy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legal" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Terms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cookies" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Cookies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/hipaa" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">HIPAA</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/20 my-1" />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Support</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleSupportChat} className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">
                  Chat Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/" className="flex items-center gap-1.5">
            <LissajousLogo size={20} animated color="hsl(220, 15%, 25%)" />
            <span className="text-sm tracking-normal whitespace-nowrap font-sf font-normal" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NeuroTunes
            </span>
          </Link>
          <div className="flex items-center gap-1 ml-2 pl-2 border-l" style={{ borderColor: 'hsla(210, 15%, 70%, 0.3)' }}>
            <span className="text-[8px] tracking-wide" style={{ color: 'hsla(220, 10%, 35%, 0.6)' }}>Distributed by</span>
            <img 
              src={welconyFullColour} 
              alt="Welcony" 
              className="h-5"
              style={{ opacity: 0.85 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to="/auth" 
            className="px-3 py-1 rounded-full transition-all duration-300 text-[10px] font-normal hover:bg-black/5"
            style={{
              border: '1px solid hsla(210, 15%, 70%, 0.4)',
              color: 'hsl(220, 15%, 25%)',
            }}
          >
            Login
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
            className="px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-all duration-200 text-[10px] font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            Request Access
          </button>
        </div>
      </header>

    </>
  );
};
