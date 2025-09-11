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
      <div className="bg-background/95 backdrop-blur-sm">
        
        {/* Mobile hamburger menu (hidden on larger screens) */}
        <div className="block sm:hidden px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground font-medium">Navigate</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
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
                        "hover:bg-muted/20 active:scale-95",
                        isActive 
                          ? "text-foreground bg-muted/30" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop/tablet horizontal navigation (hidden on mobile) */}
        <div className="hidden sm:flex justify-center items-center gap-8 max-w-md mx-auto px-2 py-4 relative z-10">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = getCurrentActiveTab() === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "flex items-center justify-center p-3 transition-all duration-200 rounded-full",
                  "hover:bg-muted/20 active:scale-95",
                  isActive 
                    ? "text-foreground bg-muted/30" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};