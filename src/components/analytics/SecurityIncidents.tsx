import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Globe, Clock, User, Shield, MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationDetails {
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  asn?: string;
  threat_level?: string;
  vpn_detected?: boolean;
  proxy_detected?: boolean;
}

interface SecurityIncident {
  id: string;
  timestamp: string;
  attempted_route: string;
  user_agent: string;
  ip_address?: string;
  location?: string;
  location_details?: LocationDetails;
  blocked: boolean;
  severity: 'low' | 'medium' | 'high';
  session_id?: string;
  referer?: string;
  device_fingerprint?: string;
  browser_language?: string;
  screen_resolution?: string;
  connection_type?: string;
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

      // Import security monitoring service
      const { securityMonitoring } = await import('@/services/securityMonitoring');
      
      // Fetch real security incidents from database
      const [incidents, stats] = await Promise.all([
        securityMonitoring.getRecentIncidents(50, timeFilter),
        securityMonitoring.getSecurityStats(timeFilter)
      ]);

      // Transform database incidents to match component interface
      const transformedIncidents: SecurityIncident[] = incidents.map(incident => ({
        id: incident.id,
        timestamp: incident.timestamp,
        attempted_route: incident.attempted_route,
        user_agent: incident.user_agent || 'Unknown',
        ip_address: incident.ip_address,
        location: incident.city && incident.country ? `${incident.city}, ${incident.country}` : incident.country || 'Unknown',
        location_details: {
          country: incident.country,
          country_code: incident.country_code,
          region: incident.region,
          city: incident.city,
          latitude: incident.latitude ? parseFloat(incident.latitude) : undefined,
          longitude: incident.longitude ? parseFloat(incident.longitude) : undefined,
          timezone: incident.timezone,
          isp: incident.isp,
          organization: incident.organization,
          asn: incident.asn,
          threat_level: incident.threat_level,
          vpn_detected: incident.vpn_detected,
          proxy_detected: incident.proxy_detected
        },
        blocked: incident.blocked,
        severity: incident.severity,
        session_id: incident.session_id,
        referer: incident.referer,
        device_fingerprint: incident.device_fingerprint,
        browser_language: incident.browser_language,
        screen_resolution: incident.screen_resolution,
        connection_type: incident.connection_type
      }));

      const transformedStats: SecurityStats = {
        totalIncidents: stats.totalIncidents,
        blockedAttempts: stats.blockedAttempts,
        uniqueIPs: stats.uniqueIPs,
        mostTargetedRoute: stats.mostTargetedRoute,
        riskLevel: stats.riskLevel,
        trendsLastHour: stats.trendsLastHour
      };

      setIncidents(transformedIncidents);
      setStats(transformedStats);

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
                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Geographic Location
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Country:</span>
                            <span className="font-medium">
                              {incident.location_details?.country || 'Unknown'} 
                              {incident.location_details?.country_code && ` (${incident.location_details.country_code})`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">City:</span>
                            <span>{incident.location_details?.city || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Region:</span>
                            <span>{incident.location_details?.region || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Coordinates:</span>
                            <span className="font-mono text-xs">
                              {incident.location_details?.latitude && incident.location_details?.longitude 
                                ? `${incident.location_details.latitude.toFixed(4)}, ${incident.location_details.longitude.toFixed(4)}`
                                : 'Unknown'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timezone:</span>
                            <span className="font-mono text-xs">{incident.location_details?.timezone || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Network & ISP Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">{incident.ip_address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ISP:</span>
                            <span>{incident.location_details?.isp || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Organization:</span>
                            <span>{incident.location_details?.organization || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ASN:</span>
                            <span className="font-mono text-xs">{incident.location_details?.asn || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Connection:</span>
                            <span className="capitalize">{incident.connection_type || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Threat Assessment
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Threat Level:</span>
                            <Badge className={
                              incident.location_details?.threat_level === 'high' ? 'bg-red-500/10 text-red-700 border-red-200' :
                              incident.location_details?.threat_level === 'medium' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' :
                              'bg-green-500/10 text-green-700 border-green-200'
                            }>
                              {incident.location_details?.threat_level?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">VPN Detected:</span>
                            <Badge variant={incident.location_details?.vpn_detected ? 'destructive' : 'secondary'}>
                              {incident.location_details?.vpn_detected ? 'YES' : 'NO'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Proxy Detected:</span>
                            <Badge variant={incident.location_details?.proxy_detected ? 'destructive' : 'secondary'}>
                              {incident.location_details?.proxy_detected ? 'YES' : 'NO'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Device Fingerprint:</span>
                            <span className="font-mono text-xs">{incident.device_fingerprint || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Browser Language:</span>
                            <span>{incident.browser_language || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Screen Resolution:</span>
                            <span className="font-mono text-xs">{incident.screen_resolution || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Technical Details
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">User Agent:</span>
                            <span className="font-mono text-xs max-w-[300px] truncate">
                              {incident.user_agent}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Referer:</span>
                            <span className="font-mono text-xs max-w-[200px] truncate">{incident.referer}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Session ID:</span>
                            <span className="font-mono text-xs">{incident.session_id || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Action Taken:</span>
                            <Badge variant={incident.blocked ? 'default' : 'destructive'}>
                              {incident.blocked ? 'BLOCKED' : 'ALLOWED'}
                            </Badge>
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