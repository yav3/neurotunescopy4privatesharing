import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

// Simple responsive grid component for therapy cards
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={cn(
      "grid gap-4 p-4",
      "grid-cols-2", 
      "sm:grid-cols-3", 
      "lg:grid-cols-4", 
      "xl:grid-cols-6",
      className
    )}>
      {children}
    </div>
  );
};