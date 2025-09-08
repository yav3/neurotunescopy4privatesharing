// Service client with elevated permissions for backend operations
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkzMzY4OSwiZXhwIjoyMDY1NTA5Njg5fQ.qy8TjrR4_Eu3dJPgvwFKF6L2SfVDliZ_KEjpJPMWUgQ";

// Service client with full database access
export const serviceSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});