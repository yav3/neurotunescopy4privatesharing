import { Home, Heart, User, Target, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (tab: any) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Touch gesture support for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    // Basic swipe detection for tab navigation (horizontal swipes)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const currentIndex = tabs.findIndex(tab => tab.id === getCurrentActiveTab());
      if (diffX > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - next tab
        handleTabClick(tabs[currentIndex + 1]);
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe right - previous tab  
        handleTabClick(tabs[currentIndex - 1]);
      }
    }

    setTouchStart(null);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const getCurrentActiveTab = () => {
    if (activeTab) return activeTab;
    const currentPath = location.pathname;
    
    // Check for goals-related paths - they all go to home since home shows goals now
    if (currentPath.startsWith('/goals')) return "home";
    if (currentPath.startsWith('/genre')) return "home"; // Genre view is part of goals flow
    
    const currentTab = tabs.find(tab => tab.path === currentPath);
    return currentTab?.id || "home";
  };

  return (
    <nav className="relative" 
         onTouchStart={handleTouchStart} 
         onTouchEnd={handleTouchEnd}>
      {/* Mobile-first responsive navigation container */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 shadow-glass-lg">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
        
        {/* Mobile hamburger menu (hidden on larger screens) */}
        <div className="block sm:hidden px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium font-sf">Navigate</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="text-white/80 hover:text-white transition-colors p-2"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-white/10 shadow-glass-lg z-50">
              <div className="px-4 py-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = getCurrentActiveTab() === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        "w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-300",
                        "hover:bg-white/10 active:scale-95",
                        isActive 
                          ? "text-white bg-white/15 backdrop-blur-md border border-white/20" 
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium font-sf">{tab.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white/60 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop/tablet horizontal navigation (hidden on mobile) */}
        <div className="hidden sm:flex justify-around items-center max-w-md mx-auto px-2 py-3 md:px-4 relative z-10">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = getCurrentActiveTab() === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-2.5 px-3 md:px-4 transition-all duration-300 min-w-0 rounded-xl",
                  // Enhanced touch targets for tablets
                  "min-h-[60px] md:min-h-auto",
                  "hover:bg-white/10 active:scale-95",
                  isActive 
                    ? "text-white bg-white/15 backdrop-blur-md border border-white/20 shadow-glass-inset" 
                    : "text-white/70 hover:text-white hover:bg-white/8"
                )}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon with glassmorphism background */}
                <div className={cn(
                  "relative transition-all duration-300",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-sm scale-150" />
                  )}
                </div>
                
                {/* Responsive label with San Francisco font */}
                <span className={cn(
                  "font-medium truncate max-w-full font-sf transition-all duration-300",
                  // Responsive text sizing using clamp
                  isActive ? "text-white font-semibold" : "text-white/80"
                )}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  {tab.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-60" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom glow line (only on larger screens) */}
        <div className="hidden sm:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </nav>
  );
};