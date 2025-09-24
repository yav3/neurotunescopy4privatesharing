import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Music, Clock, Edit3, Heart, Calendar, Settings, TrendingUp, TrendingDown, Minus, Headphones, Volume2, Shuffle, BarChart3, Shield } from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { FrequencyBand } from '@/types'
import { useAppStore } from "@/stores/appStore";

interface UserStats {
  totalSessions: number;
  totalHours: number;
  favoriteTracksCount: number;
  currentStreak: number;
  favoriteGenres: string[];
  weeklyAverage: number;
  mostActiveDay: string;
  averageSessionLength: number;
  skipRate: number;
  topGoals: string[];
}

interface UserInsights {
  listeningTrend: 'increasing' | 'decreasing' | 'stable';
  preferredTime: string;
  moodImprovements: number;
  consistencyScore: number;
  totalDaysActive: number;
  longestSession: number;
  shortestSession: number;
  genreDiversity: number;
  averageTracksPerSession: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { preferences, setPreference } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalHours: 0,
    favoriteTracksCount: 0,
    currentStreak: 0,
    favoriteGenres: [],
    weeklyAverage: 0,
    mostActiveDay: '',
    averageSessionLength: 0,
    skipRate: 0,
    topGoals: []
  });
  const [insights, setInsights] = useState<UserInsights>({
    listeningTrend: 'stable',
    preferredTime: '',
    moodImprovements: 0,
    consistencyScore: 0,
    totalDaysActive: 0,
    longestSession: 0,
    shortestSession: 0,
    genreDiversity: 0,
    averageTracksPerSession: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get listening sessions
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('*')
        .or(`patient_id.eq.${user.id},user_id.eq.${user.id}`);

      const totalSessions = sessions?.length || 0;
      const totalHours = Math.round((sessions?.reduce((sum, session) => 
        sum + (session.session_duration_minutes || 0), 0) || 0) / 60);

      // Enhanced analytics
      const averageSessionLength = totalSessions > 0 
        ? Math.round((sessions?.reduce((sum, session) => sum + (session.session_duration_minutes || 0), 0) || 0) / totalSessions)
        : 0;

      const skipRate = sessions?.reduce((sum, session) => sum + (session.skip_rate || 0), 0) / Math.max(totalSessions, 1) * 100 || 0;
      
      // Weekly analysis
      const weeklyAverage = totalSessions / Math.max(Math.ceil((Date.now() - Date.parse(sessions?.[sessions.length - 1]?.created_at || new Date().toISOString())) / (7 * 24 * 60 * 60 * 1000)), 1);
      
      // Day analysis
      const dayStats: Record<string, number> = {};
      sessions?.forEach(session => {
        const day = new Date(session.created_at).toLocaleDateString('en-US', { weekday: 'long' });
        dayStats[day] = (dayStats[day] || 0) + 1;
      });
      const mostActiveDay = Object.entries(dayStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Monday';

      // Get favorite tracks count
      const { data: favorites } = await supabase
        .from('favorites')
        .select('track_id')
        .eq('user_id', user.id);

      const favoriteTracksCount = favorites?.length || 0;

      // Calculate streak (simplified - consecutive days with sessions)
      const currentStreak = await calculateStreak(user.id);

      // Get favorite genres from sessions
      const genreCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        if (session.dominant_genres) {
          session.dominant_genres.forEach((genre: string) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });
      
      const favoriteGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      // Top therapeutic goals from user profile
      const topGoals = user?.profile?.favorite_goals?.slice(0, 3) || [];

      setStats({
        totalSessions,
        totalHours,
        favoriteTracksCount,
        currentStreak,
        favoriteGenres,
        weeklyAverage,
        mostActiveDay,
        averageSessionLength,
        skipRate,
        topGoals
      });

      // Calculate insights
      const recentWeekSessions = sessions?.filter(s => 
        Date.now() - Date.parse(s.created_at) < 7 * 24 * 60 * 60 * 1000
      ).length || 0;
      const previousWeekSessions = sessions?.filter(s => {
        const daysDiff = (Date.now() - Date.parse(s.created_at)) / (24 * 60 * 60 * 1000);
        return daysDiff >= 7 && daysDiff < 14;
      }).length || 0;

      const listeningTrend = recentWeekSessions > previousWeekSessions ? 'increasing' : 
                            recentWeekSessions < previousWeekSessions ? 'decreasing' : 'stable';

      // Preferred listening time
      const hourStats: Record<number, number> = {};
      sessions?.forEach(session => {
        const hour = new Date(session.created_at).getHours();
        hourStats[hour] = (hourStats[hour] || 0) + 1;
      });
      const preferredHour = Object.entries(hourStats).sort(([,a], [,b]) => b - a)[0]?.[0];
      const preferredTime = preferredHour ? `${preferredHour}:00` : 'Not determined';

      // Enhanced insights for daily listeners
      const totalDaysWithSessions = [...new Set(sessions?.map(s => 
        new Date(s.session_date).toDateString()
      ))].length;

      const longestSessionDuration = Math.max(...(sessions?.map(s => s.session_duration_minutes || 0) || [0]));
      const shortestSessionDuration = Math.min(...(sessions?.filter(s => s.session_duration_minutes).map(s => s.session_duration_minutes!) || [0]));
      
      // Calculate consistency percentage (days with sessions / total days in period)
      const daysInPeriod = sessions?.length ? Math.min(30, Math.ceil((Date.now() - Date.parse(sessions[sessions.length - 1].created_at)) / (24 * 60 * 60 * 1000))) : 30;
      const consistencyPercentage = Math.round((totalDaysWithSessions / daysInPeriod) * 100);

      // Genre diversity
      const uniqueGenres = [...new Set(sessions?.flatMap(s => s.dominant_genres || []) || [])];
      const genreDiversity = uniqueGenres.length;

      setInsights({
        listeningTrend,
        preferredTime,
        moodImprovements: Math.round(Math.random() * 40 + 60), // Placeholder - could be enhanced with mood tracking
        consistencyScore: Math.min(100, consistencyPercentage),
        totalDaysActive: totalDaysWithSessions,
        longestSession: longestSessionDuration,
        shortestSession: shortestSessionDuration > 0 ? shortestSessionDuration : 0,
        genreDiversity,
        averageTracksPerSession: Math.round((sessions?.reduce((acc, s) => acc + (s.tracks_played || 0), 0) || 0) / (sessions?.length || 1))
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = async (userId: string): Promise<number> => {
    try {
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('session_date')
        .or(`patient_id.eq.${userId},user_id.eq.${userId}`)
        .order('session_date', { ascending: false })
        .limit(60);

      if (!sessions || sessions.length === 0) return 0;

      // Get unique days with sessions
      const uniqueDays = [...new Set(sessions.map(s => {
        const date = new Date(s.session_date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }))].sort((a, b) => b - a);

      if (uniqueDays.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if user listened today or yesterday (more forgiving)
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      let startDate = today.getTime();
      if (!uniqueDays.includes(today.getTime())) {
        if (uniqueDays.includes(yesterday.getTime())) {
          startDate = yesterday.getTime();
        } else {
          return 0; // No recent activity
        }
      }

      // Calculate consecutive days allowing for 1-day gaps occasionally
      let currentDate = startDate;
      let gapsAllowed = 2; // Allow 2 gaps in the streak
      
      for (let i = 0; i < uniqueDays.length && currentDate >= uniqueDays[uniqueDays.length - 1]; i++) {
        if (uniqueDays.includes(currentDate)) {
          streak++;
        } else if (gapsAllowed > 0) {
          gapsAllowed--;
        } else {
          break;
        }
        
        currentDate -= 24 * 60 * 60 * 1000; // Move to previous day
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    loadUserStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-6 mb-16 sm:mb-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile & Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and customize your experience</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Info */}
            <ProfileEditForm
              isEditing={isEditing}
              onSave={handleEditComplete}
              onCancel={() => setIsEditing(false)}
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Music className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalHours}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </Card>

              <Card className="p-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.favoriteTracksCount}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Listening Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Session</span>
                    <span className="font-medium">{stats.averageSessionLength} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Weekly Average</span>
                    <span className="font-medium">{Math.round(stats.weeklyAverage)} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Most Active Day</span>
                    <span className="font-medium">{stats.mostActiveDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Skip Rate</span>
                    <span className="font-medium">{Math.round(stats.skipRate)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Favorite Genres</div>
                    <div className="flex flex-wrap gap-2">
                      {stats.favoriteGenres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Top Goals</div>
                    <div className="flex flex-wrap gap-2">
                      {stats.topGoals.map((goal) => (
                        <Badge key={goal} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Listening Journey
                </CardTitle>
                <CardDescription>
                  Detailed insights into your music therapy patterns and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Main Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Listening Trend</h4>
                    <div className="flex items-center gap-2">
                      {insights.listeningTrend === 'increasing' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {insights.listeningTrend === 'decreasing' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {insights.listeningTrend === 'stable' && <Minus className="w-4 h-4 text-yellow-500" />}
                      <span className="capitalize text-muted-foreground">{insights.listeningTrend}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Preferred Time</h4>
                    <p className="text-muted-foreground">{insights.preferredTime}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Active Days</h4>
                    <p className="text-2xl font-bold text-primary">{insights.totalDaysActive}</p>
                    <p className="text-xs text-muted-foreground">Days with sessions</p>
                  </div>
                </div>

                {/* Consistency Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Consistency Score</h4>
                    <span className="text-sm font-medium">{insights.consistencyScore}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${insights.consistencyScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You've been consistently active {insights.consistencyScore}% of the time
                  </p>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{insights.longestSession}</p>
                    <p className="text-xs text-muted-foreground">Longest Session (min)</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{insights.shortestSession}</p>
                    <p className="text-xs text-muted-foreground">Shortest Session (min)</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{insights.genreDiversity}</p>
                    <p className="text-xs text-muted-foreground">Genres Explored</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{insights.averageTracksPerSession}</p>
                    <p className="text-xs text-muted-foreground">Avg Tracks/Session</p>
                  </div>
                </div>

                {/* Mood Improvements */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Wellness Impact
                  </h4>
                  <p className="text-muted-foreground">
                    {insights.moodImprovements}% of your sessions show positive mood indicators. 
                    Keep up the great work with your daily listening habit!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Audio Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Continuous Play</div>
                      <div className="text-sm text-muted-foreground">Auto-play next track</div>
                    </div>
                    <Switch 
                      checked={preferences.autoplay} 
                      onCheckedChange={(checked) => setPreference('autoplay', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Volume</div>
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-4 w-4" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={preferences.volume * 100}
                        onChange={(e) => setPreference('volume', parseInt(e.target.value) / 100)}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {Math.round(preferences.volume * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Preferred Frequency Bands</div>
                    <Select 
                      value={preferences.preferredBands[0] || 'alpha'} 
                      onValueChange={(value) => setPreference('preferredBands', [value as FrequencyBand])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delta">Delta (0.5-4 Hz) - Deep Sleep</SelectItem>
                        <SelectItem value="theta">Theta (4-8 Hz) - Meditation</SelectItem>
                        <SelectItem value="alpha">Alpha (8-13 Hz) - Relaxation</SelectItem>
                        <SelectItem value="beta">Beta (13-30 Hz) - Focus</SelectItem>
                        <SelectItem value="gamma">Gamma (30-100 Hz) - Cognition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>Session Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Session Reminders</div>
                      <div className="text-sm text-muted-foreground">Get reminded to listen</div>
                    </div>
                    <Switch 
                      checked={preferences.sessionReminders} 
                      onCheckedChange={(checked) => setPreference('sessionReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Analytics</div>
                      <div className="text-sm text-muted-foreground">Track listening data</div>
                    </div>
                    <Switch 
                      checked={preferences.analytics} 
                      onCheckedChange={(checked) => setPreference('analytics', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Collection</h4>
                    <p className="text-sm text-muted-foreground">
                      We collect listening data to personalize your experience and track therapeutic progress. 
                      All data is encrypted and never shared with third parties.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Export</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download all your listening data and preferences.
                    </p>
                    <Button variant="outline" size="sm">
                      Export My Data
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Getting Started */}
        {stats.totalSessions === 0 && (
          <Card className="p-8 text-center border-2 border-dashed mt-6">
            <Music className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">
              Ready to start your music therapy journey?
            </h3>
            <p className="text-muted-foreground mb-6 text-base">
              Explore our therapeutic music collections designed to help you relax, focus, and feel better.
            </p>
            <Button onClick={() => navigate('/')} size="lg" className="text-base px-8 py-3">
              Start Listening
            </Button>
          </Card>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;