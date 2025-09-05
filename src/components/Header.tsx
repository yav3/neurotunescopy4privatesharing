import React from "react";

export const Header = () => {
  return (
    <header className="px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2">NeuroTunes</h1>
        <p className="text-sm text-muted-foreground">please select your therapeutic goal</p>
      </div>
    </header>
  );
};