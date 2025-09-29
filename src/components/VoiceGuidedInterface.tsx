import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceCommandProcessor } from '@/utils/VoiceActivation';
import { VoiceActivationButton } from './VoiceActivationButton';
import { Card } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

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

    </div>
  );
};