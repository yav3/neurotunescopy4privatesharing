
CREATE TABLE IF NOT EXISTS public.chat_rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  function_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_lookup
  ON public.chat_rate_limits (ip_address, function_name, created_at DESC);

GRANT ALL ON public.chat_rate_limits TO service_role;
ALTER TABLE public.chat_rate_limits ENABLE ROW LEVEL SECURITY;
-- No public policies: only service_role (used by edge functions) accesses this table.

-- Periodic cleanup helper (callable by service_role if/when needed)
CREATE OR REPLACE FUNCTION public.prune_chat_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.chat_rate_limits WHERE created_at < now() - INTERVAL '2 days';
$$;
REVOKE ALL ON FUNCTION public.prune_chat_rate_limits() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_chat_rate_limits() TO service_role;
