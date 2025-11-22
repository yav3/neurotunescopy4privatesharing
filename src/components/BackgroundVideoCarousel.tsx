import React from 'react';

export const BackgroundVideoCarousel = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Static Obsidian Gradient Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-obsidian via-obsidian/95 to-obsidian" />
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-obsidian/90 via-transparent to-obsidian/40 pointer-events-none" />
      
      {/* Depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian/80 pointer-events-none" />
    </div>
  );
};
