-- Create comprehensive security incidents table
CREATE TABLE public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attempted_route TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  blocked BOOLEAN NOT NULL DEFAULT true,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  incident_type TEXT NOT NULL DEFAULT 'unauthorized_access',
  
  -- Geographic and network information
  country TEXT,
  country_code CHAR(2),
  region TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  timezone TEXT,
  isp TEXT,
  organization TEXT,
  asn TEXT,
  
  -- Threat intelligence
  threat_level TEXT CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
  vpn_detected BOOLEAN DEFAULT false,
  proxy_detected BOOLEAN DEFAULT false,
  tor_detected BOOLEAN DEFAULT false,
  datacenter_detected BOOLEAN DEFAULT false,
  
  -- Device fingerprinting
  device_fingerprint TEXT,
  browser_language TEXT,
  screen_resolution TEXT,
  connection_type TEXT,
  platform TEXT,
  browser_name TEXT,
  browser_version TEXT,
  
  -- Additional forensic data
  headers JSONB,
  request_body TEXT,
  response_code INTEGER,
  payload_size INTEGER,
  
  -- Analysis results
  risk_score NUMERIC DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  attack_pattern TEXT,
  mitigation_action TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  investigated_at TIMESTAMP WITH TIME ZONE,
  investigated_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for security incidents
CREATE POLICY "Admins can view all security incidents" 
ON public.security_incidents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can manage security incidents" 
ON public.security_incidents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create indexes for performance
CREATE INDEX idx_security_incidents_timestamp ON public.security_incidents(timestamp DESC);
CREATE INDEX idx_security_incidents_ip ON public.security_incidents(ip_address);
CREATE INDEX idx_security_incidents_severity ON public.security_incidents(severity);
CREATE INDEX idx_security_incidents_blocked ON public.security_incidents(blocked);
CREATE INDEX idx_security_incidents_route ON public.security_incidents(attempted_route);
CREATE INDEX idx_security_incidents_risk_score ON public.security_incidents(risk_score DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_security_incidents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_security_incidents_updated_at
  BEFORE UPDATE ON public.security_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_security_incidents_updated_at();

-- Create IP whitelist table for legitimate access
CREATE TABLE public.ip_whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS for IP whitelist
ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage IP whitelist" 
ON public.ip_whitelist 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);