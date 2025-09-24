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
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AdvancedAuthGuard } from "@/components/security/AdvancedAuthGuard";
import { useAudioStore } from "@/stores";
import { AccessTrackingProvider } from "@/components/analytics/AccessTrackingProvider";
// Import test utilities for global access
import "@/utils/testPlaybackInvariants";
import "@/utils/fixApiConfig";
import "@/utils/audioStoreTest";
import Index from "./pages/Index";
import TherapeuticGoalsPage from "./pages/TherapeuticGoalsPage";
import Profile from "./pages/Profile";
import GenreView from "./pages/GenreView";
import { MagicAuth } from "./pages/MagicAuth";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import DataMonitoring from "./pages/admin/DataMonitoring";
import Storage from "./pages/Storage";
import Monitoring from "./pages/Monitoring";
import Settings from "./pages/Settings";
import AnalyticsPage from "./pages/Analytics";
import { MagicLinksPage } from "./pages/admin/MagicLinks";
import { ConnectionDiagnostics } from "./components/ConnectionDiagnostics";
import StorageManager from "./pages/StorageManager";
import Users from "./pages/admin/Users";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuthContext();
  const { currentTrack, playerMode } = useAudioStore();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    initializeDebugging();
    
    // Only cleanup old audio elements if they're not playing
    const cleanup = () => {
      const oldAudio = document.getElementById('np-audio') as HTMLAudioElement;
      if (oldAudio) {
        const isPlaying = !oldAudio.paused && !oldAudio.ended && oldAudio.currentTime > 0;
        if (!isPlaying) {
          oldAudio.remove();
          console.log('🧹 Cleaned up old np-audio element');
        } else {
          console.log('🎵 Preserving playing np-audio element');
        }
      }
    };
    
    cleanup();
    
    // Don't cleanup on unmount to preserve audio across navigation
    // return cleanup;
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
  // But don't redirect if we're still loading auth state
  if (!user && !loading) {
    // Handle unauthenticated password reset routes
    const currentPath = window.location.pathname;
    if (currentPath === '/reset-password' || currentPath === '/verify') {
      return <ResetPasswordForm />;
    }
    
    // Force authentication - no access to app without login
    return <AuthPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AccessTrackingProvider>
            <Toaster />
            <Sonner />
            <div className="relative min-h-screen">
              <Routes>
                <Route path="/" element={<AdvancedAuthGuard><TherapeuticGoalsPage /></AdvancedAuthGuard>} />
                <Route path="/goals" element={<AdvancedAuthGuard><TherapeuticGoalsPage /></AdvancedAuthGuard>} />
                <Route path="/debug" element={<AdvancedAuthGuard><ConnectionDiagnostics /></AdvancedAuthGuard>} />
                <Route path="/genre/:goalId/:genreId" element={<AdvancedAuthGuard><GenreView /></AdvancedAuthGuard>} />
                <Route path="/profile" element={<AdvancedAuthGuard><Profile /></AdvancedAuthGuard>} />
                <Route path="/landing" element={<AdvancedAuthGuard><Index /></AdvancedAuthGuard>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/storage" element={<AdvancedAuthGuard><Storage /></AdvancedAuthGuard>} />
                <Route path="/monitoring" element={<AdvancedAuthGuard><Monitoring /></AdvancedAuthGuard>} />
                <Route path="/settings" element={<AdvancedAuthGuard><Settings /></AdvancedAuthGuard>} />
                <Route path="/analytics" element={<AdvancedAuthGuard><AnalyticsPage /></AdvancedAuthGuard>} />
                <Route path="/admin" element={<AdvancedAuthGuard adminOnly><AdminLayout /></AdvancedAuthGuard>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="magic-links" element={<MagicLinksPage />} />
                  <Route path="magic-auth" element={<MagicAuth />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<SystemSettings />} />
                  <Route path="monitoring" element={<DataMonitoring />} />
                  <Route path="storage" element={<StorageManager />} />
                </Route>
                <Route path="*" element={<AdvancedAuthGuard><TherapeuticGoalsPage /></AdvancedAuthGuard>} />
              </Routes>
              
              {/* Global Music Players - Show full player by default, minimized when explicitly minimized */}
              {playerMode === 'full' ? <FullPagePlayer /> : <MinimizedPlayer />}
              
            </div>
            <DevDebugPanel />
          </AccessTrackingProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
