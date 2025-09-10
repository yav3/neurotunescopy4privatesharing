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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-2 py-2 sm:px-4 md:px-8">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = getCurrentActiveTab() === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-2 sm:px-3 transition-colors duration-200 min-w-0",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};