import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Settings, Music, Clock, Edit3, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import neurotunesLogo from '@/assets/neurotunes-logo.png';

interface SessionStats {
  totalSessions: number;
  totalListenTime: number; // in minutes
  favoriteGoalsCount: number;
  currentStreak: number;
}

interface ListeningInsights {
  favoriteGenres: string[];
  peakListeningTimes: string[];
  averageSessionLength: number;
  weeklyPattern: Record<string, number>;
  moodProgression: any[];
  skipRate: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalListenTime: 0,
    favoriteGoalsCount: 0,
    currentStreak: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [listeningInsights, setListeningInsights] = useState<ListeningInsights>({
    favoriteGenres: [],
    peakListeningTimes: [],
    averageSessionLength: 0,
    weeklyPattern: {},
    moodProgression: [],
    skipRate: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
      loadRecentSessions();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    try {
      // Get listening sessions with detailed data - support both patient_id and user_id
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('*')
        .or(`patient_id.eq.${user.id},user_id.eq.${user.id}`);

      const totalSessions = sessions?.length || 0;
      const totalListenTime = sessions?.reduce((sum, session) => 
        sum + (session.session_duration_minutes || 0), 0) || 0;

      // Get favorite goals count from favorites table
      const { data: favData } = await supabase
        .from('favorites')
        .select('track_id')
        .eq('user_id', user.id);

      const favoriteGoalsCount = favData?.length || 0;

      // Calculate streak (simplified - consecutive days with sessions)
      const currentStreak = await calculateStreak(user.id);

      // Calculate listening insights
      await calculateListeningInsights(sessions || []);

      setStats({
        totalSessions,
        totalListenTime: Math.round(totalListenTime / 60), // Convert to hours
        favoriteGoalsCount,
        currentStreak
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateListeningInsights = async (sessions: any[]) => {
    if (!sessions.length) return;

    // Calculate favorite genres
    const genreCounts: Record<string, number> = {};
    sessions.forEach(session => {
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

    // Calculate peak listening times
    const hourCounts: Record<number, number> = {};
    sessions.forEach(session => {
      const hour = new Date(session.session_date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([hour]) => {
        const h = parseInt(hour);
        if (h === 0) return '12 AM';
        if (h < 12) return `${h} AM`;
        if (h === 12) return '12 PM';
        return `${h - 12} PM`;
      });

    // Calculate weekly pattern
    const weeklyPattern: Record<string, number> = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    sessions.forEach(session => {
      const day = dayNames[new Date(session.session_date).getDay()];
      weeklyPattern[day] = (weeklyPattern[day] || 0) + 1;
    });

    // Calculate average session length and skip rate
    const totalDuration = sessions.reduce((sum, session) => sum + (session.session_duration_minutes || 0), 0);
    const averageSessionLength = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
    
    const totalSkipRate = sessions.reduce((sum, session) => sum + (session.skip_rate || 0), 0);
    const skipRate = sessions.length > 0 ? Math.round((totalSkipRate / sessions.length) * 100) : 0;

    // Extract mood progression data
    const moodProgression = sessions
      .filter(session => session.mood_progression)
      .map(session => ({
        date: session.session_date,
        progression: session.mood_progression
      }))
      .slice(0, 10);

    setListeningInsights({
      favoriteGenres,
      peakListeningTimes: peakHours,
      averageSessionLength,
      weeklyPattern,
      moodProgression,
      skipRate
    });
  };

  const calculateStreak = async (userId: string): Promise<number> => {
    try {
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('session_date')
        .or(`patient_id.eq.${userId},user_id.eq.${userId}`)
        .order('session_date', { ascending: false })
        .limit(30);

      if (!sessions || sessions.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].session_date);
        sessionDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (sessionDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const loadRecentSessions = async () => {
    if (!user?.id) return;
    
    try {
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('*')
        .or(`patient_id.eq.${user.id},user_id.eq.${user.id}`)
        .order('session_date', { ascending: false })
        .limit(10);

      setRecentSessions(sessions || []);
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours <= 1 ? 'Today' : `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    loadUserStats(); // Refresh stats after profile update
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-3 py-2 mb-16 sm:mb-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-4 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Your therapeutic music journey
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:gap-4">
          {/* Compact Profile Info Card */}
          <ProfileEditForm
            isEditing={isEditing}
            onSave={handleEditComplete}
            onCancel={() => setIsEditing(false)}
          />

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <Music className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.totalSessions}</div>
              <div className="text-sm font-medium text-blue-700">Sessions</div>
            </Card>
            
            <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.totalListenTime}h</div>
              <div className="text-sm font-medium text-green-700">Hours</div>
            </Card>
            
            <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <Settings className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{stats.favoriteGoalsCount}</div>
              <div className="text-sm font-medium text-purple-700">Favorites</div>
            </Card>
            
            <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{stats.currentStreak}</div>
              <div className="text-sm font-medium text-orange-700">Day Streak</div>
            </Card>
          </div>

          {/* Listening Insights */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Listening Patterns */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Listening Patterns
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Peak Listening Times</div>
                  <div className="flex gap-2">
                    {listeningInsights.peakListeningTimes.length > 0 ? (
                      listeningInsights.peakListeningTimes.map((time, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {time}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No data yet</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Average Session</div>
                  <div className="text-xl font-bold text-foreground">
                    {listeningInsights.averageSessionLength} minutes
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Skip Rate</div>
                  <div className="text-xl font-bold text-foreground">
                    {listeningInsights.skipRate}%
                  </div>
                </div>
              </div>
            </Card>

            {/* Music Preferences */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2 text-primary" />
                Music Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-3">Favorite Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {listeningInsights.favoriteGenres.length > 0 ? (
                      listeningInsights.favoriteGenres.map((genre, index) => (
                        <span key={index} className="px-3 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-700 rounded-lg text-sm font-medium border border-teal-200">
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">Start listening to see your preferences</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Session Duration</div>
                  <div className="text-foreground">
                    Preferred: 15 minutes
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Therapeutic Goals</div>
                  <div className="text-foreground">
                    {stats.favoriteGoalsCount > 0 ? `${stats.favoriteGoalsCount} tracks favorited` : 'No favorites yet'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Pattern */}
          {Object.keys(listeningInsights.weeklyPattern).length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Weekly Activity Pattern
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(listeningInsights.weeklyPattern)
                  .sort(([a], [b]) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(a) - ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(b))
                  .map(([day, count]) => (
                    <div key={day} className="text-center p-2 bg-muted/20 rounded">
                      <div className="text-xs text-muted-foreground">{day.slice(0, 3)}</div>
                      <div className="text-sm font-medium text-foreground">{count}</div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Detailed Recent Sessions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Recent Listening Sessions
            </h3>
            
            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                <div className="grid gap-3">
                  {recentSessions.map((session: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {session.session_duration_minutes || 0} minute session
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.tracks_played || 0} tracks • {session.skip_rate ? `${Math.round(session.skip_rate * 100)}% skip rate` : 'No skips'}
                          </div>
                          {session.dominant_genres && session.dominant_genres.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {session.dominant_genres.slice(0, 2).map((genre: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {formatTimeAgo(session.session_date)}
                        </div>
                        {session.average_complexity_score && (
                          <div className="text-xs text-muted-foreground">
                            Complexity: {session.average_complexity_score.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium text-muted-foreground mb-2">No sessions yet</div>
                  <div className="text-sm text-muted-foreground">Start listening to see your activity here</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Navigation activeTab="profile" onTabChange={() => {}} />
    </div>
  );
};

export default Profile;