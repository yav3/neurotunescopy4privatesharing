import { Home, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab = "home", onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "ai-dj", label: "AI DJ", icon: Music },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-4 py-2 md:px-8">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};