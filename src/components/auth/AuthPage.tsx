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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {/* All black background */}
        <div className="absolute inset-0 bg-black" />
        
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-white hover:bg-gray-800 z-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}
        <div className="relative z-40 bg-black backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-gray-800 shadow-lg">
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