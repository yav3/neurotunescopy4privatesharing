/**
 * Utility to fix API configuration issues
 * Run this in dev console to update environment and test API calls
 */

export const fixApiConfig = () => {
  const currentBase = (import.meta as any).env?.VITE_API_BASE_URL;
  console.log('📍 Current API Base:', currentBase);
  
  const correctBase = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1';
  
  if (currentBase !== correctBase) {
    console.warn('🚨 API Base URL needs to be updated!');
    console.log('❌ Current:', currentBase);
    console.log('✅ Should be:', correctBase);
    console.log('🔧 Update your .env file to:');
    console.log('   VITE_API_BASE_URL=' + correctBase);
    console.log('🔄 Then restart your dev server');
    return false;
  }
  
  console.log('✅ API Base URL is correctly configured');
  return true;
};

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  (window as any).fixApiConfig = fixApiConfig;
}