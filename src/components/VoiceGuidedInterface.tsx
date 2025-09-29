import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceCommandProcessor } from '@/utils/VoiceActivation';
import { VoiceActivationButton } from './VoiceActivationButton';
import { Card } from '@/components/ui/card';
import { Headphones, Heart } from 'lucide-react';

export const VoiceGuidedInterface: React.FC = () => {
  const navigate = useNavigate();
  const voiceProcessorRef = useRef<VoiceCommandProcessor | null>(null);

  useEffect(() => {
    // Initialize voice processor
    voiceProcessorRef.current = new VoiceCommandProcessor(navigate);

    // Listen for stop music events
    const handleStopMusic = () => {
      // Import and use audio store to stop music
      import('@/stores').then(({ useAudioStore }) => {
        const audioStore = useAudioStore.getState();
        audioStore.pause();
      });
    };

    window.addEventListener('voice-stop-music', handleStopMusic);

    return () => {
      voiceProcessorRef.current?.stop();
      window.removeEventListener('voice-stop-music', handleStopMusic);
    };
  }, [navigate]);

  const handleVoiceToggle = (enabled: boolean) => {
    if (enabled) {
      voiceProcessorRef.current?.start();
      voiceProcessorRef.current?.speak('Voice commands are now active. Say "Hello NeuroTunes" and then tell me what you need.');
    } else {
      voiceProcessorRef.current?.stop();
    }
  };

  const isSupported = voiceProcessorRef.current?.isSupported() ?? false;

  return (
    <div className="space-y-6">
      {/* Voice Activation Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <Headphones className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Voice-Guided Music Therapy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Designed for easy access - just speak to find your perfect therapeutic music
          </p>
        </div>

        <VoiceActivationButton
          onToggle={handleVoiceToggle}
          isSupported={isSupported}
        />
      </Card>

      {/* Quick Guide */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Voice Commands Guide
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Health Support:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>"I need anxiety support"</li>
              <li>"Help with stress"</li>
              <li>"I'm in pain"</li>
              <li>"I need sleep help"</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Enhancement:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>"I need energy boost"</li>
              <li>"Help me focus"</li>
              <li>"Start meditation"</li>
              <li>"Improve my mood"</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Navigation:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>"Go home"</li>
              <li>"Show me goals"</li>
              <li>"Stop music"</li>
              <li>"Help"</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Getting Started:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>1. Enable voice commands above</li>
              <li>2. Say "Hello NeuroTunes"</li>
              <li>3. Wait for the response</li>
              <li>4. Tell me what you need</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};