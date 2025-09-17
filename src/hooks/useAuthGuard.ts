import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';

/**
 * Authentication guard hook - ensures user is authenticated
 * Redirects to landing page if not authenticated
 */
export const useAuthGuard = (redirectPath: string = '/landing') => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔒 Auth guard: User not authenticated, redirecting to', redirectPath);
      navigate(redirectPath);
    }
  }, [user, loading, navigate, redirectPath]);

  return { 
    isAuthenticated: !!user && !loading,
    isLoading: loading,
    user 
  };
};