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
      
      <div className="container max-w-4xl mx-auto px-3 py-2 mb-16 sm:mb-20">
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

          {/* Compact Stats Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Card className="p-2 sm:p-3 text-center">
              <Music className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-foreground">{stats.total_sessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </Card>
            
            <Card className="p-2 sm:p-3 text-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-foreground">{stats.total_listen_time}h</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </Card>
            
            <Card className="p-2 sm:p-3 text-center">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-foreground">{stats.favorite_goals_count}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </Card>
            
            <Card className="p-2 sm:p-3 text-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-foreground">{stats.current_streak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </Card>
          </div>

          {/* Combined Preferences & Activity Card */}
          <Card className="p-3 sm:p-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Preferences Section */}
              {user?.profile?.favorite_goals?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Preferences
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {user.profile.favorite_goals.slice(0, 3).map((goal: string) => (
                          <Badge key={goal} variant="secondary" className="text-xs">{goal}</Badge>
                        ))}
                        {user.profile.favorite_goals.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{user.profile.favorite_goals.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {user.profile?.default_session_duration || 15} min sessions
                      {user.profile?.notification_preferences?.email && " • Email alerts"}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recent Activity Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Recent Activity
                </h3>
                <div className="space-y-1">
                  {recentSessions.length > 0 ? (
                    recentSessions.slice(0, 3).map((session: any, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
                        <div>
                          <span className="font-medium">{session.session_duration_minutes || 0} min</span>
                          <span className="text-muted-foreground ml-1">• {session.tracks_played || 0} tracks</span>
                        </div>
                        <span className="text-muted-foreground">
                          {formatTimeAgo(session.session_date)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-muted-foreground">
                      <Music className="h-6 w-6 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No sessions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Navigation activeTab="profile" onTabChange={() => {}} />
    </div>
  );
};

export default Profile;