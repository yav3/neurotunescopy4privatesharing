import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Responsive container component
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={cn(
      "w-full px-4 mx-auto",
      "sm:px-6",
      "lg:px-8",
      "max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
};