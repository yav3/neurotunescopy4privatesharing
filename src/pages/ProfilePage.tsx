import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { NowPlaying } from "@/components/NowPlaying";
import { useAudioStore } from "@/stores/audioStore";
import { 
  User, 
  Brain, 
  Activity, 
  Music, 
  TrendingUp, 
  Calendar, 
  Clock,
  Heart,
  Zap,
  Target,
  BarChart3,
  Headphones,
  Moon,
  Sun
} from "lucide-react";

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentTrack } = useAudioStore();

  // Mock user data - replace with real user data
  const userData = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@neurotunes.com",
    joinDate: "March 2024",
    sessionsCompleted: 47,
    totalListeningHours: 156,
    favoriteGenre: "Classical",
    currentStreak: 12
  };

  // Mock mood data - replace with real mood tracking
  const moodData = {
    currentMood: "Focused",
    moodScore: 8.2,
    stressLevel: 3.4,
    energyLevel: 7.8,
    relaxationLevel: 6.5,
    recentSessions: [
      { date: "Today", mood: "Focused", duration: 45, tracks: 12 },
      { date: "Yesterday", mood: "Relaxed", duration: 60, tracks: 16 },
      { date: "2 days ago", mood: "Anxious", duration: 30, tracks: 8 }
    ]
  };

  // Mock dashboard stats
  const dashboardStats = [
    { label: "Sessions This Week", value: "12", icon: Calendar, color: "text-blue-500" },
    { label: "Total Hours", value: "156", icon: Clock, color: "text-green-500" },
    { label: "Favorite Frequency", value: "Alpha", icon: Brain, color: "text-blue-500" },
    { label: "Mood Improvement", value: "+23%", icon: TrendingUp, color: "text-orange-500" }
  ];

  const frequencyBands = [
    { name: "Delta", range: "0.5-4Hz", description: "Deep Sleep & Healing", progress: 15 },
    { name: "Theta", range: "4-8Hz", description: "Meditation & Creativity", progress: 35 },
    { name: "Alpha", range: "8-13Hz", description: "Relaxed Focus", progress: 85 },
    { name: "Beta", range: "13-30Hz", description: "Active Concentration", progress: 60 },
    { name: "Gamma", range: "30-100Hz", description: "Peak Performance", progress: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
              <p className="text-muted-foreground">{userData.email}</p>
              <Badge variant="secondary" className="mt-1">
                Member since {userData.joinDate}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mood Analyzer
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Listening Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Therapeutic Progress
              </h3>
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
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {moodData.recentSessions.map((session, index) => (
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
            </Card>
          </TabsContent>

          {/* Mood Analyzer Tab */}
          <TabsContent value="mood" className="space-y-6">
            {/* Current Mood Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Current Mood Analysis
              </h3>
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
            </Card>

            {/* Mood Tracking */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mood Tracking</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Overall Well-being</span>
                    <span className="font-medium">{moodData.moodScore}/10</span>
                  </div>
                  <Progress value={moodData.moodScore * 10} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Stress Level</span>
                    <span className="font-medium">{moodData.stressLevel}/10</span>
                  </div>
                  <Progress value={moodData.stressLevel * 10} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Energy Level</span>
                    <span className="font-medium">{moodData.energyLevel}/10</span>
                  </div>
                  <Progress value={moodData.energyLevel * 10} className="h-3" />
                </div>
              </div>
            </Card>

            {/* Mood Recommendations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Focus Enhancement</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Try a 20-minute Alpha wave session to improve concentration</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-medium text-green-800 dark:text-green-200">Stress Reduction</p>
                  <p className="text-sm text-green-600 dark:text-green-300">Consider a Theta wave meditation session for relaxation</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Sleep Preparation</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Delta wave therapy can help improve sleep quality tonight</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Music Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {["Classical", "Jazz", "Acoustic", "Electronic", "Folk"].map((genre) => (
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
                    {["Focus", "Relaxation", "Sleep", "Anxiety Relief", "Mood Boost"].map((goal) => (
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
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation activeTab="profile" />
      {currentTrack && <NowPlaying />}
    </div>
  );
};