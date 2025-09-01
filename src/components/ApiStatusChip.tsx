import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { API } from '@/lib/api';

interface ApiStatusChipProps {
  className?: string;
}

export const ApiStatusChip: React.FC<ApiStatusChipProps> = ({ className }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setStatus('checking');
        await API.health();
        setStatus('online');
        setLastCheck(new Date());
      } catch (error) {
        console.error('[API_STATUS] Health check failed:', error);
        setStatus('offline');
        setLastCheck(new Date());
      }
    };

    // Check immediately on mount
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return { variant: 'secondary' as const, text: 'Checking...', color: 'text-yellow-600' };
      case 'online':
        return { variant: 'default' as const, text: 'API Online', color: 'text-green-600' };
      case 'offline':
        return { variant: 'destructive' as const, text: 'API Offline', color: 'text-red-600' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={`${config.color} ${className || ''}`}>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-400 animate-pulse' :
          status === 'checking' ? 'bg-yellow-400 animate-pulse' :
          'bg-red-400'
        }`} />
        {config.text}
        {lastCheck && (
          <span className="text-xs opacity-70 ml-1">
            {lastCheck.toLocaleTimeString()}
          </span>
        )}
      </div>
    </Badge>
  );
};