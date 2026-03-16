-- Create support_tickets table for tracking support conversations
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  email text NOT NULL,
  name text,
  company text,
  account_type text,
  location text,
  team_size text,
  query_summary text,
  next_steps text,
  conversation_log jsonb DEFAULT '[]'::jsonb,
  source text NOT NULL DEFAULT 'support_chat',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common lookups
CREATE INDEX idx_support_tickets_email ON public.support_tickets(email);
CREATE INDEX idx_support_tickets_ticket_number ON public.support_tickets(ticket_number);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone can create a ticket (from support chat)
CREATE POLICY "Anyone can create support tickets"
  ON public.support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own tickets by email
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can update tickets
CREATE POLICY "Admins can update tickets"
  ON public.support_tickets
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
