import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the hash fragment automatically via onAuthStateChange
    // when the user clicks the reset link. We just need to detect the PASSWORD_RECOVERY event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event);
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
        toast({
          title: "Ready to Reset",
          description: "Please enter your new password below",
        });
      } else if (event === 'SIGNED_IN' && !sessionReady) {
        // Sometimes Supabase fires SIGNED_IN instead of PASSWORD_RECOVERY
        // Check if we came from a reset link by looking at the URL hash
        const hash = window.location.hash;
        if (hash.includes('type=recovery') || hash.includes('type=signup')) {
          setSessionReady(true);
          toast({
            title: "Ready to Reset",
            description: "Please enter your new password below",
          });
        }
      }
    });

    // Also check if there's already a session (user may have been redirected with tokens already processed)
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hash = window.location.hash;
      
      if (session && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
        setSessionReady(true);
      } else if (!session && !hash.includes('access_token')) {
        // No session and no tokens in URL — invalid access
        console.log('🔐 No reset session found, redirecting');
        toast({
          title: "Invalid Reset Link",
          description: "This reset link is invalid or expired. Please request a new one.",
          variant: "destructive",
        });
        setTimeout(() => navigate('/auth'), 2000);
      }
    };

    // Small delay to let Supabase process the hash fragment
    setTimeout(checkExistingSession, 1000);

    return () => subscription.unsubscribe();
  }, [navigate, sessionReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated. You can now sign in.",
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidPassword = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#050607' }}>
      <div className="rounded-3xl p-8 w-full max-w-md" style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9)',
      }}>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>Reset Password</h2>
          <p className="text-white/50 text-sm mt-1" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {sessionReady ? 'Enter your new password below' : 'Verifying your reset link...'}
          </p>
        </div>

        {sessionReady ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                  style={{
                    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center mt-2 text-xs">
                {isValidPassword ? (
                  <Check className="w-3.5 h-3.5 mr-1.5" style={{ color: '#06b6d4' }} />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-white/30 mr-1.5" />
                )}
                <span style={{ color: isValidPassword ? '#06b6d4' : 'rgba(255,255,255,0.3)' }}>
                  At least 6 characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                  style={{
                    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center mt-2 text-xs">
                  {passwordsMatch ? (
                    <Check className="w-3.5 h-3.5 mr-1.5" style={{ color: '#06b6d4' }} />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5" style={{ color: '#ef4444' }} />
                  )}
                  <span style={{ color: passwordsMatch ? '#06b6d4' : '#ef4444' }}>
                    {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isValidPassword || !passwordsMatch}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center py-8">
            <div className="flex gap-1.5 mb-4">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#06b6d4', animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#06b6d4', animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#06b6d4', animationDelay: '300ms' }} />
            </div>
            <p className="text-white/40 text-sm" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Verifying your reset link...
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
            style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Back to Sign In
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/30" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Having trouble? <a href="/support" className="underline hover:text-white/50 transition-colors">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
