import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to manage post-session survey display logic
 * Shows survey after first session completion, before next session starts
 */
export const usePostSessionSurvey = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    const checkSurveyStatus = async () => {
      // Check if survey was already completed
      const surveyCompleted = localStorage.getItem('neurotunes_first_session_survey');
      if (surveyCompleted) {
        console.log('📊 Survey already completed');
        return;
      }

      // Check if user has completed at least one session
      try {
        const { data: sessions, error } = await supabase
          .from('listening_sessions')
          .select('id, session_duration_minutes')
          .eq('user_id', user.id)
          .gte('session_duration_minutes', 3) // At least 3 minutes
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) {
          console.error('❌ Error checking sessions:', error);
          return;
        }

        // If user has completed at least one session (3+ minutes)
        // and survey hasn't been shown yet, trigger it
        if (sessions && sessions.length >= 1) {
          const surveyShown = localStorage.getItem('neurotunes_survey_shown');
          
          if (!surveyShown) {
            console.log('📊 First session completed, showing survey');
            localStorage.setItem('neurotunes_survey_shown', 'true');
            // Small delay to avoid showing immediately on page load
            setTimeout(() => setShowSurvey(true), 2000);
          }
        }
      } catch (error) {
        console.error('❌ Error in survey check:', error);
      }
    };

    checkSurveyStatus();
  }, [user]);

  const closeSurvey = () => {
    setShowSurvey(false);
  };

  return {
    showSurvey,
    closeSurvey,
  };
};
