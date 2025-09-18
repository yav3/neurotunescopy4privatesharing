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
import { MagicAuth } from "./pages/MagicAuth";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import DataMonitoring from "./pages/admin/DataMonitoring";
import { MagicLinksPage } from "./pages/admin/MagicLinks";
import { ConnectionDiagnostics } from "./components/ConnectionDiagnostics";
import StorageManager from "./pages/StorageManager";

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

  // ENFORCE AUTHENTICATION: No anonymous usage allowed
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
    
    // FORCE ALL users to authenticate - landing page is only for signup/login
    return <LandingPage onLogin={() => setShowAuth(true)} onSignup={() => setShowAuth(true)} />;
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
              <Route path="/genre/:goalId/:genreId" element={<GenreView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/landing" element={<LandingPage onLogin={() => setShowAuth(true)} onSignup={() => setShowAuth(true)} />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="magic-links" element={<MagicLinksPage />} />
                <Route path="magic-auth" element={<MagicAuth />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="monitoring" element={<DataMonitoring />} />
                <Route path="storage" element={<StorageManager />} />
              </Route>
              <Route path="*" element={<Index />} />
            </Routes>
            
            {/* Global Music Players - Show full player by default, minimized when explicitly minimized */}
            {playerMode === 'full' ? <FullPagePlayer /> : <MinimizedPlayer />}
            
          </div>
          <DevDebugPanel />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
