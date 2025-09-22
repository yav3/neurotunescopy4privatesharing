import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Cpu, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Storage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Storage Management</h1>
              <p className="text-muted-foreground">Manage your music library and storage settings</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Music Library</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Your personal music collection and therapeutic tracks
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Tracks:</span>
                <span className="font-medium text-foreground">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Used:</span>
                <span className="font-medium text-foreground">2.3 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-medium text-foreground">7.7 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Processing</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Audio processing and optimization status
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Queue:</span>
                <span className="font-medium text-foreground">3 files</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Analytics</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Storage usage patterns and insights
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Most Played:</span>
                <span className="font-medium text-foreground">Classical</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="font-medium text-foreground">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;