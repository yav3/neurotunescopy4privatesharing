import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Heart,
  Brain,
  Zap,
  Moon,
  Shield,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  ChevronLeft,
  Music,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePlayerStore } from '@/stores/playerStore';
import { emotionAPI, statsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export function EmotionDashboard() {
  const navigate = useNavigate();
  const { stopPlayback } = usePlayerStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('mood');

  // Stop playback when entering dashboard
  useEffect(() => {
    stopPlayback();
  }, []);

  // Fetch emotion tracking data
  const { data: emotionData, isLoading: isLoadingEmotions } = useQuery({
    queryKey: ['emotion-tracking', selectedPeriod],
    queryFn: () => emotionAPI.getEmotionHistory(selectedPeriod),
  });

  // Fetch listening statistics
  const { data: listenStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['listening-stats', selectedPeriod],
    queryFn: () => statsAPI.getListeningStats(selectedPeriod),
  });

  const therapeuticGoals = [
    { id: 'focus', label: 'Focus Enhancement', icon: Brain, color: 'blue', progress: 75 },
    { id: 'chill', label: 'Stress Reduction', icon: Heart, color: 'green', progress: 88 },
    { id: 'relaxation', label: 'Relaxation', icon: Heart, color: 'cyan', progress: 92 },
    { id: 'energy', label: 'Energy Boost', icon: Zap, color: 'yellow', progress: 67 },
    { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'indigo', progress: 84 }
  ];

  const weeklyMoodData = [
    { day: 'Mon', mood: 6.2, energy: 7.1, focus: 5.8 },
    { day: 'Tue', mood: 7.1, energy: 6.8, focus: 7.2 },
    { day: 'Wed', mood: 5.9, energy: 6.2, focus: 6.9 },
    { day: 'Thu', mood: 8.2, energy: 8.1, focus: 7.8 },
    { day: 'Fri', mood: 8.8, energy: 8.5, focus: 6.5 },
    { day: 'Sat', mood: 9.1, energy: 7.9, focus: 5.2 },
    { day: 'Sun', mood: 7.6, energy: 6.8, focus: 6.1 }
  ];

  const genreDistribution = [
    { name: 'Ambient', value: 35, color: '#8884d8' },
    { name: 'Classical', value: 28, color: '#82ca9d' },
    { name: 'Acoustic', value: 20, color: '#ffc658' },
    { name: 'Electronic', value: 12, color: '#ff7300' },
    { name: 'Jazz', value: 5, color: '#00ff88' }
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Consistent daily music therapy', icon: Target, earned: true },
    { id: 2, title: 'Mood Booster', description: 'Improved mood score by 20%', icon: TrendingUp, earned: true },
    { id: 3, title: 'Focus Master', description: '50+ focus sessions completed', icon: Brain, earned: false },
    { id: 4, title: 'Sleep Champion', description: 'Improved sleep quality metrics', icon: Moon, earned: true }
  ];

  const recentInsights = [
    {
      type: 'positive',
      title: 'Great Progress!',
      description: 'Your mood scores have improved 23% this week',
      icon: TrendingUp,
      color: 'green'
    },
    {
      type: 'suggestion',
      title: 'Focus Opportunity',
      description: 'Try morning focus sessions for better concentration',
      icon: Brain,
      color: 'blue'
    },
    {
      type: 'achievement',
      title: 'Consistency Streak',
      description: 'You\'ve maintained daily sessions for 7 days!',
      icon: Star,
      color: 'yellow'
    }
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Emotion Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Track your therapeutic music journey
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{listenStats?.totalSessions || 0}</p>
                    </div>
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Listening Time</p>
                      <p className="text-2xl font-bold">
                        {formatDuration(listenStats?.totalMinutes || 0)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Session</p>
                      <p className="text-2xl font-bold">
                        {formatDuration(listenStats?.avgSessionLength || 0)}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Mood Score</p>
                      <p className="text-2xl font-bold">7.8</p>
                    </div>
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Therapeutic Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Therapeutic Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {therapeuticGoals.map((goal) => {
                    const Icon = goal.icon;
                    return (
                      <div key={goal.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-card rounded-full">
                            <Icon className="h-4 w-4 text-foreground" />
                          </div>
                          <span className="font-medium">{goal.label}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recent Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="p-2 bg-card rounded-full">
                          <Icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mood Tracking Tab */}
          <TabsContent value="mood" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mood Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Mood Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyMoodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Mood Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Energy Level"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="focus" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        name="Focus Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Genre Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Music Genre Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Genre distribution chart will be available with more listening data</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {genreDistribution.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: genre.color }}
                        />
                        {genre.name} ({genre.value}%)
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all ${
                          achievement.earned 
                            ? 'bg-primary/5 border-primary' 
                            : 'bg-muted/50 border-muted opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            achievement.earned 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            {achievement.earned && (
                              <Badge className="mt-2">Earned</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-8">
            <div className="grid gap-6">
              {/* Personalized Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-foreground">
                      Morning Focus Sessions
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your focus scores are highest between 9-11 AM. Consider scheduling important tasks during this time.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-foreground">
                      Stress Reduction Success
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ambient music sessions have reduced your stress levels by 35%. Keep up the great work!
                    </p>
                  </div>

                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-foreground">
                      Sleep Quality Improvement
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Evening classical music sessions correlate with better sleep quality metrics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}