import { supabase } from '@/integrations/supabase/client';
import { securityMonitoring } from './securityMonitoring';
import { logger } from './logger';

interface RequestMetadata {
  endpoint: string;
  method: string;
  userAgent: string;
  ip?: string;
  headers: Record<string, string>;
  timestamp: number;
}

interface RateLimitData {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class SecureApiService {
  private static instance: SecureApiService;
  private rateLimitMap = new Map<string, RateLimitData>();
  private blockedIPs = new Set<string>();
  private requestHistory = new Map<string, number[]>();
  
  // Rate limiting configuration
  private readonly RATE_LIMITS = {
    global: { requests: 100, windowMs: 60000 }, // 100 requests per minute
    auth: { requests: 5, windowMs: 60000 },     // 5 auth attempts per minute
    admin: { requests: 20, windowMs: 60000 },   // 20 admin requests per minute
    api: { requests: 50, windowMs: 60000 }      // 50 API calls per minute
  };

  static getInstance(): SecureApiService {
    if (!SecureApiService.instance) {
      SecureApiService.instance = new SecureApiService();
    }
    return SecureApiService.instance;
  }

  /**
   * Get client IP address (best effort)
   */
  private getClientIP(): string {
    // In browser environment, we can't get real IP, use fingerprint
    return `browser_${navigator.userAgent.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  /**
   * Generate request fingerprint for rate limiting
   */
  private generateFingerprint(metadata: RequestMetadata): string {
    const ip = metadata.ip || this.getClientIP();
    return `${ip}_${metadata.endpoint}`;
  }

  /**
   * Check and update rate limits
   */
  private checkRateLimit(fingerprint: string, limitType: keyof typeof this.RATE_LIMITS): boolean {
    const now = Date.now();
    const limit = this.RATE_LIMITS[limitType];
    
    const existing = this.rateLimitMap.get(fingerprint);
    
    if (!existing || now > existing.resetTime) {
      // Reset or initialize
      this.rateLimitMap.set(fingerprint, {
        count: 1,
        resetTime: now + limit.windowMs,
        blocked: false
      });
      return true;
    }
    
    if (existing.count >= limit.requests) {
      existing.blocked = true;
      this.rateLimitMap.set(fingerprint, existing);
      return false;
    }
    
    existing.count++;
    this.rateLimitMap.set(fingerprint, existing);
    return true;
  }

  /**
   * Analyze request for suspicious patterns
   */
  private analyzeRequestSecurity(metadata: RequestMetadata): {
    threat_level: 'low' | 'medium' | 'high' | 'critical';
    blocked: boolean;
    reason?: string;
  } {
    const { endpoint, method, userAgent, headers } = metadata;
    
    // Check for automated tools
    const suspiciousAgents = ['curl', 'postman', 'insomnia', 'wget', 'python', 'bot', 'crawler', 'scanner'];
    const isAutomated = suspiciousAgents.some(agent => 
      userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Check for admin endpoint access
    const isAdminAccess = endpoint.includes('/admin');
    
    // Check for API enumeration patterns
    const isApiEnumeration = endpoint.includes('/api') && method === 'GET';
    
    // Check for suspicious headers
    const hasSuspiciousHeaders = Object.keys(headers).some(header => 
      ['x-forwarded-for', 'x-real-ip', 'proxy'].some(sus => 
        header.toLowerCase().includes(sus)
      )
    );

    let threat_level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let blocked = false;
    let reason = '';

    if (isAutomated && isAdminAccess) {
      threat_level = 'critical';
      blocked = true;
      reason = 'Automated tool accessing admin endpoints';
    } else if (isAutomated) {
      threat_level = 'high';
      blocked = true;
      reason = 'Automated tool detected';
    } else if (isAdminAccess) {
      threat_level = 'medium';
      reason = 'Admin endpoint access';
    } else if (isApiEnumeration) {
      threat_level = 'medium';
      reason = 'API enumeration detected';
    }

    return { threat_level, blocked, reason };
  }

  /**
   * Validate request before allowing it through
   */
  private async validateRequest(metadata: RequestMetadata): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    const fingerprint = this.generateFingerprint(metadata);
    const ip = metadata.ip || this.getClientIP();
    
    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      return { allowed: false, reason: 'IP blocked due to previous violations' };
    }
    
    // Determine rate limit type based on endpoint
    let limitType: keyof typeof this.RATE_LIMITS = 'global';
    if (metadata.endpoint.includes('/auth')) limitType = 'auth';
    else if (metadata.endpoint.includes('/admin')) limitType = 'admin';
    else if (metadata.endpoint.includes('/api')) limitType = 'api';
    
    // Check rate limits
    if (!this.checkRateLimit(fingerprint, limitType)) {
      // Log security incident for rate limit violation
      await securityMonitoring.logSecurityIncident({
        attempted_route: metadata.endpoint,
        ip_address: ip,
        user_agent: metadata.userAgent,
        blocked: true,
        severity: 'medium',
        incident_type: 'rate_limit_exceeded',
        headers: metadata.headers,
        response_code: 429
      });
      
      return { allowed: false, reason: 'Rate limit exceeded' };
    }
    
    // Analyze for security threats
    const securityAnalysis = this.analyzeRequestSecurity(metadata);
    
    if (securityAnalysis.blocked) {
      // Block IP temporarily for critical threats
      if (securityAnalysis.threat_level === 'critical') {
        this.blockedIPs.add(ip);
        // Unblock after 1 hour
        setTimeout(() => this.blockedIPs.delete(ip), 3600000);
      }
      
      // Log security incident
      await securityMonitoring.logSecurityIncident({
        attempted_route: metadata.endpoint,
        ip_address: ip,
        user_agent: metadata.userAgent,
        blocked: true,
        severity: securityAnalysis.threat_level,
        incident_type: 'suspicious_request_pattern',
        headers: metadata.headers,
        response_code: 403
      });
      
      return { allowed: false, reason: securityAnalysis.reason };
    }
    
    return { allowed: true };
  }

  /**
   * Secure wrapper for Supabase operations
   */
  async secureRequest<T>(
    operation: () => Promise<T>,
    endpoint: string,
    method: string = 'GET'
  ): Promise<T> {
    const metadata: RequestMetadata = {
      endpoint,
      method,
      userAgent: navigator.userAgent,
      headers: {
        'user-agent': navigator.userAgent,
        'accept': 'application/json',
        'origin': window.location.origin
      },
      timestamp: Date.now()
    };
    
    // Validate request
    const validation = await this.validateRequest(metadata);
    
    if (!validation.allowed) {
      logger.warn(`🚫 Request blocked: ${validation.reason} for ${endpoint}`);
      throw new Error(`Access denied: ${validation.reason}`);
    }
    
    try {
      // Execute the operation
      const result = await operation();
      
      // Log successful request for monitoring
      logger.info(`✅ Secure request completed: ${method} ${endpoint}`);
      
      return result;
    } catch (error) {
      // Log failed request
      logger.error(`❌ Secure request failed: ${method} ${endpoint}`, error);
      
      // Log as security incident if it looks suspicious
      const ip = this.getClientIP();
      await securityMonitoring.logSecurityIncident({
        attempted_route: endpoint,
        ip_address: ip,
        user_agent: metadata.userAgent,
        blocked: false,
        severity: 'low',
        incident_type: 'api_request_failure',
        headers: metadata.headers,
        response_code: 500
      });
      
      throw error;
    }
  }

  /**
   * Secure Supabase query wrapper
   */
  async secureQuery(tableName: string, operation: 'select' | 'insert' | 'update' | 'delete' = 'select') {
    return this.secureRequest(
      () => supabase.from(tableName),
      `/rest/v1/${tableName}`,
      operation.toUpperCase()
    );
  }

  /**
   * Get security statistics
   */
  getSecurityStats() {
    const now = Date.now();
    const activeRateLimits = Array.from(this.rateLimitMap.entries())
      .filter(([_, data]) => now <= data.resetTime);
    
    return {
      blockedIPs: this.blockedIPs.size,
      activeRateLimits: activeRateLimits.length,
      rateLimitViolations: activeRateLimits.filter(([_, data]) => data.blocked).length,
      totalRequests: Array.from(this.rateLimitMap.values())
        .reduce((sum, data) => sum + data.count, 0)
    };
  }

  /**
   * Clear security data (admin only)
   */
  clearSecurityData() {
    this.rateLimitMap.clear();
    this.blockedIPs.clear();
    this.requestHistory.clear();
    logger.info('🧹 Security data cleared');
  }
}

export const secureApi = SecureApiService.getInstance();