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

  // Redirect to music player page when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, redirecting to music player');
      navigate('/goals');
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
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#C0C0C8' }}>Create Account</h2>
        <p style={{ color: '#C0C0C8' }}>Join our platform</p>
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
            Invitation Code
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
            <input
              type="text"
              value={formData.invitationCode}
              onChange={handleChange('invitationCode')}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#C0C0C8',
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              placeholder="Enter your invitation code"
              required
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#C0C0C8' }}>
            Don't have a code? Contact support to request access.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#C0C0C8' }}>
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
            <input
              type="text"
              value={formData.displayName}
              onChange={handleChange('displayName')}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#C0C0C8',
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#C0C0C8' }}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
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
              value={formData.password}
              onChange={handleChange('password')}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#C0C0C8',
              }}
              className="w-full pl-10 pr-12 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              placeholder="Create a strong password"
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
          disabled={loading || !formData.email || !formData.password || !formData.displayName || !formData.invitationCode}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm" style={{ color: '#C0C0C8' }}>
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="font-medium underline transition-colors"
            style={{ color: '#C0C0C8' }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}