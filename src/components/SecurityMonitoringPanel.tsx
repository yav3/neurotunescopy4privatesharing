import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Globe, Activity, Database, Eye, TrendingUp } from 'lucide-react';
import { securityMonitoring } from '@/services/securityMonitoring';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  totalIncidents: number;
  criticalIncidents: number;
  highRiskIncidents: number;
  blockedAttempts: number;
  uniqueIPs: number;
  topCountries: Array<{country: string, count: number}>;
  topThreatTypes: Array<{type: string, count: number}>;
  riskLevel: 'low' | 'medium' | 'high';
}

export const SecurityMonitoringPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalIncidents: 0,
    criticalIncidents: 0,
    highRiskIncidents: 0,
    blockedAttempts: 0,
    uniqueIPs: 0,
    topCountries: [],
    topThreatTypes: [],
    riskLevel: 'low'
  });
  const [loading, setLoading] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityMetrics();
    
    // Set up real-time updates if enabled
    let interval: NodeJS.Timeout | null = null;
    if (realTimeMode) {
      interval = setInterval(fetchSecurityMetrics, 30000); // Update every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeMode]);

  const fetchSecurityMetrics = async () => {
    try {
      setLoading(true);
      const stats = await securityMonitoring.getSecurityStats('24h');
      
      setMetrics({
        totalIncidents: stats.totalIncidents,
        criticalIncidents: stats.criticalIncidents,
        highRiskIncidents: stats.highRiskIncidents,
        blockedAttempts: stats.blockedAttempts,
        uniqueIPs: stats.uniqueIPs,
        topCountries: stats.topCountries || [],
        topThreatTypes: stats.topThreatTypes || [],
        riskLevel: stats.riskLevel
      });

    } catch (error: any) {
      console.error('Failed to fetch security metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security metrics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getThreatTypeColor = (type: string) => {
    const colors = {
      'admin_panel_reconnaissance': 'bg-red-100 text-red-800',
      'automated_vulnerability_scan': 'bg-orange-100 text-orange-800',
      'api_endpoint_enumeration': 'bg-yellow-100 text-yellow-800',
      'authentication_bypass_attempt': 'bg-purple-100 text-purple-800',
      'directory_traversal_attempt': 'bg-pink-100 text-pink-800',
      'general_unauthorized_access': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading security metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Real-Time Security Monitoring
          </h2>
          <p className="text-muted-foreground">
            Live threat detection and comprehensive attack analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={realTimeMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRealTimeMode(!realTimeMode)}
          >
            <Activity className="h-4 w-4 mr-2" />
            {realTimeMode ? 'Real-time ON' : 'Real-time OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchSecurityMetrics}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {metrics.criticalIncidents > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              CRITICAL SECURITY ALERT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {metrics.criticalIncidents} critical security incident{metrics.criticalIncidents !== 1 ? 's' : ''} detected in the last 24 hours. 
              Immediate investigation required.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.highRiskIncidents}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.blockedAttempts}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalIncidents > 0 ? Math.round((metrics.blockedAttempts / metrics.totalIncidents) * 100) : 100}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueIPs}</div>
            <p className="text-xs text-muted-foreground">Attack sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Current Threat Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRiskLevelColor(metrics.riskLevel)}`}>
            {metrics.riskLevel.toUpperCase()} RISK
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on recent attack patterns, threat intelligence, and incident severity
          </p>
        </CardContent>
      </Card>

      {/* Top Attack Sources */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Attack Sources</CardTitle>
            <CardDescription>Countries with highest incident counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topCountries.length > 0 ? (
                metrics.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <Badge variant="secondary">
                      {country.count} incidents
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attack Patterns</CardTitle>
            <CardDescription>Most common threat types detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topThreatTypes.length > 0 ? (
                metrics.topThreatTypes.map((threat, index) => (
                  <div key={threat.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <Badge className={getThreatTypeColor(threat.type)}>
                        {threat.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{threat.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};