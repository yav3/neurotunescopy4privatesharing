import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Link, CheckCircle, XCircle, Plus } from 'lucide-react';

export const MagicAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    console.log('MagicAuth: URL params:', window.location.search);
    console.log('MagicAuth: Token from params:', token);
    
    if (!token) {
      console.log('MagicAuth: No token found in URL parameters');
      setError('No magic link token provided');
      setLoading(false);
      return;
    }

    authenticateWithMagicLink();
  }, [token]);

  const authenticateWithMagicLink = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Authenticating with magic link...');

      // First, validate the magic link
      const response = await supabase.functions.invoke('magic-auth', {
        body: { token }
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      if (!data.success) {
        throw new Error(data.error || 'Magic link authentication failed');
      }

      console.log('Magic link validated, user_id:', data.user_id);

      // If there's already a session, sign out first
      if (user) {
        await signOut();
        // Wait a moment for the signout to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Since we can't directly create a session from the edge function,
      // we'll use a different approach - sign in with OTP using the user's email
      if (data.email) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (otpError) {
          console.error('OTP signin error:', otpError);
          // Fallback: show success and ask user to sign in manually
          setSuccess(true);
          toast.success('Magic link verified! Please sign in with your email.');
        } else {
          toast.success('Magic link authenticated! Check your email for the sign-in link.');
          setSuccess(true);
        }
      } else {
        // If we don't have email, show success message
        setSuccess(true);
        toast.success('Magic link verified successfully!');
      }

    } catch (error: any) {
      console.error('Magic link authentication error:', error);
      setError(error.message || 'Failed to authenticate with magic link');
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/auth');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Plus className="h-6 w-6 text-primary" />
            NeuroTunes VIP Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && (
            <div className="text-center space-y-4">
              <LoadingSpinner />
              <p className="text-muted-foreground">
                Authenticating your VIP magic link...
              </p>
            </div>
          )}

          {success && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">
                  Magic Link Verified!
                </h3>
                <p className="text-muted-foreground">
                  Your VIP access has been validated. You may now access the platform.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={goHome} className="w-full">
                  Go to NeuroTunes
                </Button>
                <Button variant="outline" onClick={goToLogin} className="w-full">
                  Sign In
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-700">
                  Authentication Failed
                </h3>
                <p className="text-muted-foreground">
                  {error}
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" onClick={goToLogin} className="w-full">
                  Sign In Manually
                </Button>
                <Button variant="ghost" onClick={goHome} className="w-full">
                  Go to Home
                </Button>
              </div>
            </div>
          )}

          {!token && !loading && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-700">
                  Invalid Magic Link
                </h3>
                <p className="text-muted-foreground">
                  No authentication token was provided in the URL.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Make sure you're using the complete magic link URL provided by the administrator.
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" onClick={goToLogin} className="w-full">
                  Sign In Manually
                </Button>
                <Button variant="ghost" onClick={goHome} className="w-full">
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};