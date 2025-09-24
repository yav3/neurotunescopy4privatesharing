import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityIncidentData {
  attempted_route: string;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  session_id?: string;
  user_id?: string;
  blocked: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  incident_type: string;
  headers?: Record<string, any>;
  request_body?: string;
  response_code?: number;
  payload_size?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get client IP from headers
    const getClientIP = (request: Request): string => {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIP = request.headers.get('x-real-ip');
      const cfConnectingIP = request.headers.get('cf-connecting-ip');
      
      return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
    };

    // Enhanced geolocation lookup
    const getGeolocation = async (ipAddress: string) => {
      try {
        // Use a free IP geolocation service (in production, use a premium service)
        const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query`);
        const data = await response.json();
        
        if (data.status === 'success') {
          return {
            country: data.country,
            country_code: data.countryCode,
            region: data.regionName,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            isp: data.isp,
            organization: data.org,
            asn: data.as
          };
        }
      } catch (error) {
        console.error('Geolocation lookup failed:', error);
      }
      
      return null;
    };

    // Enhanced threat intelligence analysis
    const analyzeThreatIntelligence = async (ipAddress: string, userAgent: string, geoData: any) => {
      let threatData = {
        vpn_detected: false,
        proxy_detected: false,
        tor_detected: false,
        datacenter_detected: false,
        threat_level: 'low' as 'low' | 'medium' | 'high' | 'critical',
        risk_score: 0
      };

      // Known threat indicators
      const knownTorExits = ['tor', 'exit node', 'relay'];
      const knownVpnProviders = ['vpn', 'proxy', 'hosting', 'cloud', 'server'];
      const datacenterASNs = ['aws', 'azure', 'google', 'digitalocean', 'vultr', 'linode'];

      // TOR detection
      if (geoData?.organization?.toLowerCase().includes('tor') || 
          geoData?.isp?.toLowerCase().includes('tor')) {
        threatData.tor_detected = true;
        threatData.proxy_detected = true;
        threatData.risk_score += 50;
        threatData.threat_level = 'high';
      }

      // VPN/Proxy detection
      if (geoData?.isp && knownVpnProviders.some(provider => 
          geoData.isp.toLowerCase().includes(provider))) {
        threatData.vpn_detected = true;
        threatData.risk_score += 25;
      }

      // Datacenter detection
      if (geoData?.organization && datacenterASNs.some(provider => 
          geoData.organization.toLowerCase().includes(provider))) {
        threatData.datacenter_detected = true;
        threatData.risk_score += 20;
      }

      // User agent analysis
      if (userAgent.includes('curl') || userAgent.includes('bot') || userAgent.includes('scanner')) {
        threatData.risk_score += 30;
      }

      // Suspicious countries (adjust based on your threat model)
      const highRiskCountries = ['CN', 'RU', 'IR', 'KP'];
      if (geoData?.country_code && highRiskCountries.includes(geoData.country_code)) {
        threatData.risk_score += 15;
      }

      // Determine threat level
      if (threatData.risk_score >= 70) {
        threatData.threat_level = 'critical';
      } else if (threatData.risk_score >= 50) {
        threatData.threat_level = 'high';
      } else if (threatData.risk_score >= 25) {
        threatData.threat_level = 'medium';
      } else {
        threatData.threat_level = 'low';
      }

      return threatData;
    };

    // Generate device fingerprint
    const generateDeviceFingerprint = (userAgent: string, headers: Record<string, any>) => {
      const fingerprint = {
        device_fingerprint: `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        browser_language: headers['accept-language'] || 'unknown',
        screen_resolution: 'unknown',
        connection_type: 'unknown',
        platform: 'unknown',
        browser_name: 'unknown',
        browser_version: 'unknown'
      };

      if (userAgent) {
        // Extract browser info
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
    };

    // Analyze attack pattern
    const analyzeAttackPattern = (attemptedRoute: string, userAgent: string) => {
      if (attemptedRoute.includes('/admin')) {
        return 'admin_panel_reconnaissance';
      }
      if (userAgent.includes('curl') || userAgent.includes('bot')) {
        return 'automated_vulnerability_scan';
      }
      if (attemptedRoute.includes('/api')) {
        return 'api_endpoint_enumeration';
      }
      if (attemptedRoute.includes('/auth') || attemptedRoute.includes('/login')) {
        return 'authentication_bypass_attempt';
      }
      if (attemptedRoute.includes('..') || attemptedRoute.includes('%2e%2e')) {
        return 'directory_traversal_attempt';
      }
      return 'general_unauthorized_access';
    };

    if (req.method === 'POST') {
      const incidentData: SecurityIncidentData = await req.json();
      const clientIP = getClientIP(req);
      const userAgent = req.headers.get('user-agent') || incidentData.user_agent || 'unknown';
      
      // Collect request headers
      const requestHeaders: Record<string, any> = {};
      req.headers.forEach((value, key) => {
        requestHeaders[key] = value;
      });

      console.log(`🚨 Security incident detected: ${incidentData.attempted_route} from ${clientIP}`);

      // Perform comprehensive analysis
      const geoData = await getGeolocation(clientIP);
      const threatIntel = await analyzeThreatIntelligence(clientIP, userAgent, geoData);
      const deviceFingerprint = generateDeviceFingerprint(userAgent, requestHeaders);
      const attackPattern = analyzeAttackPattern(incidentData.attempted_route, userAgent);

      // Calculate final risk score
      let riskScore = threatIntel.risk_score;
      if (incidentData.attempted_route.includes('/admin')) {
        riskScore += 25;
      }
      riskScore = Math.min(riskScore, 100);

      // Prepare incident record
      const incidentRecord = {
        attempted_route: incidentData.attempted_route,
        ip_address: clientIP,
        user_agent: userAgent,
        referer: incidentData.referer || req.headers.get('referer'),
        session_id: incidentData.session_id,
        user_id: incidentData.user_id,
        blocked: incidentData.blocked,
        severity: incidentData.severity,
        incident_type: incidentData.incident_type,
        
        // Geographic data
        ...geoData,
        
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
        headers: requestHeaders,
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
      const { data, error } = await supabaseClient
        .from('security_incidents')
        .insert(incidentRecord)
        .select('id')
        .single();

      if (error) {
        console.error('Failed to log security incident:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to log incident', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log critical incidents
      if (riskScore >= 70) {
        console.warn(`🚨 CRITICAL SECURITY INCIDENT: ${attackPattern} from ${clientIP} (${geoData?.country || 'Unknown'}) targeting ${incidentData.attempted_route}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          incident_id: data.id,
          risk_score: riskScore,
          threat_level: threatIntel.threat_level 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET endpoint for fetching recent incidents
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const timeFilter = url.searchParams.get('time_filter') || '24h';
      
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

      const { data, error } = await supabaseClient
        .from('security_incidents')
        .select('*')
        .gte('timestamp', timeThreshold.toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch incidents', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ incidents: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security incident logger error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});