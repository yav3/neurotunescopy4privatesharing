import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Send, ShieldCheck } from 'lucide-react';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

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
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [step, setStep] = useState<LoginStep>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to music player');
      navigate('/goals');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
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
      startCooldown();
      toast({
        title: "Code Sent",
        description: "Check your email for a 6-digit verification code.",
      });
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    clearError();
    const result = await verifyOtp(email, code);
    if (!result.success) {
      setOtpCode('');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    clearError();
    const result = await sendOtp(email);
    if (result.success) {
      startCooldown();
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      clearError();
      await signIn(email, password);
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

    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      if (error) throw error;
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions. It may take a minute to arrive.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = () => {
    clearError();
  };

  const inputStyle = {
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#C0C0C8',
  };

  const buttonStyle = {
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

      <Tabs defaultValue="email-code" onValueChange={handleTabChange} className="w-full">
        <TabsList
          className="grid w-full grid-cols-2"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <TabsTrigger
            value="email-code"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Code
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
          >
            <Lock className="w-4 h-4 mr-2" />
            Password
          </TabsTrigger>
        </TabsList>

        {/* Email OTP Tab */}
        <TabsContent value="email-code" className="space-y-4 mt-4">
          {!otpSent ? (
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
                    style={inputStyle}
                    className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                style={buttonStyle}
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2" style={{ color: '#C0C0C8' }} />
                <p className="text-sm" style={{ color: '#C0C0C8' }}>
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                  {email}
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => {
                    setOtpCode(value);
                    if (value.length === 6) {
                      handleVerifyOtp(value);
                    }
                  }}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                    <InputOTPSlot index={1} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                    <InputOTPSlot index={2} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                    <InputOTPSlot index={4} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                    <InputOTPSlot index={5} className="w-11 h-12 text-lg bg-black/60 border-white/20 text-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {loading && (
                <p className="text-center text-sm" style={{ color: '#C0C0C8' }}>
                  Verifying...
                </p>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                    clearError();
                  }}
                  className="text-sm transition-colors"
                  style={{ color: '#C0C0C8' }}
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || loading}
                  className="text-sm font-medium transition-colors disabled:opacity-50"
                  style={{ color: '#C0C0C8' }}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="space-y-4 mt-4">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                  style={inputStyle}
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
                  style={inputStyle}
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
              style={buttonStyle}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium transition-colors"
              style={{ color: '#C0C0C8' }}
            >
              Forgot your password?
            </button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
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
