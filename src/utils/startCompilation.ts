import { supabase } from "@/integrations/supabase/client";

// Direct compilation starter - invoke this immediately
export const startAudioCompilation = async () => {
  console.log('🎵 Starting immediate audio data compilation...');
  
  try {
    const { data, error } = await supabase.functions.invoke('compile-audio-data', {
      body: { action: 'compile' }
    });
    
    if (error) {
      console.error('❌ Compilation error:', error);
      return false;
    }
    
    console.log('✅ Audio compilation started:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Function invocation error:', error);
    return false;
  }
};

// Auto-start compilation when this module loads
startAudioCompilation().then(success => {
  if (success) {
    console.log('🎉 Audio data compilation is now running in the background!');
    console.log('📊 Processing all 367 audio bucket tracks with BPM, Camelot keys, and comprehensive analysis...');
  } else {
    console.error('⚠️ Failed to start audio compilation');
  }
});