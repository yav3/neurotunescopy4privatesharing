import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SessionTrackingData {
  trackId?: string;
  duration: number;
  skipRate?: number;
  tracksPlayed?: number;
  dominantGenres?: string[];
  therapeuticGoal?: string;
  sessionType: 'therapeutic' | 'casual' | 'focus' | 'relaxation';
}

export class SessionTracker {
  private static currentSession: {
    startTime: Date;
    tracksPlayed: string[];
    skippedTracks: string[];
    dominantGenres: Set<string>;
    therapeuticGoal?: string;
    sessionType: string;
  } | null = null;

  /**
   * Start tracking a new session
   */
  static startSession(sessionType: string, therapeuticGoal?: string) {
    console.log('🎵 Starting session tracking:', { sessionType, therapeuticGoal });
    
    this.currentSession = {
      startTime: new Date(),
      tracksPlayed: [],
      skippedTracks: [],
      dominantGenres: new Set(),
      therapeuticGoal,
      sessionType
    };
  }

  /**
   * Track a played track
   */
  static trackPlayed(trackId: string, genre?: string) {
    if (!this.currentSession) {
      console.warn('⚠️ No active session to track play for:', trackId);
      return;
    }

    this.currentSession.tracksPlayed.push(trackId);
    if (genre) {
      this.currentSession.dominantGenres.add(genre);
    }
    
    console.log('▶️ Tracked play:', { trackId, genre, totalPlayed: this.currentSession.tracksPlayed.length });
  }

  /**
   * Track a skipped track
   */
  static trackSkipped(trackId: string) {
    if (!this.currentSession) {
      console.warn('⚠️ No active session to track skip for:', trackId);
      return;
    }

    this.currentSession.skippedTracks.push(trackId);
    console.log('⏭️ Tracked skip:', { trackId, totalSkipped: this.currentSession.skippedTracks.length });
  }

  /**
   * End current session and save to database
   */
  static async endSession(userId?: string): Promise<boolean> {
    if (!this.currentSession) {
      console.warn('⚠️ No active session to end');
      return false;
    }

    try {
      // Get current user if not provided
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUserId = user?.id;
      }

      if (!currentUserId) {
        console.error('❌ No user ID available for session tracking');
        return false;
      }

      const session = this.currentSession;
      const endTime = new Date();
      const durationMinutes = Math.floor((endTime.getTime() - session.startTime.getTime()) / 60000);
      
      // Calculate metrics
      const totalTracks = session.tracksPlayed.length + session.skippedTracks.length;
      const skipRate = totalTracks > 0 ? session.skippedTracks.length / totalTracks : 0;
      
      const sessionData = {
        user_id: currentUserId,
        session_date: session.startTime.toISOString(),
        session_duration_minutes: durationMinutes,
        tracks_played: session.tracksPlayed.length,
        skip_rate: skipRate,
        dominant_genres: Array.from(session.dominantGenres),
        mood_progression: null,
        average_complexity_score: null,
        created_at: new Date().toISOString()
      };

      console.log('💾 Saving session data:', sessionData);

      // Try to get or create patient record first
      try {
        const { data: patientId, error: patientError } = await supabase
          .rpc('get_or_create_patient_for_user', { user_id: currentUserId });
        
        if (!patientError && patientId) {
          (sessionData as any).patient_id = patientId;
          console.log('🏥 Linked to patient:', patientId);
        }
      } catch (patientError) {
        console.warn('⚠️ Could not create/link patient, using user_id only:', patientError);
      }

      // Insert session data
      const { error } = await supabase
        .from('listening_sessions')
        .insert(sessionData);

      if (error) {
        console.error('❌ Failed to save session:', error);
        return false;
      }

      console.log('✅ Session saved successfully!', {
        duration: durationMinutes,
        tracksPlayed: session.tracksPlayed.length,
        skipRate: Math.round(skipRate * 100) + '%'
      });

      // Clear current session
      this.currentSession = null;
      return true;

    } catch (error) {
      console.error('❌ Error ending session:', error);
      return false;
    }
  }

  /**
   * Force save current session (useful for app close/refresh)
   */
  static async forceSave(userId?: string): Promise<boolean> {
    if (this.currentSession) {
      return await this.endSession(userId);
    }
    return true;
  }

  /**
   * Get current session info
   */
  static getCurrentSessionInfo() {
    if (!this.currentSession) return null;

    const duration = Math.floor((Date.now() - this.currentSession.startTime.getTime()) / 60000);
    
    return {
      duration,
      tracksPlayed: this.currentSession.tracksPlayed.length,
      skippedTracks: this.currentSession.skippedTracks.length,
      dominantGenres: Array.from(this.currentSession.dominantGenres),
      sessionType: this.currentSession.sessionType,
      therapeuticGoal: this.currentSession.therapeuticGoal
    };
  }

  /**
   * Ensure session tracking is active (auto-start if needed)
   */
  static ensureSessionActive(sessionType: string = 'casual', therapeuticGoal?: string) {
    if (!this.currentSession) {
      this.startSession(sessionType, therapeuticGoal);
    }
  }
}

// Auto-save on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    SessionTracker.forceSave();
  });
}