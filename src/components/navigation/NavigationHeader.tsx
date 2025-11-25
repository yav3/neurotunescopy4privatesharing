import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavigationHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSupportChat = () => {
    const event = new CustomEvent('openSupportChat');
    window.dispatchEvent(event);
    setMenuOpen(false);
  };
  return (
    <>
      {/* Desktop Navigation - Ultra Minimal Cinematic */}
      <header className="hidden md:flex items-center justify-between px-8 py-3 bg-black border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded">
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-black border border-white/20 shadow-2xl z-[100]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Product</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/products/environmental" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Environmental & Background</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/population-health" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Enterprise Population Health</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/enterprise-wellness" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Enterprise Wellness</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app-download" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Personal Wellness App</Link>
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

          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-xl tracking-tight text-white uppercase">
              +NeuroTunes
            </span>
            <span className="text-[10px] font-light tracking-wide text-white/40">
              by Neuralpositive
            </span>
          </Link>
        </div>

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
        <div className="flex items-center gap-3">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded">
              <Menu className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-black border border-white/20 shadow-2xl z-[100]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">Product</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/products/environmental" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Environmental & Background</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/population-health" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Enterprise Population Health</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/enterprise-wellness" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Enterprise Wellness</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app-download" className="text-white/70 hover:text-white hover:bg-white/5 text-sm cursor-pointer transition-colors">Personal Wellness App</Link>
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

          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-lg tracking-tight text-white uppercase">
              +NeuroTunes
            </span>
            <span className="text-[9px] font-light tracking-wide text-white/40">
              by Neuralpositive
            </span>
          </Link>
        </div>

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
