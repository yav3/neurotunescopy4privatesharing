import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { API } from '@/lib/api';

interface ApiStatusChipProps {
  className?: string;
}

export const ApiStatusChip: React.FC<ApiStatusChipProps> = ({ className }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setStatus('checking');
        await API.health();
        setStatus('online');
        setLastCheck(new Date());
        setError('');
      } catch (e: any) {
        console.error('[API_STATUS] Health check failed:', e);
        setStatus('offline');
        setLastCheck(new Date());
        setError(e.message || 'Health check failed');
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
        return { variant: 'secondary' as const, text: 'API...', color: 'text-yellow-600' };
      case 'online':
        return { variant: 'default' as const, text: 'API OK', color: 'text-green-600' };
      case 'offline':
        return { variant: 'destructive' as const, text: 'API Error', color: 'text-red-600' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={`${config.color} ${className || ''}`} title={error}>
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
        {error && (
          <span className="ml-1 text-xs opacity-75" title={error}>⚠️</span>
        )}
      </div>
    </Badge>
  );
};