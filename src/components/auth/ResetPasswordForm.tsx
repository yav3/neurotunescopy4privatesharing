import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the session from the reset password email
    const handlePasswordReset = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('🔐 Reset Password Debug:', {
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing',
        type,
        error,
        errorDescription,
        fullURL: window.location.href
      });

      // Handle error from URL params first
      if (error) {
        toast({
          title: "Reset Password Error",
          description: errorDescription || error,
          variant: "destructive",
        });
        console.error('🔐 Reset password error from URL:', { error, errorDescription });
        return;
      }

      if (type === 'recovery' && accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('🔐 Session set error:', error);
            toast({
              title: "Error",
              description: "Invalid or expired reset link",
              variant: "destructive",
            });
            navigate('/');
          } else {
            console.log('🔐 Session set successfully for password reset');
            toast({
              title: "Ready to Reset",
              description: "Please enter your new password below",
            });
          }
        } catch (sessionError) {
          console.error('🔐 Exception setting session:', sessionError);
          toast({
            title: "Error",
            description: "Failed to process reset link",
            variant: "destructive",
          });
          navigate('/');
        }
      } else if (!type && !accessToken && !refreshToken) {
        console.log('🔐 No reset parameters found, redirecting to home');
        navigate('/');
      } else {
        console.warn('🔐 Incomplete reset parameters:', { type, hasAccess: !!accessToken, hasRefresh: !!refreshToken });
        toast({
          title: "Invalid Reset Link",
          description: "This reset link appears to be invalid or incomplete",
          variant: "destructive",
        });
      }
    };

    handlePasswordReset();
  }, [searchParams, navigate]);

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
        description: "Your password has been successfully updated",
      });

      // Redirect to home after successful password update
      navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-400">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center mt-2 text-sm">
              {isValidPassword ? (
                <Check className="w-4 h-4 text-green-400 mr-2" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span className={isValidPassword ? "text-green-400" : "text-gray-400"}>
                At least 6 characters
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <div className="flex items-center mt-2 text-sm">
                {passwordsMatch ? (
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                )}
                <span className={passwordsMatch ? "text-green-400" : "text-red-400"}>
                  {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValidPassword || !passwordsMatch}
            className="w-full bg-gradient-primary text-white py-3 px-4 rounded-lg font-medium hover:from-primary hover:to-accent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}