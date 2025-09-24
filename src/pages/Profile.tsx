import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Music, Clock, Edit3, ArrowLeft, Heart, Calendar } from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalSessions: number;
  totalHours: number;
  favoriteTracksCount: number;
  currentStreak: number;
  favoriteGenres: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalHours: 0,
    favoriteTracksCount: 0,
    currentStreak: 0,
    favoriteGenres: []
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

      setStats({
        totalSessions,
        totalHours,
        favoriteTracksCount,
        currentStreak,
        favoriteGenres
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
      
      <div className="container max-w-2xl mx-auto px-4 py-6 mb-16 sm:mb-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">
                Your music therapy journey
              </p>
            </div>
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

        <div className="space-y-6">
          {/* Profile Info */}
          <ProfileEditForm
            isEditing={isEditing}
            onSave={handleEditComplete}
            onCancel={() => setIsEditing(false)}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center border-2">
              <Music className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalSessions}</div>
              <div className="text-sm font-medium text-foreground/80">Sessions Completed</div>
            </Card>
            
            <Card className="p-6 text-center border-2">
              <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalHours}</div>
              <div className="text-sm font-medium text-foreground/80">Hours Listened</div>
            </Card>
          </div>

          {/* Favorites & Streak */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center border-2">
              <Heart className="h-10 w-10 text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.favoriteTracksCount}</div>
              <div className="text-sm font-medium text-foreground/80">Favorite Tracks</div>
            </Card>
            
            <Card className="p-6 text-center border-2">
              <Calendar className="h-10 w-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.currentStreak}</div>
              <div className="text-sm font-medium text-foreground/80">Day Streak</div>
            </Card>
          </div>

          {/* Favorite Genres */}
          {stats.favoriteGenres.length > 0 && (
            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Music className="w-6 h-6 mr-3 text-primary" />
                Your Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-3">
                {stats.favoriteGenres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold border-2 border-primary"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Getting Started */}
          {stats.totalSessions === 0 && (
            <Card className="p-8 text-center border-2 border-dashed">
              <Music className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to start your music therapy journey?
              </h3>
              <p className="text-foreground/80 mb-6 text-base">
                Explore our therapeutic music collections designed to help you relax, focus, and feel better.
              </p>
              <Button onClick={() => navigate('/')} size="lg" className="text-base px-8 py-3">
                Start Listening
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;