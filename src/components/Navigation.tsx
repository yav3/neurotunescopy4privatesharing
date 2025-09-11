import { Home, Heart, User, Target } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (tab: any) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

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
    <nav className="relative">
      {/* Glassmorphism navigation container */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 px-2 py-3 sm:px-4 md:px-8 shadow-glass-lg">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
        
        <div className="flex justify-around items-center max-w-md mx-auto relative z-10">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = getCurrentActiveTab() === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-2.5 px-3 sm:px-4 transition-all duration-300 min-w-0 rounded-xl",
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
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-sm scale-150" />
                  )}
                </div>
                
                {/* Label with San Francisco font */}
                <span className={cn(
                  "text-xs font-medium truncate max-w-full font-sf transition-all duration-300",
                  isActive ? "text-white font-semibold" : "text-white/80"
                )}>
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
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </nav>
  );
};