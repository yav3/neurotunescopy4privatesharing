import React, { useState, useEffect, useRef } from 'react';
import { Mail, User, Key, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onToggleMode: () => void;
}

type SignupStep = 'details' | 'otp';

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const { sendSignupOtp, verifyOtp, loading, error, clearError, user } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    invitationCode: ''
  });
  const [step, setStep] = useState<SignupStep>('details');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/goals');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.displayName || !formData.invitationCode) return;
    
    clearError();
    setValidationErrors([]);

    const nameParts = formData.displayName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setValidationErrors(['Please enter your full legal name (first and last name)']);
      return;
    }

    try {
      const { data: validationResult, error: validationError } = await supabase.functions.invoke('validate-signup', {
        body: {
          email: formData.email,
          fullName: formData.displayName,
          clientIp: undefined
        }
      });

      if (validationError) {
        setValidationErrors(['Unable to validate signup. Please try again.']);
        return;
      }

      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors || ['Signup validation failed']);
        return;
      }

      const result = await sendSignupOtp(formData.email);
      if (result.success) {
        setStep('otp');
        setResendCooldown(60);
        setOtpCode(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setValidationErrors(['An error occurred. Please try again.']);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

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
    await verifyOtp(formData.email, code);
  };

  const handleResend = async () => {
    clearError();
    const result = await sendSignupOtp(formData.email);
    if (result.success) {
      setResendCooldown(60);
      setOtpCode(['', '', '', '', '', '']);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
      <div className="text-center">
        {step === 'otp' && (
          <button
            onClick={() => { setStep('details'); clearError(); }}
            className="absolute top-4 left-4 p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: '#C0C0C8' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#C0C0C8' }}>
          {step === 'details' ? 'Create Account' : 'Verify Email'}
        </h2>
        <p style={{ color: '#C0C0C8' }}>
          {step === 'details'
            ? 'Join our platform'
            : `Enter the 6-digit code sent to ${formData.email}`}
        </p>
      </div>

      {(error || validationErrors.length > 0) && (
        <div
          className="rounded-lg p-4"
          style={{
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#fca5a5' }} />
            <div className="flex-1">
              {error && <p className="text-sm mb-2" style={{ color: '#fca5a5' }}>{error}</p>}
              {validationErrors.map((err, idx) => (
                <p key={idx} className="text-sm" style={{ color: '#fca5a5' }}>{err}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'details' && (
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
                style={glassInput}
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
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#C0C0C8' }} />
              <input
                type="text"
                value={formData.displayName}
                onChange={handleChange('displayName')}
                style={glassInput}
                className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="First and Last Name"
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
                style={glassInput}
                className="w-full pl-10 pr-4 py-3 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.email || !formData.displayName || !formData.invitationCode}
            className="w-full py-3 px-4 rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={glassButton}
          >
            {loading ? 'Sending code...' : 'Continue'}
          </button>
        </form>
      )}

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
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </button>

          <div className="text-center">
            <button
              onClick={handleResend}
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