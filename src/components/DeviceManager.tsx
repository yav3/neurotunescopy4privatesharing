import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet, MapPin, Calendar, Trash2, Shield } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  screen: string;
  [key: string]: any; // Make it compatible with Json type
}

interface UserSession {
  id: string;
  device_info: DeviceInfo;
  last_accessed: string;
  ip_address?: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

export function DeviceManager() {
  const { sessionManager } = useAuthContext();

  useEffect(() => {
    sessionManager?.refreshSessions();
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const isCurrentSession = (sessionId: string) => {
    return sessionId === sessionManager?.currentSessionId;
  };

  if (!sessionManager) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Device Management
        </CardTitle>
        <CardDescription>
          Manage your active sessions across different devices for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessionManager.sessions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active sessions found</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {sessionManager.sessions.map((session: UserSession) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isCurrentSession(session.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(session.device_info.device)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {session.device_info.browser} on {session.device_info.os}
                        </h4>
                        {isCurrentSession(session.id) && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          {getDeviceIcon(session.device_info.device)}
                          <span>{session.device_info.device}</span>
                          <span>•</span>
                          <span>{session.device_info.screen}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Last active: {format(new Date(session.last_accessed), 'MMM d, h:mm a')}</span>
                        </div>
                        {session.ip_address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>IP: {session.ip_address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCurrentSession(session.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sessionManager.revokeSession(session.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {sessionManager.sessions.length > 1 && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={sessionManager.revokeAllOtherSessions}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke All Other Sessions
                </Button>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">
                  <strong>Security tip:</strong> If you see any unfamiliar devices or locations, 
                  revoke those sessions immediately and consider changing your password.
                </p>
                <p>
                  Sessions automatically expire after 30 days of inactivity for your security.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}