import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

interface RateLimitData {
  count: number;
  resetTime: number;
  blocked: boolean;
}

interface SecurityCheck {
  allowed: boolean;
  reason?: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
}

class SecureApiGateway {
  private rateLimitMap = new Map<string, RateLimitData>();
  private blockedIPs = new Set<string>();
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
  }

  private getRealIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfIP = request.headers.get('cf-connecting-ip');
    
    return cfIP || realIP || forwarded?.split(',')[0] || 'unknown';
  }

  private checkRateLimit(ip: string, endpoint: string): boolean {
    const key = `${ip}_${endpoint}`;
    const now = Date.now();
    const limit = this.getRateLimit(endpoint);
    
    const existing = this.rateLimitMap.get(key);
    
    if (!existing || now > existing.resetTime) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + limit.windowMs,
        blocked: false
      });
      return true;
    }
    
    if (existing.count >= limit.requests) {
      existing.blocked = true;
      return false;
    }
    
    existing.count++;
    return true;
  }

  private getRateLimit(endpoint: string) {
    if (endpoint.includes('admin')) {
      return { requests: 10, windowMs: 60000 }; // 10 requests per minute for admin
    }
    if (endpoint.includes('auth')) {
      return { requests: 5, windowMs: 60000 };  // 5 auth requests per minute
    }
    return { requests: 50, windowMs: 60000 }; // 50 requests per minute default
  }

  private async performSecurityCheck(request: Request, ip: string): Promise<SecurityCheck> {
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);
    const endpoint = url.pathname;
    
    // Check blocked IPs
    if (this.blockedIPs.has(ip)) {
      return {
        allowed: false,
        reason: 'IP blocked due to security violations',
        threat_level: 'critical'
      };
    }

    // Check rate limits
    if (!this.checkRateLimit(ip, endpoint)) {
      // Log rate limit violation
      await this.logSecurityIncident({
        ip_address: ip,
        attempted_route: endpoint,
        user_agent: userAgent,
        blocked: true,
        severity: 'medium',
        incident_type: 'rate_limit_exceeded',
        headers: Object.fromEntries(request.headers.entries()),
        response_code: 429
      });

      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        threat_level: 'medium'
      };
    }

    // Analyze for suspicious patterns
    const suspiciousAgents = ['curl', 'postman', 'insomnia', 'wget', 'python', 'bot', 'crawler', 'scanner'];
    const isAutomated = suspiciousAgents.some(agent => 
      userAgent.toLowerCase().includes(agent.toLowerCase())
    );

    const isAdminAccess = endpoint.includes('/admin');
    const isApiProbing = request.method === 'GET' && endpoint.includes('/api');

    if (isAutomated && isAdminAccess) {
      // Block IP for critical threats
      this.blockedIPs.add(ip);
      setTimeout(() => this.blockedIPs.delete(ip), 3600000); // Unblock after 1 hour

      await this.logSecurityIncident({
        ip_address: ip,
        attempted_route: endpoint,
        user_agent: userAgent,
        blocked: true,
        severity: 'critical',
        incident_type: 'automated_admin_access',
        headers: Object.fromEntries(request.headers.entries()),
        response_code: 403
      });

      return {
        allowed: false,
        reason: 'Automated tool accessing admin endpoints',
        threat_level: 'critical'
      };
    }

    if (isAutomated) {
      await this.logSecurityIncident({
        ip_address: ip,
        attempted_route: endpoint,
        user_agent: userAgent,
        blocked: true,
        severity: 'high',
        incident_type: 'automated_access_detected',
        headers: Object.fromEntries(request.headers.entries()),
        response_code: 403
      });

      return {
        allowed: false,
        reason: 'Automated tool detected',
        threat_level: 'high'
      };
    }

    // Log but allow suspicious activity
    if (isApiProbing) {
      await this.logSecurityIncident({
        ip_address: ip,
        attempted_route: endpoint,
        user_agent: userAgent,
        blocked: false,
        severity: 'medium',
        incident_type: 'api_enumeration',
        headers: Object.fromEntries(request.headers.entries()),
        response_code: 200
      });
    }

    return {
      allowed: true,
      threat_level: 'low'
    };
  }

  private async logSecurityIncident(incident: any) {
    try {
      const { error } = await this.supabase
        .from('security_incidents')
        .insert({
          ...incident,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log security incident:', error);
      }
    } catch (error) {
      console.error('Error logging security incident:', error);
    }
  }

  async handleRequest(request: Request): Promise<Response> {
    const ip = this.getRealIP(request);
    const url = new URL(request.url);
    
    // Perform security check
    const securityCheck = await this.performSecurityCheck(request, ip);
    
    if (!securityCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Access denied', 
          reason: securityCheck.reason,
          threat_level: securityCheck.threat_level
        }),
        { 
          status: 403,
          headers: { 
            'Content-Type': 'application/json',
            'X-Security-Block': 'true',
            'X-Threat-Level': securityCheck.threat_level
          }
        }
      );
    }

    // If request is allowed, you can proxy it to your actual API
    // For now, return security status
    return new Response(
      JSON.stringify({ 
        status: 'allowed',
        ip: ip,
        endpoint: url.pathname,
        timestamp: new Date().toISOString(),
        security_stats: {
          blocked_ips: this.blockedIPs.size,
          active_rate_limits: this.rateLimitMap.size
        }
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Security-Check': 'passed'
        }
      }
    );
  }
}

const gateway = new SecureApiGateway();

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
      },
    });
  }

  try {
    return await gateway.handleRequest(req);
  } catch (error) {
    console.error('Gateway error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});