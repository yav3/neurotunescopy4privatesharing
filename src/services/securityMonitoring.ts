import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';

export interface SecurityIncidentData {
  attempted_route: string;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  session_id?: string;
  user_id?: string;
  blocked: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  incident_type: string;
  headers?: Record<string, string>;
  request_body?: string;
  response_code?: number;
  payload_size?: number;
}

export interface ThreatIntelligence {
  vpn_detected: boolean;
  proxy_detected: boolean;
  tor_detected: boolean;
  datacenter_detected: boolean;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  attack_pattern?: string;
}

export interface GeolocationData {
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
}

export interface DeviceFingerprint {
  device_fingerprint: string;
  browser_language?: string;
  screen_resolution?: string;
  connection_type?: string;
  platform?: string;
  browser_name?: string;
  browser_version?: string;
}

class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private ipGeolocationCache = new Map<string, GeolocationData>();
  private threatCache = new Map<string, ThreatIntelligence>();

  static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  /**
   * Analyze IP address for threat intelligence
   */
  private async analyzeThreatIntelligence(ipAddress: string): Promise<ThreatIntelligence> {
    // Check cache first
    if (this.threatCache.has(ipAddress)) {
      return this.threatCache.get(ipAddress)!;
    }

    let threatData: ThreatIntelligence = {
      vpn_detected: false,
      proxy_detected: false,
      tor_detected: false,
      datacenter_detected: false,
      threat_level: 'low',
      risk_score: 0
    };

    try {
      // Known threat patterns (basic implementation)
      const knownVpnProviders = ['vultr', 'digitalocean', 'aws', 'azure', 'gcp'];
      const knownTorExits = ['tor exit node', 'tor project'];
      const knownProxies = ['proxy', 'vpn', 'hosting'];

      // Simple threat analysis based on IP patterns and known ranges
      const ipParts = ipAddress.split('.');
      const firstOctet = parseInt(ipParts[0]);
      
      // Datacenter IP ranges (simplified)
      if (firstOctet === 45 || firstOctet === 185 || firstOctet === 13) {
        threatData.datacenter_detected = true;
        threatData.risk_score += 30;
      }

      // TOR exit nodes (simplified detection)
      if (ipAddress.startsWith('185.220.') || ipAddress.startsWith('199.87.')) {
        threatData.tor_detected = true;
        threatData.proxy_detected = true;
        threatData.risk_score += 50;
        threatData.threat_level = 'high';
      }

      // VPN detection (simplified)
      if (firstOctet === 45 || firstOctet === 104) {
        threatData.vpn_detected = true;
        threatData.risk_score += 25;
      }

      // Determine overall threat level
      if (threatData.risk_score >= 70) {
        threatData.threat_level = 'critical';
      } else if (threatData.risk_score >= 50) {
        threatData.threat_level = 'high';
      } else if (threatData.risk_score >= 25) {
        threatData.threat_level = 'medium';
      }

    } catch (error) {
      logger.error('Threat intelligence analysis failed:', error);
    }

    // Cache the result
    this.threatCache.set(ipAddress, threatData);
    return threatData;
  }

  /**
   * Get geolocation data for IP address
   */
  private async getGeolocation(ipAddress: string): Promise<GeolocationData> {
    // Check cache first
    if (this.ipGeolocationCache.has(ipAddress)) {
      return this.ipGeolocationCache.get(ipAddress)!;
    }

    let geoData: GeolocationData = {};

    try {
      // For production, you'd integrate with a real IP geolocation service
      // For now, we'll provide mock data based on IP patterns
      
      if (ipAddress.startsWith('45.76.')) {
        geoData = {
          country: 'United States',
          country_code: 'US',
          region: 'California',
          city: 'Los Angeles',
          latitude: 34.0522,
          longitude: -118.2437,
          timezone: 'America/Los_Angeles',
          isp: 'Vultr Holdings LLC',
          organization: 'Cloud Infrastructure',
          asn: 'AS20473'
        };
      } else if (ipAddress.startsWith('185.220.')) {
        geoData = {
          country: 'Netherlands',
          country_code: 'NL',
          region: 'North Holland',
          city: 'Amsterdam',
          latitude: 52.3676,
          longitude: 4.9041,
          timezone: 'Europe/Amsterdam',
          isp: 'Tor Exit Node',
          organization: 'The Tor Project',
          asn: 'AS13335'
        };
      } else if (ipAddress.startsWith('39.156.')) {
        geoData = {
          country: 'China',
          country_code: 'CN',
          region: 'Beijing',
          city: 'Beijing',
          latitude: 39.9042,
          longitude: 116.4074,
          timezone: 'Asia/Shanghai',
          isp: 'Alibaba Cloud',
          organization: 'Cloud Computing',
          asn: 'AS37963'
        };
      }

      // Cache the result
      this.ipGeolocationCache.set(ipAddress, geoData);
      
    } catch (error) {
      logger.error('Geolocation lookup failed:', error);
    }

    return geoData;
  }

  /**
   * Generate device fingerprint from request data
   */
  private generateDeviceFingerprint(userAgent?: string, headers?: Record<string, string>): DeviceFingerprint {
    const fingerprint = {
      device_fingerprint: `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      browser_language: headers?.['accept-language'] || 'unknown',
      screen_resolution: 'unknown',
      connection_type: 'unknown',
      platform: 'unknown',
      browser_name: 'unknown',
      browser_version: 'unknown'
    };

    if (userAgent) {
      // Extract browser info from user agent
      if (userAgent.includes('Chrome')) {
        fingerprint.browser_name = 'Chrome';
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        fingerprint.browser_version = match ? match[1] : 'unknown';
      } else if (userAgent.includes('Firefox')) {
        fingerprint.browser_name = 'Firefox';
      } else if (userAgent.includes('Safari')) {
        fingerprint.browser_name = 'Safari';
      } else if (userAgent.includes('curl')) {
        fingerprint.browser_name = 'curl';
        fingerprint.connection_type = 'automated';
        fingerprint.device_fingerprint = 'fp_curl_automated';
      }

      // Extract platform
      if (userAgent.includes('Windows')) {
        fingerprint.platform = 'Windows';
      } else if (userAgent.includes('Mac')) {
        fingerprint.platform = 'macOS';
      } else if (userAgent.includes('Linux')) {
        fingerprint.platform = 'Linux';
      } else if (userAgent.includes('Android')) {
        fingerprint.platform = 'Android';
        fingerprint.connection_type = 'mobile';
      } else if (userAgent.includes('iPhone')) {
        fingerprint.platform = 'iOS';
        fingerprint.connection_type = 'mobile';
      }
    }

    return fingerprint;
  }

  /**
   * Determine attack pattern based on incident data
   */
  private analyzeAttackPattern(incidentData: SecurityIncidentData): string {
    const { attempted_route, user_agent, headers } = incidentData;

    // Admin panel targeting
    if (attempted_route.includes('/admin')) {
      return 'admin_panel_reconnaissance';
    }

    // Automated scanning
    if (user_agent?.includes('curl') || user_agent?.includes('bot') || user_agent?.includes('scanner')) {
      return 'automated_vulnerability_scan';
    }

    // API endpoint probing
    if (attempted_route.includes('/api')) {
      return 'api_endpoint_enumeration';
    }

    // Authentication bypass attempts
    if (attempted_route.includes('/auth') || attempted_route.includes('/login')) {
      return 'authentication_bypass_attempt';
    }

    // Directory traversal patterns
    if (attempted_route.includes('..') || attempted_route.includes('%2e%2e')) {
      return 'directory_traversal_attempt';
    }

    return 'general_unauthorized_access';
  }

  /**
   * Calculate risk score based on multiple factors
   */
  private calculateRiskScore(
    incidentData: SecurityIncidentData,
    threatIntel: ThreatIntelligence,
    geoData: GeolocationData
  ): number {
    let riskScore = threatIntel.risk_score;

    // Route-based risk
    if (incidentData.attempted_route.includes('/admin')) {
      riskScore += 25;
    }

    // User agent based risk
    if (incidentData.user_agent?.includes('curl') || incidentData.user_agent?.includes('bot')) {
      riskScore += 20;
    }

    // Geographic risk (high-risk countries)
    const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
    if (geoData.country_code && highRiskCountries.includes(geoData.country_code)) {
      riskScore += 15;
    }

    // Cap at 100
    return Math.min(riskScore, 100);
  }

  /**
   * Log security incident with comprehensive analysis
   */
  async logSecurityIncident(incidentData: SecurityIncidentData): Promise<string | null> {
    try {
      const ipAddress = incidentData.ip_address || 'unknown';
      
      // Perform comprehensive analysis
      const [threatIntel, geoData] = await Promise.all([
        this.analyzeThreatIntelligence(ipAddress),
        this.getGeolocation(ipAddress)
      ]);

      const deviceFingerprint = this.generateDeviceFingerprint(
        incidentData.user_agent, 
        incidentData.headers
      );

      const attackPattern = this.analyzeAttackPattern(incidentData);
      const riskScore = this.calculateRiskScore(incidentData, threatIntel, geoData);

      // Prepare incident record for database
      const incidentRecord = {
        attempted_route: incidentData.attempted_route,
        ip_address: ipAddress,
        user_agent: incidentData.user_agent,
        referer: incidentData.referer,
        session_id: incidentData.session_id,
        user_id: incidentData.user_id,
        blocked: incidentData.blocked,
        severity: incidentData.severity,
        incident_type: incidentData.incident_type,
        
        // Geographic data
        country: geoData.country,
        country_code: geoData.country_code,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
        isp: geoData.isp,
        organization: geoData.organization,
        asn: geoData.asn,
        
        // Threat intelligence
        threat_level: threatIntel.threat_level,
        vpn_detected: threatIntel.vpn_detected,
        proxy_detected: threatIntel.proxy_detected,
        tor_detected: threatIntel.tor_detected,
        datacenter_detected: threatIntel.datacenter_detected,
        
        // Device fingerprinting
        device_fingerprint: deviceFingerprint.device_fingerprint,
        browser_language: deviceFingerprint.browser_language,
        screen_resolution: deviceFingerprint.screen_resolution,
        connection_type: deviceFingerprint.connection_type,
        platform: deviceFingerprint.platform,
        browser_name: deviceFingerprint.browser_name,
        browser_version: deviceFingerprint.browser_version,
        
        // Forensic data
        headers: incidentData.headers,
        request_body: incidentData.request_body,
        response_code: incidentData.response_code,
        payload_size: incidentData.payload_size,
        
        // Analysis results
        risk_score: riskScore,
        attack_pattern: attackPattern,
        mitigation_action: incidentData.blocked ? 'blocked_by_auth_guard' : 'allowed',
        follow_up_required: riskScore >= 70
      };

      // Insert into database
      const { data, error } = await supabase
        .from('security_incidents')
        .insert(incidentRecord)
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to log security incident:', error);
        return null;
      }

      // Log critical incidents immediately
      if (riskScore >= 70) {
        logger.warn(`CRITICAL SECURITY INCIDENT: ${attackPattern} from ${ipAddress} targeting ${incidentData.attempted_route}`);
      }

      return data.id;

    } catch (error) {
      logger.error('Security incident logging failed:', error);
      return null;
    }
  }

  /**
   * Get recent security incidents from database
   */
  async getRecentIncidents(limit: number = 50, timeFilter: string = '24h'): Promise<any[]> {
    try {
      let timeThreshold = new Date();
      
      switch (timeFilter) {
        case '1h':
          timeThreshold.setHours(timeThreshold.getHours() - 1);
          break;
        case '6h':
          timeThreshold.setHours(timeThreshold.getHours() - 6);
          break;
        case '24h':
          timeThreshold.setHours(timeThreshold.getHours() - 24);
          break;
        case '7d':
          timeThreshold.setDate(timeThreshold.getDate() - 7);
          break;
        default:
          timeThreshold.setHours(timeThreshold.getHours() - 24);
      }

      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .gte('timestamp', timeThreshold.toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Failed to fetch security incidents:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      logger.error('Error fetching security incidents:', error);
      return [];
    }
  }

  /**
   * Get security statistics
   */
  async getSecurityStats(timeFilter: string = '24h'): Promise<any> {
    try {
      let timeThreshold = new Date();
      
      switch (timeFilter) {
        case '1h':
          timeThreshold.setHours(timeThreshold.getHours() - 1);
          break;
        case '6h':
          timeThreshold.setHours(timeThreshold.getHours() - 6);
          break;
        case '24h':
          timeThreshold.setHours(timeThreshold.getHours() - 24);
          break;
        case '7d':
          timeThreshold.setDate(timeThreshold.getDate() - 7);
          break;
        default:
          timeThreshold.setHours(timeThreshold.getHours() - 24);
      }

      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .gte('timestamp', timeThreshold.toISOString());

      if (error) {
        logger.error('Failed to fetch security stats:', error);
        return this.getDefaultStats();
      }

      const incidents = data || [];
      const totalIncidents = incidents.length;
      const blockedAttempts = incidents.filter(i => i.blocked).length;
      const uniqueIPs = new Set(incidents.map(i => i.ip_address)).size;
      
      // Find most targeted route
      const routeCounts = incidents.reduce((acc, incident) => {
        acc[incident.attempted_route] = (acc[incident.attempted_route] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostTargetedRoute = Object.entries(routeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '/admin';
      
      // Calculate risk level
      const highRiskIncidents = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;
      const riskLevel = highRiskIncidents > totalIncidents * 0.3 ? 'high' : 
                       highRiskIncidents > totalIncidents * 0.1 ? 'medium' : 'low';
      
      // Trends in last hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      const trendsLastHour = incidents.filter(i => 
        new Date(i.timestamp) > oneHourAgo
      ).length;

      return {
        totalIncidents,
        blockedAttempts,
        uniqueIPs,
        mostTargetedRoute,
        riskLevel,
        trendsLastHour,
        highRiskIncidents,
        criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
        topCountries: this.getTopCountries(incidents),
        topThreatTypes: this.getTopThreatTypes(incidents)
      };

    } catch (error) {
      logger.error('Error calculating security stats:', error);
      return this.getDefaultStats();
    }
  }

  private getDefaultStats() {
    return {
      totalIncidents: 0,
      blockedAttempts: 0,
      uniqueIPs: 0,
      mostTargetedRoute: '/admin',
      riskLevel: 'low',
      trendsLastHour: 0,
      highRiskIncidents: 0,
      criticalIncidents: 0,
      topCountries: [],
      topThreatTypes: []
    };
  }

  private getTopCountries(incidents: any[]): Array<{country: string, count: number}> {
    const countryCounts = incidents.reduce((acc, incident) => {
      const country = incident.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([country, count]) => ({ country, count: count as number }));
  }

  private getTopThreatTypes(incidents: any[]): Array<{type: string, count: number}> {
    const typeCounts = incidents.reduce((acc, incident) => {
      const type = incident.attack_pattern || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count: count as number }));
  }
}

export const securityMonitoring = SecurityMonitoringService.getInstance();