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
  Clock,
  User,
  Headphones,
  Sun
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAudioStore } from '@/stores/audioStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import { NowPlaying } from '@/components/NowPlaying';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export function UnifiedDashboard() {
  const navigate = useNavigate();
  const { pause, currentTrack } = useAudioStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Stop playback when entering dashboard
  useEffect(() => {
    pause();
  }, []);

  // Mock user data
  const userData = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@neurotunes.com",
    joinDate: "March 2024",
    sessionsCompleted: 47,
    totalListeningHours: 156,
    favoriteGenre: "Classical",
    currentStreak: 12
  };

  // Mock APIs
  const emotionAPI = {
    getEmotionHistory: async (period: string) => ({
      emotions: [
        { date: '2024-01-01', mood: 'happy', score: 0.8 },
        { date: '2024-01-02', mood: 'calm', score: 0.7 },
      ]
    })
  };

  const statsAPI = {
    getListeningStats: async (period: string) => ({
      totalMinutes: 240,
      totalSessions: 12,
      avgSessionLength: 20
    })
  };

  // Data queries
  const { data: emotionData, isLoading: isLoadingEmotions } = useQuery({
    queryKey: ['emotion-tracking', selectedPeriod],
    queryFn: () => emotionAPI.getEmotionHistory(selectedPeriod),
  });

  const { data: listenStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['listening-stats', selectedPeriod],
    queryFn: () => statsAPI.getListeningStats(selectedPeriod),
  });

  // Mock data
  const therapeuticGoals = [
    { id: 'focus', label: 'Focus Enhancement', icon: Brain, color: 'blue', progress: 75 },
    { id: 'chill', label: 'Stress Reduction', icon: Heart, color: 'green', progress: 88 },
    { id: 'relaxation', label: 'Relaxation', icon: Heart, color: 'cyan', progress: 92 },
    { id: 'energy', label: 'Energy Boost', icon: Zap, color: 'yellow', progress: 67 },
    { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'indigo', progress: 84 }
  ];

  const weeklyMoodData = [
    { day: 'Mon', mood: 6.2, energy: 7.1, focus: 5.8, stress: 4.2 },
    { day: 'Tue', mood: 7.1, energy: 6.8, focus: 7.2, stress: 3.8 },
    { day: 'Wed', mood: 5.9, energy: 6.2, focus: 6.9, stress: 5.1 },
    { day: 'Thu', mood: 8.2, energy: 8.1, focus: 7.8, stress: 2.9 },
    { day: 'Fri', mood: 8.8, energy: 8.5, focus: 6.5, stress: 2.3 },
    { day: 'Sat', mood: 9.1, energy: 7.9, focus: 5.2, stress: 1.8 },
    { day: 'Sun', mood: 7.6, energy: 6.8, focus: 6.1, stress: 3.5 }
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Consistent daily music therapy', icon: Target, earned: true },
    { id: 2, title: 'Mood Booster', description: 'Improved mood score by 20%', icon: TrendingUp, earned: true },
    { id: 3, title: 'Focus Master', description: '50+ focus sessions completed', icon: Brain, earned: false },
    { id: 4, title: 'Sleep Champion', description: 'Improved sleep quality metrics', icon: Moon, earned: true }
  ];

  const frequencyBands = [
    { name: "Delta", range: "0.5-4Hz", description: "Deep Sleep & Healing", progress: 15 },
    { name: "Theta", range: "4-8Hz", description: "Meditation & Creativity", progress: 35 },
    { name: "Alpha", range: "8-13Hz", description: "Relaxed Focus", progress: 85 },
    { name: "Beta", range: "13-30Hz", description: "Active Concentration", progress: 60 },
    { name: "Gamma", range: "30-100Hz", description: "Peak Performance", progress: 25 }
  ];

  const recentSessions = [
    { date: "Today", mood: "Focused", duration: 45, tracks: 12 },
    { date: "Yesterday", mood: "Relaxed", duration: 60, tracks: 16 },
    { date: "2 days ago", mood: "Anxious", duration: 30, tracks: 8 }
  ];

  const moodData = {
    currentMood: "Focused",
    moodScore: 8.2,
    stressLevel: 3.4,
    energyLevel: 7.8,
    relaxationLevel: 6.5
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header with User Info */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
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
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{userData.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {userData.email} • Member since {userData.joinDate}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                      <p className="text-2xl font-bold">{userData.sessionsCompleted}</p>
                    </div>
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Listening Hours</p>
                      <p className="text-2xl font-bold">{userData.totalListeningHours}</p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold">{userData.currentStreak}</p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Mood Score</p>
                      <p className="text-2xl font-bold">{moodData.moodScore}</p>
                    </div>
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Therapeutic Goals Progress */}
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">{session.date}</p>
                          <p className="text-sm text-muted-foreground">Mood: {session.mood}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.duration}min</p>
                        <p className="text-sm text-muted-foreground">{session.tracks} tracks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mood Tracking Tab */}
          <TabsContent value="mood" className="space-y-8">
            {/* Current Mood Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Current Mood Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium">Focus</p>
                    <p className="text-2xl font-bold text-blue-500">{moodData.moodScore}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium">Stress</p>
                    <p className="text-2xl font-bold text-red-500">{moodData.stressLevel}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sun className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium">Energy</p>
                    <p className="text-2xl font-bold text-green-500">{moodData.energyLevel}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Moon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium">Calm</p>
                    <p className="text-2xl font-bold text-blue-500">{moodData.relaxationLevel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Mood Chart */}
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
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            {/* Frequency Bands Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Brainwave Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {frequencyBands.map((band, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{band.name} Band</span>
                          <span className="text-sm text-muted-foreground ml-2">({band.range})</span>
                        </div>
                        <span className="text-sm font-medium">{band.progress}%</span>
                      </div>
                      <Progress value={band.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{band.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Focus Enhancement
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Try a 20-minute Alpha wave session to improve concentration during morning hours.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Stress Reduction
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Consider a Theta wave meditation session for relaxation after work.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">
                    Sleep Preparation
                  </h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    Delta wave therapy can help improve sleep quality - best used 1 hour before bed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Music & Therapy Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {["Classical", "Jazz", "Acoustic", "Electronic", "Folk", "Ambient"].map((genre) => (
                      <Badge key={genre} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="block text-sm font-medium mb-2">Therapeutic Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {["Focus", "Relaxation", "Sleep", "Anxiety Relief", "Mood Boost", "Creativity"].map((goal) => (
                      <Badge key={goal} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="block text-sm font-medium mb-2">Session Duration</label>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">15 min</Button>
                    <Button variant="outline" size="sm">30 min</Button>
                    <Button variant="default" size="sm">45 min</Button>
                    <Button variant="outline" size="sm">60 min</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation activeTab="profile" />
      {currentTrack && <NowPlaying />}
    </div>
  );
}