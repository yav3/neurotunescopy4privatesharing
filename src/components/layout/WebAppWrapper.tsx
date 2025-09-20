import React from 'react';

interface WebAppWrapperProps {
  children: React.ReactNode;
}

// Simple responsive wrapper for web apps
export const WebAppWrapper: React.FC<WebAppWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-screen-2xl">
        {children}
      </div>
    </div>
  );
};