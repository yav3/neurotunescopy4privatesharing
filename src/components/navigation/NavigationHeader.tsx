import { Link, useLocation } from "react-router-dom";
import { Menu, Volume2, VolumeX } from "lucide-react";
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
import neuralpositiveLogoHeader from '@/assets/neuralpositive-logo-header.png';

export const NavigationHeader = () => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

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
      <header className="hidden md:flex items-center justify-between px-8 py-2.5 border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]" style={{ background: 'linear-gradient(135deg, hsl(195, 80%, 42%) 0%, hsl(210, 70%, 45%) 50%, hsl(225, 65%, 48%) 100%)' }}>
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
            <DropdownMenuTrigger className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded">
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#000000] border border-white/20 shadow-2xl z-[9999]">
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

          <Link to="/" className="flex items-center gap-1">
            <img 
              src={neuralpositiveLogoHeader} 
              alt="Neuralpositive" 
              className="h-9 w-9 object-contain"
            />
            <span className="text-[22px] tracking-tight text-white uppercase">
              NeuroTunes
            </span>
          </Link>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-4">
          {isLandingPage && (
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-200"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#e4e4e4]/70" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#e4e4e4]" />
              )}
            </button>
          )}
          <Link 
            to="/auth" 
            className="px-6 py-2 rounded-full border border-white/30 text-[#e4e4e4] hover:bg-white/10 transition-all duration-200 text-sm font-normal"
          >
            Login
          </Link>
          <Link 
            to="/free-trial"
            className="px-7 py-2.5 rounded-full text-white hover:opacity-90 transition-all duration-200 text-sm font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            Free Trial
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Ultra Minimal Cinematic */}
      <header className="md:hidden flex items-center justify-between px-5 py-2 border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]" style={{ background: 'linear-gradient(135deg, hsl(195, 80%, 42%) 0%, hsl(210, 70%, 45%) 50%, hsl(225, 65%, 48%) 100%)' }}>
        <div className="flex items-center gap-3">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded">
              <Menu className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#000000] border border-white/20 shadow-2xl z-[9999]">
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

          <Link to="/" className="flex items-center gap-1">
            <img 
              src={neuralpositiveLogoHeader} 
              alt="Neuralpositive" 
              className="h-5 w-5 object-contain"
            />
            <span className="text-sm tracking-normal text-white uppercase whitespace-nowrap">
              NeuroTunes
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {isLandingPage && (
            <button
              onClick={handleSoundToggle}
              className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#e4e4e4]/70" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#e4e4e4]" />
              )}
            </button>
          )}
          <Link 
            to="/auth" 
            className="px-3 py-1 rounded-full border border-white/30 text-[#e4e4e4] hover:bg-white/10 transition-all duration-200 text-[10px] font-normal"
          >
            Login
          </Link>
          <Link 
            to="/free-trial"
            className="px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-all duration-200 text-[10px] font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            Free Trial
          </Link>
        </div>
      </header>

    </>
  );
};
