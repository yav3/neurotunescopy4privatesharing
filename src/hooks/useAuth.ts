import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Analytics } from '@/utils/analytics';
import { useSessionManager } from './useSessionManager';

type UserRole = 'super_admin' | 'admin' | 'moderator' | 'premium_user' | 'clinical_user' | 'user';
type UserStatus = 'active' | 'suspended' | 'pending' | 'banned';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  avatar_url?: string | null;
  default_session_duration?: number | null;
  favorite_goals?: string[] | null;
  notification_preferences?: any;
}

interface ExtendedUser extends User {
  profile?: UserProfile;
  role?: UserRole;
}

// Dev mode bypass - set to true to skip authentication
const DEV_MODE_BYPASS = false;

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize session manager
  const sessionManager = useSessionManager(user);

  // Create mock user for dev mode
  const createMockUser = (): ExtendedUser => {
    // Use a consistent UUID for dev mode instead of a string
    const devUserId = '00000000-0000-0000-0000-000000000001';
    const mockUser: ExtendedUser = {
      id: devUserId,
      email: 'dev@neurotunes.app',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        display_name: 'Dev User'
      },
      aud: 'authenticated',
      role: 'super_admin',
      profile: {
        id: '00000000-0000-0000-0000-000000000002',
        user_id: devUserId,
        display_name: 'Dev User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        bio: 'Development mode user',
        avatar_url: null,
        default_session_duration: 30,
        favorite_goals: [],
        notification_preferences: {}
      }
    };
    return mockUser;
  };

  // Get user with profile and role
  const getUserWithProfile = async (authUser: User): Promise<ExtendedUser | null> => {
    try {
      console.log('🔍 Getting profile for user:', authUser.id);
      
      // Get profile
      console.log('📋 Fetching profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.log('⚠️ Profile error (might be normal for new users):', profileError);
      } else {
        console.log('✅ Profile fetched successfully:', profile);
      }

      // Get role
      console.log('👑 Fetching role...');
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { _user_id: authUser.id });

      if (roleError) {
        console.error('❌ Role error:', roleError);
      } else {
        console.log('✅ Role fetched successfully:', roleData);
      }

      const result = {
        ...authUser,
        profile: profile || undefined,
        role: roleData || 'user'
      };

      console.log('✅ User profile loaded completely:', { 
        hasProfile: !!result.profile, 
        role: result.role,
        userId: result.id 
      });

      return result;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      return {
        ...authUser,
        role: 'user'
      };
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Track signup attempt
      Analytics.trackAuthAttempt('signup', email);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { display_name: displayName }
        }
      });

      if (signUpError) {
        Analytics.trackAuthFailure('signup', signUpError.message, email);
        throw signUpError;
      }
      
      if (data.user) {
        Analytics.trackAuthSuccess('signup', data.user.id);
      }

      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Sign up failed';
      setError(errorMessage);
      Analytics.trackAuthFailure('signup', errorMessage, email);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Track login attempt
      Analytics.trackAuthAttempt('login', email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        Analytics.trackAuthFailure('login', signInError.message, email);
        throw signInError;
      }
      
      if (data.user) {
        // Get user with profile to track role
        const userWithProfile = await getUserWithProfile(data.user);
        Analytics.trackAuthSuccess('login', data.user.id, userWithProfile?.role);
      }

      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Sign in failed';
      setError(errorMessage);
      Analytics.trackAuthFailure('login', errorMessage, email);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Track session end before signing out
      if (user) {
        Analytics.trackSessionEnd(user.id);
      }
      
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh user data
      const updatedUser = await getUserWithProfile(user);
      if (updatedUser) setUser(updatedUser);

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Permission helpers
  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user?.role) return false;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasRole(['super_admin', 'admin', 'moderator']);
  };

  const canManageUsers = (): boolean => {
    return hasRole(['super_admin', 'admin']);
  };

  // Clear error
  const clearError = () => setError(null);

  // Initialize auth state
  useEffect(() => {
    // DEV MODE BYPASS
    if (DEV_MODE_BYPASS) {
      console.log('🔧 DEV MODE: Bypassing authentication');
      const mockUser = createMockUser();
      setUser(mockUser);
      setSession({
        access_token: 'dev-token',
        refresh_token: 'dev-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser as User
      } as Session);
      setLoading(false);
      console.log('✅ DEV MODE: Mock user created:', mockUser);
      return () => {}; // Empty cleanup
    }

    let mounted = true;

    // Set up auth state listener FIRST - but avoid calling Supabase functions inside
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, !!session?.user);
        if (!mounted) return;

        // Only synchronous state updates here
        setSession(session);
        
        // Don't reset user to null if we already have a user and session is still valid
        // This prevents the "kicking out" issue during profile reloads
        if (!session?.user) {
          setUser(null);
        }
        
        // Track session start for new logins
        if (event === 'SIGNED_IN') {
          Analytics.trackSessionStart(session.user.id);
        }
        
          // Defer profile fetching to avoid deadlock
          if (session?.user) {
            setTimeout(() => {
              if (mounted) {
                getUserWithProfile(session.user).then(userWithProfile => {
                  if (mounted && session?.user) { // Double check session is still valid
                    console.log('✅ Profile loaded via timeout:', !!userWithProfile);
                    setUser(userWithProfile);
                    // Update admin logging with user role
                    import('@/utils/adminLogging').then(({ updateUserRole }) => {
                      updateUserRole(userWithProfile?.role || 'user');
                    });
                  }
                });
              }
            }, 0);
          }
        
        console.log('⏰ Setting loading to false from auth state change');
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        console.log('📋 Session found:', !!session?.user);
        
        if (session?.user) {
          console.log('👤 Loading user profile...');
          const userWithProfile = await getUserWithProfile(session.user);
            if (mounted) {
              setUser(userWithProfile);
              setSession(session);
              // Track session start for existing sessions
              Analytics.trackSessionStart(session.user.id, userWithProfile?.role);
              // Update admin logging with user role
              import('@/utils/adminLogging').then(({ updateUserRole }) => {
                updateUserRole(userWithProfile?.role || 'user');
              });
              console.log('✅ Auth initialization complete');
            }
        } else {
          console.log('📭 No session found');
          if (mounted) {
            setUser(null);
            setSession(null);
            // Clear admin logging role
            import('@/utils/adminLogging').then(({ updateUserRole }) => {
              updateUserRole(null);
            });
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          console.log('🏁 Auth loading complete');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    userRole: user?.role || 'user',
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    isAdmin,
    canManageUsers,
    clearError,
    sessionManager
  };
}