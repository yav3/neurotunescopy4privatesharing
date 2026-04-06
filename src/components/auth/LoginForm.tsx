import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
}

type LoginStep = 'email' | 'otp' | 'password';

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { signIn, sendOtp, verifyOtp, loading, error, clearError, user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/goals');
    }
  }, [user, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    clearError();
    const result = await sendOtp(email);
    if (result.success) {
      setOtpSent(true);
      setStep('otp');
      setResendCooldown(60);
      setOtpCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newCode.every(d => d !== '')) {
      handleVerifyOtp(newCode.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setOtpCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerifyOtp(pasted);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    clearError();
    await verifyOtp(email, code);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    clearError();
    await signIn(email, password);
  };

  const handleBack = () => {
    clearError();
    if (step === 'otp' || step === 'password') {
      setStep('email');
      setOtpCode(['', '', '', '', '', '']);
      setPassword('');
    }
  };

  const glassInput = {
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#C0C0C8',
  };

  const glassButton = {
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
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        {step !== 'email' && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: '#C0C0C8' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#C0C0C8' }}>
          {step === 'email' ? 'Welcome' : step === 'otp' ? 'Enter Code' : 'Sign In'}
        </h2>
        <p style={{ color: '#C0C0C8' }}>
          {step === 'email'
            ? 'Enter your email to receive a sign-in code'
            : step === 'otp'
            ? `We sent a 6-digit code to ${email}`
            : 'Sign in with your password'}
        </p>
      </div>

      {/* Error display */}
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
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#fca5a5' }} />
            <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
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
                style={glassInput}
                className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={glassButton}
          >
            {loading ? 'Sending code...' : 'Send Sign-In Code'}
          </button>
        </form>
      )}

      {/* Step 2: OTP Code Entry */}
      {step === 'otp' && (
        <div className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
            {otpCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                style={{
                  ...glassInput,
                  width: '48px',
                  height: '56px',
                  fontSize: '24px',
                  textAlign: 'center' as const,
                  fontWeight: 600,
                }}
                className="rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
            ))}
          </div>

          <button
            onClick={() => {
              const code = otpCode.join('');
              if (code.length === 6) handleVerifyOtp(code);
            }}
            disabled={loading || otpCode.some(d => d === '')}
            className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={glassButton}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <button
              onClick={() => handleSendOtp()}
              disabled={resendCooldown > 0 || loading}
              className="text-sm font-medium transition-colors disabled:opacity-40"
              style={{ color: '#C0C0C8' }}
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Resend code'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Password fallback */}
      {step === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#C0C0C8' }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={glassInput}
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
                style={glassInput}
                className="w-full pl-10 pr-12 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="Enter your password"
                required
                autoFocus
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
            style={glassButton}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}

      {/* Footer links */}
      <div className="text-center space-y-3">
        {step === 'email' && (
          <button
            type="button"
            onClick={() => setStep('password')}
            className="text-xs transition-colors block w-full"
            style={{ color: 'rgba(192, 192, 200, 0.5)' }}
          >
            Have a password? Sign in here
          </button>
        )}
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