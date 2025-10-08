import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WelcomeData {
  totalSessions: number;
  lastSessionDate: string | null;
  favoriteGenre: string | null;
  totalListeningHours: number;
  isReturningUser: boolean;
}

export const useWelcomeMessage = () => {
  const { user } = useAuthContext();
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    if (!user || welcomeShown) return;

    const showWelcomeMessage = async () => {
      try {
        // Get user's listening history
        const { data: sessions, error } = await supabase
          .from('listening_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const welcomeData: WelcomeData = {
          totalSessions: sessions?.length || 0,
          lastSessionDate: sessions?.[0]?.created_at || null,
          favoriteGenre: null,
          totalListeningHours: 0,
          isReturningUser: (sessions?.length || 0) > 0
        };

        // Calculate total listening time
        if (sessions) {
          welcomeData.totalListeningHours = sessions.reduce((total, session) => 
            total + (session.session_duration_minutes || 0), 0) / 60;

          // Find favorite genre
          const genreCounts: Record<string, number> = {};
          sessions.forEach(session => {
            if (session.dominant_genres && Array.isArray(session.dominant_genres)) {
              session.dominant_genres.forEach((genre: string) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
              });
            }
          });

          const topGenre = Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)[0];
          welcomeData.favoriteGenre = topGenre?.[0] || null;
        }

        // Show appropriate welcome message
        const welcomeMessage = createWelcomeMessage(welcomeData);
        
        if (welcomeMessage) {
          // Delay to ensure user sees it
          setTimeout(() => {
            toast({
              title: welcomeMessage.title,
              description: welcomeMessage.description,
              duration: 6000,
            });
          }, 1500);
        }

        setWelcomeShown(true);
      } catch (error) {
        console.error('Error fetching welcome data:', error);
        setWelcomeShown(true);
      }
    };

    showWelcomeMessage();
  }, [user, welcomeShown]);

  return { welcomeShown };
};

const createWelcomeMessage = (data: WelcomeData): { title: string; description: string } | null => {
  if (!data.isReturningUser) {
    return {
      title: "Welcome to NeuroTunes! 🎵",
      description: "Discover personalized music therapy designed to enhance your wellbeing. Start your first session when you're ready."
    };
  }

  // Returning user messages
  if (data.totalSessions === 1) {
    return {
      title: "Welcome back! 🌟",
      description: "Great to see you return for your second session. Let's continue your wellness journey."
    };
  }

  if (data.totalSessions < 5) {
    return {
      title: "Welcome back! 🎶",
      description: `You've completed ${data.totalSessions} sessions. Your personalized experience is getting better with each listen.`
    };
  }

  if (data.totalSessions < 10) {
    const favoriteGenreText = data.favoriteGenre ? ` Your favorite seems to be ${data.favoriteGenre}.` : '';
    return {
      title: "Welcome back, dedicated listener! 🎼",
      description: `${data.totalSessions} sessions and counting!${favoriteGenreText} Your wellness routine is taking shape.`
    };
  }

  // Power user (10+ sessions)
  const hoursText = data.totalListeningHours > 1 
    ? ` (${Math.round(data.totalListeningHours)} hours total)` 
    : '';
  const favoriteGenreText = data.favoriteGenre ? ` ${data.favoriteGenre} seems to be your go-to.` : '';
  
  return {
    title: "Welcome back, Wellness Aficionado! 🏆",
    description: `${data.totalSessions} sessions completed${hoursText}.${favoriteGenreText} Your commitment to mental wellness is inspiring!`
  };
};