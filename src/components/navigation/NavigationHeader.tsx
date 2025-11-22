import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronDown } from "lucide-react";
import headerChromeTexture from '@/assets/header-chrome-texture.png';

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

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

        {/* Center: Menu Items with Dropdown */}
        <nav className="flex items-center gap-6 lg:gap-8 relative z-10">
          <Link to="/demo">
            <button className="px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-xs lg:text-sm font-medium transition-all bg-obsidian/85 border border-platinum-glow/18 text-platinum-glow/90 shadow-[0_0_24px_rgba(228,228,228,0.10),inset_0_1px_0_rgba(228,228,228,0.06)] hover:bg-obsidian-graphite/90 hover:border-platinum-glow/32 hover:shadow-[0_0_40px_rgba(228,228,228,0.18),inset_0_1px_0_rgba(228,228,228,0.10)]">
              Hear Demo
            </button>
          </Link>

          {/* Products & Solutions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <button 
              className="text-sm lg:text-base font-light transition-colors text-platinum-glow/88 hover:text-platinum-glow flex items-center gap-1.5"
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
            >
              Products & Solutions
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {productsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-[100] overflow-hidden">
                <div className="py-2">
                  <Link
                    to="/products/environmental"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    Environmental & Background
                  </Link>
                  <Link
                    to="/products/population-health"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    Enterprise Population Health
                  </Link>
                  <Link
                    to="/products/enterprise-wellness"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    Enterprise Wellness
                  </Link>
                  <Link
                    to="/app-download"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    Personal Wellness App
                  </Link>
                  <Link
                    to="/products/partnerships"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    Partnerships & Integration
                  </Link>
                  <div className="h-px bg-white/10 my-2 mx-4" />
                  <Link
                    to="/products"
                    className="block px-5 py-3 text-sm font-light text-platinum-glow/85 hover:text-platinum-glow hover:bg-white/5 transition-all"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
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

      {/* Mobile Menu with Expandable Products */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 overflow-y-auto bg-gradient-to-br from-obsidian/98 to-obsidian-graphite">
          <div className="p-6 space-y-6">
            {/* Products & Solutions - Expandable */}
            <div>
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className="flex items-center justify-between w-full text-lg font-light text-white/90 hover:text-white"
              >
                Products & Solutions
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {productsDropdownOpen && (
                <div className="mt-3 ml-4 space-y-3 border-l border-white/10 pl-4">
                  <Link
                    to="/products/environmental"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    Environmental & Background
                  </Link>
                  <Link
                    to="/products/population-health"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    Enterprise Population Health
                  </Link>
                  <Link
                    to="/products/enterprise-wellness"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    Enterprise Wellness
                  </Link>
                  <Link
                    to="/app-download"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    Personal Wellness App
                  </Link>
                  <Link
                    to="/products/partnerships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    Partnerships & Integration
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-light text-white/75 hover:text-white"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>

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
