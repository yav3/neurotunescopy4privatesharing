import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DevDebugPanel } from "@/components/DevDebugPanel";
import { NowPlaying } from "@/components/NowPlaying";
import { MusicPlayer } from "@/components/MusicPlayer";
import { TherapeuticDebugPanel } from "@/components/TherapeuticDebugPanel";
import MusicDeliveryStatus from "@/components/MusicDeliveryStatus";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import { initializeDebugging } from "@/utils/debugInit";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { AuthPage } from "@/components/auth/AuthPage";
import { LandingPage } from "@/components/LandingPage";
import NeuralPositiveLanding from "@/components/NeuralPositiveLanding";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
// Import test utilities for global access
import "@/utils/testPlaybackInvariants";
import "@/utils/fixApiConfig";
import "@/utils/audioStoreTest";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import AIDJ from "./pages/AIDJ";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import DataMonitoring from "./pages/admin/DataMonitoring";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuthContext();
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
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
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }
    return (
      <NeuralPositiveLanding 
        onSignIn={() => setShowAuth(true)} 
        onGetStarted={() => setShowAuth(true)} 
      />
    );
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
              <Route path="/ai-dj" element={<AIDJ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/landing" element={<LandingPage onLogin={() => setShowAuth(true)} onSignup={() => setShowAuth(true)} />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="monitoring" element={<DataMonitoring />} />
              </Route>
              <Route path="*" element={<Index />} />
            </Routes>
            
            {/* Global Music Players - Always available */}
            <NowPlaying />
            <MusicPlayer open={showMusicPlayer} onOpenChange={setShowMusicPlayer} />
          </div>
          <DevDebugPanel />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
