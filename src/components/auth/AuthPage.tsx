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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Clean background with subtle teal accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-teal-50/5" />
        
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground hover:bg-accent z-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}
        <div className="relative z-40 bg-card backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-border shadow-lg ring-1 ring-primary/5">
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    </AuthProvider>
  );
}