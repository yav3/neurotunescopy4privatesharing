import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { AuthProvider } from './AuthProvider';

export function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
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