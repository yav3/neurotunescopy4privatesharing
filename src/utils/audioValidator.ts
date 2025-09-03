import { AUDIO_ELEMENT_ID } from '@/player/constants';

interface AudioValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  audioElement?: HTMLAudioElement | null;
}

export class AudioValidator {
  static validateAudioSystem(): AudioValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for multiple audio elements
    const audioElements = document.querySelectorAll('audio');
    if (audioElements.length === 0) {
      errors.push('No audio element found');
    } else if (audioElements.length > 1) {
      errors.push(`Multiple audio elements found: ${audioElements.length}`);
    }
    
    // Check audio element properties
    const audioElement = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
    if (!audioElement) {
      errors.push(`Main audio element (#${AUDIO_ELEMENT_ID}) not found`);
    } else {
      if (!audioElement.crossOrigin) {
        warnings.push('Audio element missing crossOrigin attribute');
      }
      if (audioElement.preload !== 'metadata') {
        warnings.push('Audio element preload not set to metadata');
      }
    }
    
    // Check for competing audio contexts
    const contexts = [
      'useAudio',
      'useNewAudioContext', 
      'AudioContext'
    ];
    
    contexts.forEach(contextName => {
      const scripts = Array.from(document.scripts);
      const hasContext = scripts.some(script => 
        script.textContent?.includes(contextName)
      );
      if (hasContext) {
        warnings.push(`Potential competing audio context detected: ${contextName}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      audioElement: audioElement || audioElements[0] || null
    };
  }
  
  static async validateStreamingEndpoint(testFile: string = 'test.mp3'): Promise<{
    isWorking: boolean;
    status?: number;
    error?: string;
  }> {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const streamUrl = `${apiBase}/stream?file=${encodeURIComponent(testFile)}`;
      
      const response = await fetch(streamUrl, { method: 'HEAD' });
      
      return {
        isWorking: response.ok,
        status: response.status,
        error: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`
      };
    } catch (error) {
      return {
        isWorking: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}