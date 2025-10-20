import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, AlertTriangle, Key } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const { signUp, loading, error, clearError, user } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    invitationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect to main app when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, redirecting to main app');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.displayName && formData.invitationCode) {
      clearError();
      
      // Basic invitation code validation (you can customize this logic)
      if (!formData.invitationCode.trim()) {
        return; // Form validation will handle this
      }
      
      const result = await signUp(formData.email, formData.password, formData.displayName);
      if (result.success) {
        // Show success message or redirect
        alert('Account created! Please check your email to verify your account.');
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glass">
          <UserPlus className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground">Join our platform</p>
      </div>

      {error && (
        <div className="bg-destructive/20 border border-destructive/40 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground mr-2" />
            <p className="text-destructive-foreground text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Invitation Code
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={formData.invitationCode}
              onChange={handleChange('invitationCode')}
              className="w-full pl-10 pr-4 py-3 bg-input/50 backdrop-blur-sm border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring/60 transition-all"
              placeholder="Enter your invitation code"
              required
            />
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Don't have a code? Contact support to request access.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={formData.displayName}
              onChange={handleChange('displayName')}
              className="w-full pl-10 pr-4 py-3 bg-input/50 backdrop-blur-sm border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring/60 transition-all"
              placeholder="Enter your display name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full pl-10 pr-4 py-3 bg-input/50 backdrop-blur-sm border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring/60 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              className="w-full pl-10 pr-12 py-3 bg-input/50 backdrop-blur-sm border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring/60 transition-all"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.email || !formData.password || !formData.displayName || !formData.invitationCode}
          className="w-full bg-gradient-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-glass"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-accent-foreground hover:text-foreground font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}