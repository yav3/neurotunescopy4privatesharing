import { cn } from "@/lib/utils";

interface TrendingTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TrendingTabs = ({ activeTab = "goals", onTabChange }: TrendingTabsProps) => {
  const tabs = ["Goals", "Sessions", "Data"];

  return (
    <section className="px-4 md:px-8 mb-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-4">Trending</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.toLowerCase();
            
            return (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab.toLowerCase())}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};