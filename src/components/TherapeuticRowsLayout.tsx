import React from 'react';
import { TherapeuticRow } from './TherapeuticRow';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { cn } from '@/lib/utils';

// Add scrollbar hide styles to index.css instead
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('scrollbar-hide-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'scrollbar-hide-styles';
    style.textContent = scrollbarHideStyles;
    document.head.appendChild(style);
  }
}

interface TherapeuticRowsLayoutProps {
  className?: string;
}

export const TherapeuticRowsLayout: React.FC<TherapeuticRowsLayoutProps> = ({ className }) => {
  return (
    <section className={cn("px-4 md:px-8 mb-24", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Therapeutic Music Library
          </h1>
          <p className="text-muted-foreground">
            Explore our curated collection of therapeutic music organized by mood and purpose
          </p>
        </div>
        
        {/* Therapeutic rows */}
        <div className="space-y-8">
          {THERAPEUTIC_GOALS.map((goal) => (
            <TherapeuticRow 
              key={goal.id} 
              goal={goal} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};