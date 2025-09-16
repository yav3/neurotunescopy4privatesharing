import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSimpleAudioStore } from "@/stores/simpleAudioStore";
import { SimplePlayer } from "@/components/SimplePlayer";
import { TestStoragePage } from "@/pages/TestStoragePage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const { currentTrack, playerMode } = useSimpleAudioStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/test-storage" element={<TestStoragePage />} />
              <Route path="*" element={<Index />} />
            </Routes>
            
            {/* Simple Music Player - ALWAYS shows when track is available */}
            <SimplePlayer />
            
            {/* Debug info */}
            {currentTrack && (
              <div className="fixed bottom-24 left-4 bg-green-500 text-white p-2 rounded text-xs z-[9998] max-w-xs">
                Playing: {currentTrack.title?.substring(0, 30)}...
              </div>
            )}
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;