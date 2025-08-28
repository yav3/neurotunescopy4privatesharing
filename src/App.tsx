import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AIDJPage } from "./pages/AIDJPage";
import { EmotionDashboard } from "./pages/EmotionDashboard";
import MoodAnalyzerPage from "./pages/MoodAnalyzerPage";
import PlayerPage from "./pages/PlayerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-dj" element={<AIDJPage />} />
            <Route path="/mood-analyzer" element={<MoodAnalyzerPage />} />
            <Route path="/dashboard" element={<EmotionDashboard />} />
            <Route path="/player" element={<PlayerPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
