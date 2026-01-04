import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { LovableLandingPage } from '@/components/landing/LovableLandingPage';

const Index = () => {
  useWelcomeMessage();
  const navigate = useNavigate();
  
  const [showExperience, setShowExperience] = useState(false);

  // Kill ALL orphaned audio elements on mount to prevent overlaps
  useEffect(() => {
    console.log('🧹 Index mount - killing orphaned audio');
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.src = '';
    });
  }, []);

  const handleExplore = () => {
    // Navigate to the app experience
    navigate('/app');
  };

  // If user wants full experience, we can toggle to it
  if (showExperience) {
    navigate('/app');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: 'hsl(240 8% 4%)' }}>
      {/* Header - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavigationHeader />
      </div>
      
      {/* Typography-led Landing Page */}
      <LovableLandingPage onExplore={handleExplore} />
      
      {/* Hidden Sales Assistant (triggered from header) */}
      <SalesAssistant externalOpen={false} />
    </div>
  );
};

export default Index;
