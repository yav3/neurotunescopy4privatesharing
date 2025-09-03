export interface Track {
  id: string;
  title: string;
  file_path?: string;
  storage_key?: string;
  storage_bucket?: string;
  duration?: number;
  goal?: string;
  // Add other expected properties
}

export class TypeChecker {
  static validateTrack(obj: any): obj is Track {
    if (!obj || typeof obj !== 'object') {
      console.error('Track validation failed: not an object', obj);
      return false;
    }
    
    if (!obj.id || typeof obj.id !== 'string') {
      console.error('Track validation failed: invalid id', obj);
      return false;
    }
    
    if (!obj.title || typeof obj.title !== 'string') {
      console.error('Track validation failed: invalid title', obj);
      return false;
    }
    
    // Check UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(obj.id)) {
      console.warn('Track has non-UUID id format:', obj.id);
    }
    
    return true;
  }
  
  static validateTracks(tracks: any[]): Track[] {
    if (!Array.isArray(tracks)) {
      console.error('Expected array of tracks, got:', typeof tracks);
      return [];
    }
    
    return tracks.filter(track => this.validateTrack(track));
  }
  
  static logTypeErrors(obj: any, expectedType: string, context: string) {
    console.group(`Type Error in ${context}`);
    console.error(`Expected: ${expectedType}`);
    console.error('Received:', typeof obj);
    console.error('Value:', obj);
    console.trace();
    console.groupEnd();
  }
}