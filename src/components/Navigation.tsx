import { Home, User, BarChart3, HelpCircle, Headphones } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { VoiceActivationButton } from "./VoiceActivationButton";
import { VoiceCommandProcessor } from "@/utils/VoiceActivation";
import { useEffect, useRef } from "react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuthContext();
  const voiceProcessorRef = useRef<VoiceCommandProcessor | null>(null);

  useEffect(() => {
    voiceProcessorRef.current = new VoiceCommandProcessor(navigate);
    return () => {
      voiceProcessorRef.current?.stop();
    };
  }, [navigate]);

  const handleVoiceToggle = (enabled: boolean) => {
    if (enabled) {
      voiceProcessorRef.current?.start();
      voiceProcessorRef.current?.speak('Voice commands are now active.');
    } else {
      voiceProcessorRef.current?.stop();
    }
  };

  const isSupported = voiceProcessorRef.current?.isSupported() ?? false;
  
  const tabs = [
    { id: "home", icon: Home, path: "/" },
    { id: "faq", icon: HelpCircle, path: "/faq" },
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
    <div className="space-y-4">
      {/* Voice Activation - Compact version for navigation */}
      <div className="px-4 sm:px-6">
        <div className="max-w-sm mx-auto">
          <VoiceActivationButton
            onToggle={handleVoiceToggle}
            isSupported={isSupported}
            className="scale-90"
          />
        </div>
      </div>
      
      {/* Navigation Bar */}
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
                "hover:bg-foreground/10 active:scale-95 min-w-[44px] min-h-[44px]",
                isActive 
                  ? "text-foreground bg-foreground/20" 
                  : "text-foreground/70 hover:text-foreground"
              )}
              title={`Navigate to ${tab.id}`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          );
        })}
        
        {/* Analytics navigation for VIP members */}
        {hasRole(['premium_user', 'moderator', 'admin', 'super_admin']) && (
          <button
            onClick={() => handleTabClick({ id: "analytics", path: "/analytics" })}
            className={cn(
              "flex items-center justify-center p-2.5 sm:p-3 transition-all duration-200 rounded-full",
              "hover:bg-foreground/10 active:scale-95 min-w-[44px] min-h-[44px]",
              location.pathname === "/analytics"
                ? "text-foreground bg-foreground/20" 
                : "text-foreground/70 hover:text-foreground"
            )}
            title="Analytics Dashboard"
          >
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>
    </nav>
    </div>
  );
};