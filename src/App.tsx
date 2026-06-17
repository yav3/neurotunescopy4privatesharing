import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FullPagePlayer } from "@/components/FullPagePlayer";
import { MinimizedPlayer } from "@/components/MinimizedPlayer";
import { TherapeuticDebugPanel } from "@/components/TherapeuticDebugPanel";
import MusicDeliveryStatus from "@/components/MusicDeliveryStatus";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import { initializeDebugging } from "@/utils/debugInit";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { AuthPage } from "@/components/auth/AuthPage";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AdvancedAuthGuard } from "@/components/security/AdvancedAuthGuard";
import { useAudioStore } from "@/stores";
import { GlobalSessionTracker } from "@/components/GlobalSessionTracker";
import { AccessTrackingProvider } from "@/components/analytics/AccessTrackingProvider";
import { useComprehensiveTracking } from "@/hooks/useComprehensiveTracking";
// Import test utilities for global access
import "@/utils/testPlaybackInvariants";
import "@/utils/fixApiConfig";
// Preload artwork service early for faster rendering
import { ArtworkService } from "@/services/artworkService";
ArtworkService.preloadArtwork();

// Critical path — eagerly loaded (on the main navigation flow)
import Index from "./pages/Index";
import TherapeuticGoalsPage from "./pages/TherapeuticGoalsPage";
import Profile from "./pages/Profile";
import GenreView from "./pages/GenreView";
import Demo from "./pages/Demo";
import Experience from "./pages/Experience";
import { MagicAuth } from "./pages/MagicAuth";
import { AdminLayout } from "./components/admin/AdminLayout";
import { SupportChat } from "./components/SupportChat";

// Non-critical — lazily loaded to split the initial JS bundle
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const ContentManagement = React.lazy(() => import("./pages/admin/ContentManagement"));
const AdminAnalytics = React.lazy(() => import("./pages/admin/Analytics"));
const SystemSettings = React.lazy(() => import("./pages/admin/SystemSettings"));
const DataMonitoring = React.lazy(() => import("./pages/admin/DataMonitoring"));
const UserEngagement = React.lazy(() => import("./pages/admin/UserEngagement"));
const Users = React.lazy(() => import("./pages/admin/Users"));
const MagicLinksPage = React.lazy(() => import("./pages/admin/MagicLinks").then(m => ({ default: m.MagicLinksPage })));
const StorageManager = React.lazy(() => import("./pages/StorageManager"));
const Storage = React.lazy(() => import("./pages/Storage"));
const Monitoring = React.lazy(() => import("./pages/Monitoring"));
const Settings = React.lazy(() => import("./pages/Settings"));
const UserAnalytics = React.lazy(() => import("./pages/Analytics"));
const ConnectionDiagnostics = React.lazy(() => import("./components/ConnectionDiagnostics").then(m => ({ default: m.ConnectionDiagnostics })));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const AboutNeuralPositive = React.lazy(() => import("./pages/AboutNeuralPositive").then(m => ({ default: m.AboutNeuralPositive })));
const CompanyStory = React.lazy(() => import("./pages/CompanyStory").then(m => ({ default: m.CompanyStory })));
const ResearchPage = React.lazy(() => import("./pages/ResearchPage").then(m => ({ default: m.ResearchPage })));
const Support = React.lazy(() => import("./pages/Support"));
const ProductsOverview = React.lazy(() => import("./pages/ProductsOverview").then(m => ({ default: m.ProductsOverview })));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const Legal = React.lazy(() => import("./pages/Legal"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Cookies = React.lazy(() => import("./pages/Cookies"));
const Payments = React.lazy(() => import("./pages/Payments"));
const EnvironmentalBackground = React.lazy(() => import("./pages/products/EnvironmentalBackground"));
const PopulationHealth = React.lazy(() => import("./pages/products/PopulationHealth"));
const Partnerships = React.lazy(() => import("./pages/products/Partnerships"));
const EnterpriseWellness = React.lazy(() => import("./pages/products/EnterpriseWellness"));
const EnterpriseWellnessTrial = React.lazy(() => import("./pages/products/EnterpriseWellnessTrial"));
const Story = React.lazy(() => import("./pages/Story"));
const Team = React.lazy(() => import("./pages/Team"));
const WhitePapers = React.lazy(() => import("./pages/WhitePapers"));
const Evidence = React.lazy(() => import("./pages/Evidence"));
const Press = React.lazy(() => import("./pages/Press"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Library = React.lazy(() => import("./pages/Library"));
const Download = React.lazy(() => import("./pages/Download"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Help = React.lazy(() => import("./pages/Help"));
const ConsumerPricing = React.lazy(() => import("./pages/ConsumerPricing"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const ClinicalPricing = React.lazy(() => import("./pages/ClinicalPricing"));
const HIPAA = React.lazy(() => import("./pages/HIPAA"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = React.lazy(() => import("./pages/PaymentCancelled"));
const BlackFriday = React.lazy(() => import("./pages/BlackFriday"));
const CapabilityBrief = React.lazy(() => import("./pages/CapabilityBrief"));

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const { currentTrack, playerMode } = useAudioStore();

  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    
    initializeDebugging();
    
    // Only cleanup old audio elements if they're not playing
    const cleanup = () => {
      const oldAudio = document.getElementById('np-audio') as HTMLAudioElement;
      if (oldAudio) {
        const isPlaying = !oldAudio.paused && !oldAudio.ended && oldAudio.currentTime > 0;
        if (!isPlaying) {
          oldAudio.remove();
        }
      }
    };
    
    cleanup();
    
    // Don't cleanup on unmount to preserve audio across navigation
    // return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AccessTrackingProvider>
            <GlobalSessionTracker />
            <Toaster />
            <Sonner />
            <AppContent />
          </AccessTrackingProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// This component can safely use useAuthContext since it's inside the AuthProvider
const AppContent = () => {
  const { user, loading } = useAuthContext();
  const { currentTrack, playerMode } = useAudioStore();
  const navigate = useNavigate();
  
  // Initialize comprehensive user behavior tracking
  useComprehensiveTracking();

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

  return (
    <div className="relative min-h-screen bg-background">
      <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        {/* Root path - land directly on the immersive music experience */}
        <Route path="/" element={<Demo />} />
        <Route path="/landing" element={<Index />} />
        <Route path="/index" element={<Index />} />
        
        
        <Route path="/products" element={<ProductsOverview />} />
        <Route path="/products/environmental" element={<EnvironmentalBackground />} />
        <Route path="/products/enterprise-wellness" element={<EnterpriseWellness />} />
        <Route path="/products/enterprise-wellness/trial" element={<EnterpriseWellnessTrial />} />
        <Route path="/products/population-health" element={<PopulationHealth />} />
        <Route path="/products/partnerships" element={<Partnerships />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/goals" element={<AdvancedAuthGuard><TherapeuticGoalsPage /></AdvancedAuthGuard>} />
        <Route path="/debug" element={<AdvancedAuthGuard><ConnectionDiagnostics /></AdvancedAuthGuard>} />
        <Route path="/genre/:goalId/:genreId" element={<AdvancedAuthGuard><GenreView /></AdvancedAuthGuard>} />
        <Route path="/profile" element={<AdvancedAuthGuard><Profile /></AdvancedAuthGuard>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify" element={<ResetPasswordForm />} />
        <Route path="/storage" element={<AdvancedAuthGuard><Storage /></AdvancedAuthGuard>} />
        <Route path="/monitoring" element={<AdvancedAuthGuard><Monitoring /></AdvancedAuthGuard>} />
        <Route path="/settings" element={<AdvancedAuthGuard><Settings /></AdvancedAuthGuard>} />
        <Route path="/analytics" element={<AdvancedAuthGuard><UserAnalytics /></AdvancedAuthGuard>} />
        <Route path="/faq" element={<AdvancedAuthGuard><FAQ /></AdvancedAuthGuard>} />
        <Route path="/support" element={<Support />} />
        <Route path="/neuralpositive/about" element={<AboutNeuralPositive />} />
        <Route path="/neuralpositive/story" element={<CompanyStory />} />
        <Route path="/neuralpositive/research" element={<ResearchPage />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/hipaa" element={<HIPAA />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/story" element={<Story />} />
        <Route path="/team" element={<Team />} />
        <Route path="/whitepapers" element={<WhitePapers />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/press" element={<Press />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/library" element={<Library />} />
        <Route path="/download" element={<Download />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/clinical-pricing" element={<ClinicalPricing />} />
        <Route path="/help" element={<Help />} />
        <Route path="/help/clinical" element={<Help />} />
        <Route path="/help/technical" element={<Help />} />
        <Route path="/help/faq" element={<FAQ />} />
        <Route path="/consumer-pricing" element={<ConsumerPricing />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
        <Route path="/black-friday" element={<BlackFriday />} />
        <Route path="/capability-brief" element={<CapabilityBrief />} />
        <Route path="/admin" element={<AdvancedAuthGuard adminOnly><AdminLayout /></AdvancedAuthGuard>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="engagement" element={<UserEngagement />} />
          <Route path="magic-links" element={<MagicLinksPage />} />
          <Route path="magic-auth" element={<MagicAuth />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="monitoring" element={<DataMonitoring />} />
          <Route path="storage" element={<StorageManager />} />
        </Route>
        <Route path="*" element={<AdvancedAuthGuard><TherapeuticGoalsPage /></AdvancedAuthGuard>} />
      </Routes>
      </React.Suspense>
      
      {/* Global Support Chat - hidden on landing/demo where it's embedded with nextToPlayer */}
      {location.pathname !== '/' && location.pathname !== '/landing' && location.pathname !== '/demo' && (
        <SupportChat nextToPlayer={false} />
      )}

      {/* Global Music Players - COMPLETELY HIDE on landing page to prevent conflicts with LandingPagePlayer */}
      {location.pathname !== '/' && location.pathname !== '/landing' && location.pathname !== '/demo' && (
        playerMode === 'full' ? <FullPagePlayer /> : <MinimizedPlayer />
      )}
    </div>
  );
};

export default App;
