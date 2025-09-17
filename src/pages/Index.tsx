import React, { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<any>(null);

  const handleLogin = () => {
    setShowLanding(false);
    setUser({ name: 'Guest User' });
  };

  const handleSignup = () => {
    setShowLanding(false);
    setUser({ name: 'New User' });
  };

  if (showLanding) {
    return (
      <LandingPage 
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  // Main NeuroTunes App Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            🎵 NeuroTunes
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Music Therapy Platform
          </p>
        </div>

        {/* Therapeutic Goals */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                🧠
              </div>
              <div>
                <h3 className="font-semibold">Focus Enhancement</h3>
                <p className="text-sm text-muted-foreground">Improve concentration</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                💚
              </div>
              <div>
                <h3 className="font-semibold">Stress Relief</h3>
                <p className="text-sm text-muted-foreground">Reduce anxiety</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                😌
              </div>
              <div>
                <h3 className="font-semibold">Pain Support</h3>
                <p className="text-sm text-muted-foreground">Manage discomfort</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access to Bucket Testing */}
        <div className="mt-12 pt-8 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Development Tools
            </p>
            <button 
              onClick={() => window.location.href = '/buckets'}
              className="text-sm text-primary hover:underline"
            >
              View Storage Bucket Connections
            </button>
          </div>
        </div>
      </div>

      <Navigation activeTab="home" onTabChange={() => {}} />
    </div>
  );
};

export default Index;