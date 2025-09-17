import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DevDebugPanel } from "@/components/DevDebugPanel";
import { FullPagePlayer } from "@/components/FullPagePlayer";
import { MinimizedPlayer } from "@/components/MinimizedPlayer";
import { TherapeuticDebugPanel } from "@/components/TherapeuticDebugPanel";
import MusicDeliveryStatus from "@/components/MusicDeliveryStatus";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import { initializeDebugging } from "@/utils/debugInit";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { AuthPage } from "@/components/auth/AuthPage";
import { LandingPage } from "@/components/LandingPage";
import NeuralPositiveLanding from "@/components/NeuralPositiveLanding";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useAudioStore } from "@/stores";
// Import test utilities for global access
import "@/utils/testPlaybackInvariants";
import "@/utils/fixApiConfig";
import "@/utils/audioStoreTest";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import GenreView from "./pages/GenreView";
import AIDJ from "./pages/AIDJ";
import GenreSelectionPage from "./pages/GenreSelectionPage";
import { MagicAuth } from "./pages/MagicAuth";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import DataMonitoring from "./pages/admin/DataMonitoring";
import { MagicLinksPage } from "./pages/admin/MagicLinks";
import { ConnectionDiagnostics } from "./components/ConnectionDiagnostics";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuthContext();
  const { currentTrack, playerMode } = useAudioStore();
  const [showAuth, setShowAuth] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Handle unauthenticated password reset routes
    const currentPath = window.location.pathname;
    if (currentPath === '/reset-password' || currentPath === '/verify') {
      return <ResetPasswordForm />;
    }
    
    // Show auth page if explicitly requested
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }
    
    // For unauthenticated users, show the main app with limited features
    // They can access therapeutic music but not personalization features
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/debug" element={<ConnectionDiagnostics />} />
              <Route path="/goals/:goalId/genres" element={<GenreSelectionPage />} />
              <Route path="/ai-dj" element={<AIDJ />} />
              <Route path="/genre/:goalId/:genreId" element={<GenreView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/landing" element={<LandingPage onLogin={() => setShowAuth(true)} onSignup={() => setShowAuth(true)} />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="magic-links" element={<MagicLinksPage />} />
                <Route path="magic-auth" element={<MagicAuth />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="monitoring" element={<DataMonitoring />} />
              </Route>
              <Route path="*" element={<Index />} />
            </Routes>
            
            {/* Global Music Players - Always show MinimizedPlayer, show full player when in full mode */}
            {playerMode === 'full' && <FullPagePlayer />}
            {playerMode !== 'full' && <MinimizedPlayer />}
            
            {/* Enhanced debug info */}
            {!currentTrack && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-[9998]">
                No currentTrack
              </div>
            )}
            {currentTrack && !playerMode && (
              <div className="fixed bottom-4 right-4 bg-yellow-500 text-black p-2 rounded text-xs z-[9998]">
                No playerMode set
              </div>
            )}
            {currentTrack && playerMode && (
              <div className="fixed bottom-4 left-4 bg-green-500 text-white p-2 rounded text-xs z-[9998] max-w-xs">
                Track: {currentTrack.title?.substring(0, 20)}... | Mode: {playerMode}
              </div>
            )}
          </div>
          <DevDebugPanel />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
