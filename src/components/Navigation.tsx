import { Home, User } from "lucide-react";
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
    { id: "home", icon: Home, path: "/" },
    { id: "profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (tab: any) => {
    console.log('🎯 Navigation: Attempting to navigate to:', tab.path, 'from:', location.pathname);
    try {
      navigate(tab.path);
      console.log('✅ Navigation: Successfully called navigate()');
      onTabChange?.(tab.id);
    } catch (error) {
      console.error('❌ Navigation: Error during navigate():', error);
    }
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
    <nav className="px-4 sm:px-6 py-3 sm:py-4">
      {/* Simple icon-only navigation */}
      <div className="flex justify-center items-center gap-8 sm:gap-12">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = getCurrentActiveTab() === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "flex items-center justify-center p-2.5 sm:p-3 transition-all duration-200 rounded-full",
                "hover:bg-white/10 active:scale-95 min-w-[44px] min-h-[44px]",
                isActive 
                  ? "text-white bg-white/20" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};