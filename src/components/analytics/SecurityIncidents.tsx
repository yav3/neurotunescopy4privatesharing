import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Globe, Clock, User, Shield, MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityIncident {
  id: string;
  timestamp: string;
  attempted_route: string;
  user_agent: string;
  ip_address?: string;
  location?: string;
  blocked: boolean;
  severity: 'low' | 'medium' | 'high';
  session_id?: string;
  referer?: string;
}

interface SecurityStats {
  totalIncidents: number;
  blockedAttempts: number;
  uniqueIPs: number;
  mostTargetedRoute: string;
  riskLevel: 'low' | 'medium' | 'high';
  trendsLastHour: number;
}

export const SecurityIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalIncidents: 0,
    blockedAttempts: 0,
    uniqueIPs: 0,
    mostTargetedRoute: '',
    riskLevel: 'low',
    trendsLastHour: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityIncidents();
    const interval = setInterval(fetchSecurityIncidents, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchSecurityIncidents = async () => {
    try {
      setLoading(true);

      // Simulate fetching security incidents data
      // In a real app, this would come from your security monitoring system
      const mockIncidents: SecurityIncident[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          attempted_route: '/admin/settings',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ip_address: '192.168.1.105',
          location: 'Unknown Location',
          blocked: true,
          severity: 'high',
          session_id: 'sess_suspicious_001',
          referer: 'https://google.com'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
          attempted_route: '/admin',
          user_agent: 'curl/7.68.0',
          ip_address: '203.0.113.45',
          location: 'Unknown Location',
          blocked: true,
          severity: 'high',
          referer: 'direct'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          attempted_route: '/goals',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          ip_address: '198.51.100.23',
          location: 'Mobile Device',
          blocked: true,
          severity: 'medium',
          referer: 'https://neurotunes.app/landing'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
          attempted_route: '/monitoring',
          user_agent: 'PostmanRuntime/7.29.2',
          ip_address: '172.16.0.1',
          location: 'API Client',
          blocked: true,
          severity: 'medium',
          referer: 'direct'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1000 * 60 * 89).toISOString(),
          attempted_route: '/admin/analytics',
          user_agent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
          ip_address: '10.0.0.15',
          location: 'Android Device',
          blocked: true,
          severity: 'high',
          referer: 'https://suspicious-site.com'
        }
      ];

      const mockStats: SecurityStats = {
        totalIncidents: mockIncidents.length,
        blockedAttempts: mockIncidents.filter(i => i.blocked).length,
        uniqueIPs: new Set(mockIncidents.map(i => i.ip_address)).size,
        mostTargetedRoute: '/admin',
        riskLevel: mockIncidents.some(i => i.severity === 'high') ? 'high' : 'medium',
        trendsLastHour: mockIncidents.filter(i => 
          new Date(i.timestamp).getTime() > Date.now() - 1000 * 60 * 60
        ).length
      };

      setIncidents(mockIncidents);
      setStats(mockStats);

    } catch (error: any) {
      console.error('Error fetching security incidents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch security incident data: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const toggleIncidentDetails = (id: string) => {
    setExpandedIncident(expandedIncident === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            Security Incident Analysis
          </h2>
          <p className="text-muted-foreground">
            Detailed analysis of unauthorized access attempts and security events
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeFilter === '1h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('1h')}
          >
            1H
          </Button>
          <Button
            variant={timeFilter === '6h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('6h')}
          >
            6H
          </Button>
          <Button
            variant={timeFilter === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('24h')}
          >
            24H
          </Button>
          <Button
            variant={timeFilter === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('7d')}
          >
            7D
          </Button>
        </div>
      </div>

      {/* Security Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.trendsLastHour} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.blockedAttempts}</div>
            <p className="text-xs text-muted-foreground">
              100% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
            <p className="text-xs text-muted-foreground">
              Different sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Targeted</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostTargetedRoute}</div>
            <p className="text-xs text-muted-foreground">
              Admin routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getRiskLevelColor(stats.riskLevel)}`}>
              {stats.riskLevel}
            </div>
            <p className="text-xs text-muted-foreground">
              Current threat level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Incident List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recent Security Incidents
          </CardTitle>
          <CardDescription>
            Detailed breakdown of unauthorized access attempts with full context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className={`h-5 w-5 ${
                      incident.severity === 'high' ? 'text-red-500' : 
                      incident.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">
                          {incident.attempted_route}
                        </span>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                        {incident.blocked && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                            BLOCKED
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(incident.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {incident.ip_address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleIncidentDetails(incident.id)}
                  >
                    {expandedIncident === incident.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedIncident === incident.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">Technical Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">User Agent:</span>
                            <span className="font-mono text-xs max-w-[200px] truncate">
                              {incident.user_agent}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">{incident.ip_address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{incident.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Referer:</span>
                            <span className="font-mono text-xs">{incident.referer}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">Security Context</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Session ID:</span>
                            <span className="font-mono text-xs">{incident.session_id || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Threat Level:</span>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Action Taken:</span>
                            <span className="text-green-600 font-medium">
                              {incident.blocked ? 'Access Denied' : 'Allowed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};