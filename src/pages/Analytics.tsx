import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RealTimeAnalytics } from '@/components/analytics/RealTimeAnalytics';
import { useAuthContext } from '@/components/auth/AuthProvider';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">User Analytics & Insights</h1>
              <p className="text-muted-foreground">Comprehensive user access and security monitoring</p>
            </div>
          </div>
        </div>

        {/* Real-time analytics component */}
        <RealTimeAnalytics />

        {/* User-specific analytics (if showing mock data is helpful) */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-6">Personal Progress Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions This Week</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-green-600 font-medium">+20% from last week</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Session Time</p>
                  <p className="text-2xl font-bold text-foreground">34m</p>
                  <p className="text-xs text-green-600 font-medium">+5m from last week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stress Reduction</p>
                  <p className="text-2xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-green-600 font-medium">+12% improvement</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Goal Achievement</p>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-xs text-green-600 font-medium">On track</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-4">Therapy Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Focus Enhancement</span>
                    <span className="text-foreground">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Stress Reduction</span>
                    <span className="text-foreground">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Mood Improvement</span>
                    <span className="text-foreground">65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-4">Weekly Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-sm text-foreground">2 sessions</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tuesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-foreground">1 session</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wednesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm text-foreground">3 sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;