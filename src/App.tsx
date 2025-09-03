import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DevDebugPanel } from "@/components/DevDebugPanel";
import { NowPlaying } from "@/components/NowPlaying";
import MusicDeliveryStatus from "@/components/MusicDeliveryStatus";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import { initializeDebugging } from "@/utils/debugInit";
// Import test utilities for global access
import "@/utils/testPlaybackInvariants";
import "@/utils/fixApiConfig";
import "@/utils/audioStoreTest";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIDJPage from "./pages/AIDJPage";
import { UnifiedDashboard } from "./pages/UnifiedDashboard";
import PlayerPage from "./pages/PlayerPage";
import AudioDiagnostics from "./pages/AudioDiagnostics";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeDebugging();
    
    // Force cleanup any old audio elements on page load  
    const cleanup = () => {
      // Remove old audio elements if they exist
      const oldAudio = document.getElementById('np-audio');
      if (oldAudio) {
        oldAudio.remove();
        console.log('🧹 Cleaned up old np-audio element');
      }
    };
    
    cleanup();
    
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ai-dj" element={<AIDJPage />} />
              <Route path="/profile" element={<UnifiedDashboard />} />
              <Route path="/player" element={<PlayerPage />} />
              <Route path="/diagnostics/audio" element={<AudioDiagnostics />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Global Music Player - Always visible when music is playing */}
            <NowPlaying />
          </div>
          <DevDebugPanel />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
