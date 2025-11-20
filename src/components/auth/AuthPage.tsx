import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { AuthProvider, useAuthContext } from './AuthProvider';
import { RegistrationChatbot } from './RegistrationChatbot';

interface AuthPageProps {
  onBack?: () => void;
}

function AuthPageContent({ onBack }: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  // Redirect authenticated users to goals page
  useEffect(() => {
    if (!loading && user) {
      console.log('✅ User already authenticated, redirecting to music player');
      navigate('/goals');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Pure black background */}
        <div className="absolute inset-0 bg-black" />
        
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
        <div 
          className="relative z-40 rounded-3xl p-8 w-full max-w-md"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.3),
              inset 0 2px 8px rgba(255, 255, 255, 0.1),
              inset 0 -2px 8px rgba(0, 0, 0, 0.5),
              0 8px 32px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          
          <div className="relative">
            {isLoginMode ? (
              <LoginForm onToggleMode={() => setIsLoginMode(false)} />
            ) : (
              <SignupForm onToggleMode={() => setIsLoginMode(true)} />
            )}
          </div>
        </div>
        <RegistrationChatbot />
      </div>
  );
}

export function AuthPage(props: AuthPageProps) {
  return (
    <AuthProvider>
      <AuthPageContent {...props} />
    </AuthProvider>
  );
}