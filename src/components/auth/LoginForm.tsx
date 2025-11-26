import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { signIn, loading, error, clearError, user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect to music player page when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, redirecting to music player');
      navigate('/goals');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      clearError();
      await signIn(email, password);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (error) throw error;

      // Send password reset email
      await supabase.functions.invoke('send-auth-email', {
        body: {
          type: 'password-reset',
          to: email,
          data: {
            resetLink: resetUrl,
          }
        }
      });
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/goals`,
        }
      });
      
      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Apple",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#C0C0C8' }}>Welcome Back</h2>
        <p style={{ color: '#C0C0C8' }}>Sign in to your account</p>
      </div>

      {error && (
        <div 
          className="rounded-lg p-4"
          style={{
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" style={{ color: '#fca5a5' }} />
            <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#C0C0C8' }}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#C0C0C8',
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#C0C0C8' }}>
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#C0C0C8',
              }}
              className="w-full pl-10 pr-12 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
              style={{ color: '#C0C0C8' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.3),
              inset 0 2px 8px rgba(255, 255, 255, 0.1),
              inset 0 -2px 8px rgba(0, 0, 0, 0.5),
              0 8px 32px rgba(0, 0, 0, 0.6)
            `,
            color: '#C0C0C8',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'rgba(192, 192, 200, 0.2)' }}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span style={{ background: '#000', color: '#C0C0C8', padding: '0 12px' }}>Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAppleSignIn}
        className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#C0C0C8',
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        Sign in with Apple
      </button>

      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm font-medium block w-full transition-colors"
          style={{ color: '#C0C0C8' }}
        >
          Forgot your password?
        </button>
        <p className="text-sm" style={{ color: '#C0C0C8' }}>
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium underline transition-colors"
            style={{ color: '#C0C0C8' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}