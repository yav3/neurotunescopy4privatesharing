import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Heart, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Monitoring = () => {
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
              <h1 className="text-2xl font-semibold text-foreground">Health Monitoring</h1>
              <p className="text-muted-foreground">Real-time wellness and therapy session monitoring</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h2 className="text-lg font-medium text-card-foreground">Physiological Metrics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Heart Rate Variability</span>
                <span className="font-medium text-foreground">Normal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Stress Level</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Sleep Quality</span>
                <span className="font-medium text-foreground">Good</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-blue-500" />
              <h2 className="text-lg font-medium text-card-foreground">Cognitive Metrics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Focus Score</span>
                <span className="font-medium text-foreground">8.2/10</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Mood Rating</span>
                <span className="font-medium text-green-600">Positive</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="font-medium text-foreground">High</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Session Activity</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="text-sm text-muted-foreground">Sessions This Week</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">47m</div>
                <div className="text-sm text-muted-foreground">Average Session</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">92%</div>
                <div className="text-sm text-muted-foreground">Effectiveness Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;