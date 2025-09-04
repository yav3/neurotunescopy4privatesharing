import { supabase } from "@/integrations/supabase/client";

export async function compileAudioData(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🎵 Starting audio data compilation...');
    
    const { data, error } = await supabase.functions.invoke('compile-audio-data', {
      body: { action: 'compile' }
    });
    
    if (error) {
      console.error('Compilation error:', error);
      return {
        success: false,
        message: `Failed to start compilation: ${error.message}`
      };
    }
    
    console.log('✅ Audio compilation started:', data);
    return {
      success: true,
      message: 'Audio data compilation started successfully. This will process all 367 audio tracks in the background.'
    };
    
  } catch (error) {
    console.error('Function invocation error:', error);
    return {
      success: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function getAudioBucketStats() {
  try {
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('id, bpm, camelot, comprehensive_analysis, audio_status')
      .eq('storage_bucket', 'audio');
    
    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
    
    const total = tracks?.length || 0;
    const hasBPM = tracks?.filter(t => t.bpm).length || 0;
    const hasCamelot = tracks?.filter(t => t.camelot).length || 0;
    const hasAnalysis = tracks?.filter(t => t.comprehensive_analysis).length || 0;
    const working = tracks?.filter(t => t.audio_status === 'working').length || 0;
    
    return {
      total,
      hasBPM,
      hasCamelot,
      hasAnalysis,
      working,
      bpmCoverage: total > 0 ? Math.round((hasBPM / total) * 100) : 0,
      camelotCoverage: total > 0 ? Math.round((hasCamelot / total) * 100) : 0,
      analysisCoverage: total > 0 ? Math.round((hasAnalysis / total) * 100) : 0
    };
  } catch (error) {
    console.error('Stats error:', error);
    return null;
  }
}