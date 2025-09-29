import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceActivationButtonProps {
  onToggle: (enabled: boolean) => void;
  isSupported: boolean;
  className?: string;
}

export const VoiceActivationButton: React.FC<VoiceActivationButtonProps> = ({
  onToggle,
  isSupported,
  className
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState<'listening' | 'idle' | 'processing'>('idle');

  useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      setStatus(event.detail);
    };

    window.addEventListener('voice-status-change', handleStatusChange as EventListener);
    return () => {
      window.removeEventListener('voice-status-change', handleStatusChange as EventListener);
    };
  }, []);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    onToggle(newEnabled);
  };

  if (!isSupported) {
    return (
      <div className={cn("text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800", className)}>
        <MicOff className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Voice commands not supported in this browser
        </p>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return isEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 hover:bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!isEnabled) return 'Enable Voice Commands';
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      default:
        return 'Voice Ready';
    }
  };

  const getStatusIcon = () => {
    if (status === 'processing') {
      return <Volume2 className="w-6 h-6" />;
    }
    return isEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />;
  };

  return (
    <div className={cn("text-center space-y-3", className)}>
      <Button
        onClick={handleToggle}
        size="lg"
        className={cn(
          "w-full py-4 px-6 text-white transition-all duration-300",
          getStatusColor(),
          status === 'listening' && "animate-pulse"
        )}
      >
        <div className="flex items-center justify-center space-x-3">
          {getStatusIcon()}
          <span className="font-medium text-lg">{getStatusText()}</span>
        </div>
      </Button>
      
      {isEnabled && (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Say "Hello NeuroTunes" then tell me what you need
          </p>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p>Visit the FAQ (?) for complete voice command guide</p>
          </div>
        </div>
      )}
    </div>
  );
};