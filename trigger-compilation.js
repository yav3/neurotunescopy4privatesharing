// Direct compilation trigger
const SUPABASE_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE';

async function triggerCompilation() {
  console.log('🚀 Starting audio data compilation...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/compile-audio-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ action: 'compile' })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Compilation started successfully:', result);
      return result;
    } else {
      console.error('❌ Compilation failed:', result);
      return result;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { error: error.message };
  }
}

// Execute compilation
triggerCompilation().then(result => {
  console.log('Final result:', result);
});