import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Settings, Music, Clock, Edit3, Calendar, TrendingUp } from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface SessionStats {
  total_sessions: number;
  total_listen_time: number; // in minutes
  favorite_goals_count: number;
  current_streak: number;
}

const Profile = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    total_sessions: 0,
    total_listen_time: 0,
    favorite_goals_count: 0,
    current_streak: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
      loadRecentSessions();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    try {
      // Get listening sessions count and total time
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('session_duration_minutes')
        .eq('patient_id', user.id);

      const totalSessions = sessions?.length || 0;
      const totalListenTime = sessions?.reduce((sum, session) => 
        sum + (session.session_duration_minutes || 0), 0) || 0;

      // Get favorite goals count
      const favoriteGoalsCount = user.profile?.favorite_goals?.length || 0;

      // Calculate streak (simplified - consecutive days with sessions)
      const currentStreak = await calculateStreak(user.id);

      setStats({
        total_sessions: totalSessions,
        total_listen_time: Math.round(totalListenTime / 60), // Convert to hours
        favorite_goals_count: favoriteGoalsCount,
        current_streak: currentStreak
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateStreak = async (userId: string): Promise<number> => {
    try {
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('session_date')
        .eq('patient_id', userId)
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
        .eq('patient_id', user.id)
        .order('session_date', { ascending: false })
        .limit(5);

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
      
      <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8 mb-20 sm:mb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Manage your therapeutic music journey
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Profile Info Card */}
          <ProfileEditForm
            isEditing={isEditing}
            onSave={handleEditComplete}
            onCancel={() => setIsEditing(false)}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4 text-center">
              <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_sessions}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Sessions Complete</div>
            </Card>
            
            <Card className="p-3 sm:p-4 text-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_listen_time}h</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Listen Time</div>
            </Card>
            
            <Card className="p-3 sm:p-4 text-center">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.favorite_goals_count}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Preferred Goals</div>
            </Card>
            
            <Card className="p-3 sm:p-4 text-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.current_streak}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Day Streak</div>
            </Card>
          </div>

          {/* Therapeutic Goals Overview */}
          {user?.profile?.favorite_goals?.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Therapeutic Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Favorite Goals</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.profile.favorite_goals.map((goal: string) => (
                      <Badge key={goal} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Default Session</label>
                    <p className="text-sm mt-1">
                      {user.profile?.default_session_duration || 15} minutes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notifications</label>
                    <div className="flex gap-2 mt-1">
                      {user.profile?.notification_preferences?.email && (
                        <Badge variant="outline" className="text-xs">Email</Badge>
                      )}
                      {user.profile?.notification_preferences?.push && (
                        <Badge variant="outline" className="text-xs">Push</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Activity Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Therapeutic Session</p>
                      <p className="text-sm text-muted-foreground">
                        {session.session_duration_minutes || 0} minutes • {session.tracks_played || 0} tracks
                        {session.dominant_genres?.length > 0 && (
                          <> • {session.dominant_genres.slice(0, 2).join(', ')}</>
                        )}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {formatTimeAgo(session.session_date)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions yet</p>
                  <p className="text-sm">Start a therapeutic music session to see your activity here</p>
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