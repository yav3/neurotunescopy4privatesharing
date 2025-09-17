import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BucketConnectionViewer } from "@/pages/BucketConnectionViewer";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buckets" element={<BucketConnectionViewer />} />
            <Route path="*" element={<div className="text-center p-8"><h2>Page Not Found</h2><p>Go to <a href="/" className="text-primary hover:underline">Home</a></p></div>} />
          </Routes>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;