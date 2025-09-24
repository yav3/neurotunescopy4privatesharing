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
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400">Join our platform</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Invitation Code
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.invitationCode}
              onChange={handleChange('invitationCode')}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border-2 border-white/40 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/60 transition-all"
              placeholder="Enter your invitation code"
              required
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Don't have a code? Contact support to request access.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.displayName}
              onChange={handleChange('displayName')}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border-2 border-white/40 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/60 transition-all"
              placeholder="Enter your display name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border-2 border-white/40 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/60 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              className="w-full pl-10 pr-12 py-3 bg-white/20 border-2 border-white/40 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/60 transition-all"
              placeholder="Create a strong password"
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
        </div>

        <button
          type="submit"
          disabled={loading || !formData.email || !formData.password || !formData.displayName || !formData.invitationCode}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-green-400 hover:text-green-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}