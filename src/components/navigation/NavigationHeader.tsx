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
import welconyColourWhite from '@/assets/welcony-colour-white.png';

/* ─── Theme tokens for header modes ─── */
const LIGHT_HEADER = {
  bg: 'hsla(0, 0%, 100%, 0.88)',
  border: '1px solid hsla(210, 20%, 85%, 0.4)',
  shadow: '0 1px 8px hsla(210, 15%, 50%, 0.06)',
  iconColor: 'hsl(220, 12%, 28%)',
  textColor: 'hsl(220, 12%, 28%)',
  mutedText: 'hsla(220, 10%, 40%, 0.6)',
  divider: 'hsla(210, 12%, 75%, 0.35)',
  loginBorder: '1px solid hsla(210, 12%, 75%, 0.45)',
  loginHover: 'hover:bg-black/5',
  welconyLogo: welconyFullColour,
  logoColor: 'hsl(220, 12%, 28%)',
} as const;

const DARK_HEADER = {
  bg: 'hsla(240, 8%, 4%, 0.92)',
  border: '1px solid hsla(0, 0%, 100%, 0.08)',
  shadow: '0 1px 12px hsla(0, 0%, 0%, 0.3)',
  iconColor: 'hsla(0, 0%, 89%, 0.7)',
  textColor: 'hsl(0, 0%, 89%)',
  mutedText: 'hsla(0, 0%, 89%, 0.4)',
  divider: 'hsla(0, 0%, 100%, 0.1)',
  loginBorder: '1px solid hsla(0, 0%, 100%, 0.2)',
  loginHover: 'hover:bg-white/5',
  welconyLogo: welconyColourWhite,
  logoColor: 'hsla(0, 0%, 89%, 0.8)',
} as const;

/* ─── Menu style tokens ─── */
const MENU_LABEL = "text-[10px] uppercase tracking-[0.15em] px-3 py-2 font-medium";
const MENU_ITEM = "text-sm cursor-pointer transition-colors rounded-md";

const LIGHT_MENU = {
  content: 'bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_12px_48px_-4px_hsla(210,30%,50%,0.15)]',
  label: `${MENU_LABEL} text-black/35`,
  item: `${MENU_ITEM} text-black/65 hover:text-black hover:bg-black/[0.04]`,
  separator: 'bg-black/[0.06] my-1',
} as const;

const DARK_MENU = {
  content: 'bg-[hsl(240,8%,6%)]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_48px_-4px_hsla(0,0%,0%,0.5)]',
  label: `${MENU_LABEL} text-white/40`,
  item: `${MENU_ITEM} text-white/65 hover:text-white hover:bg-white/[0.06]`,
  separator: 'bg-white/[0.08] my-1',
} as const;

/* ─── Shared dropdown menu items ─── */
const MenuItems = ({ onSupportChat, menu }: { onSupportChat: () => void; menu: typeof LIGHT_MENU }) => (
  <>
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Explore</DropdownMenuLabel>
      <DropdownMenuItem asChild><Link to="/demo" className={menu.item}>Demo</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/#technology" className={menu.item}>Technology</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/#science" className={menu.item}>Science</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/#how-it-works" className={menu.item}>How It Works</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/research" className={menu.item}>Research</Link></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className={menu.separator} />
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Product</DropdownMenuLabel>
      <DropdownMenuItem asChild><Link to="/products/environmental" className={menu.item}>Environmental & Background</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/products/population-health" className={menu.item}>Population Health</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/products/enterprise-wellness" className={menu.item}>Employee Benefits</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/products/partnerships" className={menu.item}>Partnerships & APIs</Link></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className={menu.separator} />
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Sales</DropdownMenuLabel>
      <DropdownMenuItem asChild><Link to="/contact" className={menu.item}>Contact Sales</Link></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className={menu.separator} />
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Company</DropdownMenuLabel>
      <DropdownMenuItem asChild><Link to="/story" className={menu.item}>Our Story</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/team" className={menu.item}>Leadership</Link></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className={menu.separator} />
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Legal</DropdownMenuLabel>
      <DropdownMenuItem asChild><Link to="/privacy" className={menu.item}>Privacy</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/legal" className={menu.item}>Terms</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/cookies" className={menu.item}>Cookies</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link to="/hipaa" className={menu.item}>HIPAA</Link></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className={menu.separator} />
    <DropdownMenuGroup>
      <DropdownMenuLabel className={menu.label}>Support</DropdownMenuLabel>
      <DropdownMenuItem onClick={onSupportChat} className={menu.item}>Chat Support</DropdownMenuItem>
    </DropdownMenuGroup>
  </>
);

export const NavigationHeader = () => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLightPage = location.pathname === '/' || location.pathname === '/index';

  const theme = isLightPage ? LIGHT_HEADER : DARK_HEADER;
  const menu = isLightPage ? LIGHT_MENU : DARK_MENU;

  const handleSupportChat = () => {
    window.dispatchEvent(new CustomEvent('openSupportChat'));
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {(desktopMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => { setDesktopMenuOpen(false); setMobileMenuOpen(false); }}
        />
      )}

      {/* ━━━ Desktop ━━━ */}
      <header
        className="hidden md:flex items-center justify-between px-10 py-3 fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: theme.bg,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          borderBottom: theme.border,
          boxShadow: theme.shadow,
        }}
      >
        {/* Left cluster: menu · logo · welcony */}
        <div className="flex items-center gap-5">
          <DropdownMenu open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
            <DropdownMenuTrigger className="p-2 rounded-lg transition-colors" style={{ color: theme.iconColor }}>
              <Menu className="h-[18px] w-[18px]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-64 z-[9999] ${menu.content}`}>
              <MenuItems onSupportChat={handleSupportChat} menu={menu} />
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/" className="flex items-center gap-2.5">
            <LissajousLogo size={24} animated color={theme.logoColor} />
            <span
              className="text-[20px] tracking-tight whitespace-nowrap font-sf font-normal"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              NeuroTunes
            </span>
          </Link>

          <div className="flex items-center gap-2.5 ml-3 pl-4 border-l" style={{ borderColor: theme.divider }}>
            <span className="text-[10px] tracking-wider" style={{ color: theme.mutedText }}>Distributed by</span>
            <img src={theme.welconyLogo} alt="Welcony" className="h-6" style={{ opacity: 0.85 }} />
          </div>
        </div>

        {/* Right cluster: login · CTA */}
        <div className="flex items-center gap-4">
          <Link
            to="/auth"
            className={`px-5 py-2 rounded-full transition-all duration-300 text-[13px] font-normal ${theme.loginHover}`}
            style={{ border: theme.loginBorder, color: theme.textColor }}
          >
            Login
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
            className="px-6 py-2.5 rounded-full text-white hover:opacity-90 transition-all duration-200 text-[13px] font-normal"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              boxShadow: '0 0 20px hsla(190, 80%, 45%, 0.3)',
            }}
          >
            Request Access
          </button>
        </div>
      </header>

      {/* ━━━ Mobile ━━━ */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 z-50"
        style={{
          background: theme.bg,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          borderBottom: theme.border,
          boxShadow: theme.shadow,
        }}
      >
        {/* Left: menu + logo only */}
        <div className="flex items-center gap-3">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger className="p-2 -ml-1 rounded-lg transition-colors" style={{ color: theme.iconColor }}>
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-64 z-[9999] ${menu.content}`}>
              <MenuItems onSupportChat={handleSupportChat} menu={menu} />
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/" className="flex items-center gap-2">
            <LissajousLogo size={20} animated color={theme.logoColor} />
            <span
              className="text-[16px] tracking-tight whitespace-nowrap font-sf font-normal"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              NeuroTunes
            </span>
          </Link>
        </div>

        {/* Right: single CTA */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
          className="px-4 py-2 rounded-full text-white text-[12px] font-normal"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            boxShadow: '0 0 14px hsla(190, 80%, 45%, 0.25)',
          }}
        >
          Request Access
        </button>
      </header>
    </>
  );
};
