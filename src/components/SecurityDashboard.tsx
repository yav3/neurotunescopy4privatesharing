import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { secureApi } from '@/services/secureApi';
import { securityMonitoring } from '@/services/securityMonitoring';
import { Shield, AlertTriangle, Ban, Activity, RefreshCw } from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const [securityStats, setSecurityStats] = useState({
    blockedIPs: 0,
    activeRateLimits: 0,
    rateLimitViolations: 0,
    totalRequests: 0
  });
  
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Get API security stats
      const apiStats = secureApi.getSecurityStats();
      setSecurityStats(apiStats);
      
      // Get recent security incidents
      const incidents = await securityMonitoring.getRecentIncidents(20, '1h');
      setRecentIncidents(incidents);
      
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const clearSecurityData = () => {
    secureApi.clearSecurityData();
    loadSecurityData();
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={loadSecurityData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={clearSecurityData} variant="outline" size="sm">
            Clear Data
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{securityStats.blockedIPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.activeRateLimits}</div>
            <p className="text-xs text-muted-foreground">Active limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{securityStats.rateLimitViolations}</div>
            <p className="text-xs text-muted-foreground">Rate limit hits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityStats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Processed securely</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Incidents (Last Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentIncidents.length === 0 ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                No security incidents detected in the last hour. System is secure.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getThreatLevelColor(incident.severity)}>
                        {incident.severity?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                      <span className="text-sm font-medium">{incident.incident_type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Route: {incident.attempted_route}</p>
                      <p>IP: {incident.ip_address || 'Unknown'}</p>
                      <p>User Agent: {incident.user_agent?.substring(0, 50) || 'Unknown'}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={incident.blocked ? 'destructive' : 'secondary'}>
                      {incident.blocked ? 'BLOCKED' : 'ALLOWED'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(incident.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};