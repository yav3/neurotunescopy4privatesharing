import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_CATEGORIES } from '@/config/therapeuticCategories';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';

const Index = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  const handleGoalSelect = (category: typeof THERAPEUTIC_CATEGORIES[0]) => {
    console.log('🎯 Navigating to genre selection for category:', category.name);
    try {
      navigate(`/goals/${category.id}/genres`);
    } catch (error) {
      console.error('❌ Error navigating to genre selection:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5" />
            NeuroTunes
          </h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggle} 
            className="p-2 hover:bg-accent rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {THERAPEUTIC_CATEGORIES.map((category, index) => (
            <Card 
              key={category.id}
              className="relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl shadow-lg"
              onClick={() => handleGoalSelect(category)}
            >
              {/* Background Image */}
              <div className="relative h-48">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Category Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl leading-tight drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-sm border-t bg-background/95 border-border">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;