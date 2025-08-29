import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NowPlaying } from "@/components/NowPlaying";
import MusicDeliveryStatus from "@/components/MusicDeliveryStatus";
import ConnectivityPanel from "@/components/ConnectivityPanel";
import AudioProviderNew from "@/components/AudioProvider";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AIDJPage from "./pages/AIDJPage";
import { EmotionDashboard } from "./pages/EmotionDashboard";
import MoodAnalyzerPage from "./pages/MoodAnalyzerPage";
import PlayerPage from "./pages/PlayerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { BrainwaveFrequencyPage } from "./pages/BrainwaveFrequencyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <AudioProvider>
          <AudioProviderNew />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="relative min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/ai-dj" element={<AIDJPage />} />
                <Route path="/mood-analyzer" element={<MoodAnalyzerPage />} />
                <Route path="/brainwave" element={<BrainwaveFrequencyPage />} />
                <Route path="/dashboard" element={<EmotionDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/player" element={<PlayerPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <NowPlaying />
              <MusicDeliveryStatus />
              <ConnectivityPanel />
            </div>
          </BrowserRouter>
        </AudioProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
