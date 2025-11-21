import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Plus } from "lucide-react";
import dropdownBg from "@/assets/dropdown-bg.png";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 relative">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <Plus 
              className="w-8 h-8 text-cyan-400/80" 
              strokeWidth={2}
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">
                  Products & Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div 
                    className="w-[900px] p-8 relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${dropdownBg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Three Main Pathways */}
                      <div className="grid grid-cols-3 gap-8 mb-8">
                        {/* Enterprise & Corporate */}
                        <div className="space-y-4">
                          <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                            Enterprise & Corporate
                          </h2>
                          <div className="space-y-2">
                            <Link
                              to="/products/environmental"
                              className="block p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                            >
                              <span className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors block mb-1">
                                Environmental & Background Music
                              </span>
                              <span className="text-xs text-muted-foreground">
                                PRO-free music for facilities & retail
                              </span>
                            </Link>
                            <Link
                              to="/products/population-health"
                              className="block p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                            >
                              <span className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors block mb-1">
                                Population Health Programs
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Clinical-grade music at scale
                              </span>
                            </Link>
                            <Link
                              to="/products/enterprise-wellness"
                              className="block p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                            >
                              <span className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors block mb-1">
                                Corporate Wellness
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Workplace mental health & productivity
                              </span>
                            </Link>
                          </div>
                        </div>

                        {/* Wellness Apps */}
                        <div className="space-y-4">
                          <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                            Wellness Apps
                          </h2>
                          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                            <p className="text-sm text-muted-foreground/90 mb-3">
                              Subscribe to the Web App or get the iOS/Android app
                            </p>
                            <Link to="/products/consumer" className="block mb-2">
                              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                                Personal Wellness App
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* APIs & Partnerships */}
                        <div className="space-y-4">
                          <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                            APIs & Partnerships
                          </h2>
                          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                            <p className="text-sm text-muted-foreground/90 mb-3">
                              White-label, OEM, and platform integration
                            </p>
                            <Link to="/products/partnerships" className="block mb-2">
                              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                                Explore Partnerships
                              </Button>
                            </Link>
                            <Link to="/contact">
                              <Button size="sm" variant="outline" className="w-full">
                                Chat with AI Assistant
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-primary/10">
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-lg mb-2 text-foreground">View All Products & Solutions</h4>
                              <p className="text-sm text-muted-foreground/90">
                                Explore our complete product lineup
                              </p>
                            </div>
                            <Link to="/products">
                              <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                View All →
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/how-it-works" className="text-base hover:text-primary transition-colors">
            How it works
          </Link>
          <Link to="/licensing" className="text-base hover:text-primary transition-colors">
            Licensing
          </Link>
          <Link to="/pricing" className="text-base hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-base hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/demo">
            <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-6">
              See Samples
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <Link to="/" className="flex items-center">
          <Plus 
            className="w-7 h-7 text-cyan-400/80" 
            strokeWidth={2}
          />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="w-6 h-0.5 bg-foreground" />
              <div className="w-6 h-0.5 bg-foreground" />
              <div className="w-6 h-0.5 bg-foreground" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-background z-40 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Enterprise & Corporate */}
            <div>
              <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                Enterprise & Corporate
              </h2>
              <div className="space-y-2">
                <Link
                  to="/products/environmental"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground block mb-1">
                    Environmental & Background Music
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PRO-free music for facilities & retail
                  </span>
                </Link>
                <Link
                  to="/products/population-health"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground block mb-1">
                    Population Health Programs
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Clinical-grade music at scale
                  </span>
                </Link>
                <Link
                  to="/products/enterprise-wellness"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground block mb-1">
                    Corporate Wellness
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Workplace mental health & productivity
                  </span>
                </Link>
              </div>
            </div>

            {/* Wellness Apps */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h2 className="font-bold text-lg mb-2 text-foreground">Wellness Apps</h2>
              <p className="text-sm text-muted-foreground mb-3">Subscribe to the Web App or get the iOS/Android app</p>
              <Link to="/products/consumer" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Personal Wellness App</Button>
              </Link>
            </div>

            {/* APIs & Partnerships */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h2 className="font-bold text-lg mb-2 text-foreground">APIs & Partnerships</h2>
              <p className="text-sm text-muted-foreground mb-3">White-label, OEM, and platform integration</p>
              <Link to="/products/partnerships" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mb-2">Explore Partnerships</Button>
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Chat with AI Assistant</Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-border">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full mb-4">View All Products & Solutions →</Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                How it works
              </Link>
              <Link
                to="/licensing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Licensing
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Log in
              </Link>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h4 className="font-semibold mb-2">Talk to Sales</h4>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Chat to Sales Assistant</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
