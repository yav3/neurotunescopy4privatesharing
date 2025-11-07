import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { AuthProvider } from './AuthProvider';

interface AuthPageProps {
  onBack?: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Ambient light effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }} />
        
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-6 left-6 text-white hover:text-white hover:bg-white/10 z-50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}
        
        {/* Glass morphism auth card */}
        <div className="relative z-40 bg-black/60 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-glass-enhanced">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          
          <div className="relative">
            {isLoginMode ? (
              <LoginForm onToggleMode={() => setIsLoginMode(false)} />
            ) : (
              <SignupForm onToggleMode={() => setIsLoginMode(true)} />
            )}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}