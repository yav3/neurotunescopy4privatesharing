import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { securityMonitoring } from '@/services/securityMonitoring';
import { secureApi } from '@/services/secureApi';
import { logger } from '@/services/logger';

interface AdvancedAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  adminOnly?: boolean;
  redirectTo?: string;
}

/**
 * Advanced authentication guard with comprehensive security monitoring
 */
export const AdvancedAuthGuard: React.FC<AdvancedAuthGuardProps> = ({
  children,
  requiredRole = 'user',
  adminOnly = false,
  redirectTo = '/auth'
}) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const [securityCheck, setSecurityCheck] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    const performSecurityCheck = async () => {
      if (loading) return;

      const currentPath = location.pathname;
      const userAgent = navigator.userAgent;
      const timestamp = Date.now();

      // Check for suspicious access patterns
      const isSuspiciousAccess = 
        currentPath.includes('/admin') && 
        (userAgent.includes('curl') || userAgent.includes('Postman') || userAgent.includes('bot'));

      if (isSuspiciousAccess) {
        // Log security incident
        await securityMonitoring.logSecurityIncident({
          attempted_route: currentPath,
          user_agent: userAgent,
          blocked: true,
          severity: 'high',
          incident_type: 'suspicious_admin_access',
          user_id: user?.id,
          headers: {
            'user-agent': userAgent,
            'origin': window.location.origin,
            'referer': document.referrer
          },
          response_code: 403
        });

        logger.warn('🚨 Suspicious admin access attempt blocked', {
          path: currentPath,
          userAgent,
          userId: user?.id
        });

        setSecurityCheck('denied');
        return;
      }

      // Check if user is authenticated
      if (!user) {
        // Log unauthorized access attempt
        await securityMonitoring.logSecurityIncident({
          attempted_route: currentPath,
          user_agent: userAgent,
          blocked: true,
          severity: adminOnly ? 'high' : 'medium',
          incident_type: 'unauthorized_access_attempt',
          headers: {
            'user-agent': userAgent,
            'origin': window.location.origin,
            'referer': document.referrer
          },
          response_code: 401
        });

        setSecurityCheck('denied');
        return;
      }

      // Additional admin checks
      if (adminOnly || requiredRole === 'admin') {
        // Verify admin status (you might want to add admin role checking here)
        const isAdmin = user.email?.includes('@neuralpositive.com') || 
                       user.user_metadata?.role === 'admin';

        if (!isAdmin) {
          // Log admin access attempt by non-admin
          await securityMonitoring.logSecurityIncident({
            attempted_route: currentPath,
            user_agent: userAgent,
            user_id: user.id,
            blocked: true,
            severity: 'high',
            incident_type: 'unauthorized_admin_access',
            headers: {
              'user-agent': userAgent,
              'origin': window.location.origin,
              'referer': document.referrer
            },
            response_code: 403
          });

          logger.warn('🚨 Non-admin user attempted admin access', {
            userId: user.id,
            email: user.email,
            path: currentPath
          });

          setSecurityCheck('denied');
          return;
        }
      }

      // All checks passed
      setSecurityCheck('allowed');
    };

    performSecurityCheck();
  }, [user, loading, location.pathname, adminOnly, requiredRole]);

  // Show loading state
  if (loading || securityCheck === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Security check failed
  if (securityCheck === 'denied') {
    return <Navigate to={redirectTo} state={{ from: location, reason: 'access_denied' }} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};