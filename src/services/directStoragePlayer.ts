import { supabase } from '@/integrations/supabase/client';

export interface DirectTrack {
  id: string;
  title: string;
  url: string;
  bucket: string;
  filename: string;
}

export class DirectStoragePlayer {
  private static audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

  static async getTracksFromBucket(bucketName: string): Promise<DirectTrack[]> {
    console.log(`🎵 Direct: Loading tracks from bucket: ${bucketName}`);
    
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1000 });

      if (error) {
        console.error(`❌ Direct: Error listing files in bucket ${bucketName}:`, error);
        return [];
      }

      if (!files || files.length === 0) {
        console.log(`📂 Direct: No files found in bucket ${bucketName}`);
        return [];
      }

      // Filter for audio files
      const audioFiles = files.filter(file => 
        this.audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );

      console.log(`🎵 Direct: Found ${audioFiles.length} audio files in ${bucketName}`);

      // Convert to DirectTrack objects with direct URLs
      const tracks: DirectTrack[] = audioFiles.map(file => {
        const publicUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${file.name}`;
        
        return {
          id: `${bucketName}_${file.name}`,
          title: this.cleanTitle(file.name),
          url: publicUrl,
          bucket: bucketName,
          filename: file.name
        };
      });

      console.log(`✅ Direct: Returning ${tracks.length} tracks from ${bucketName}`);
      return tracks;

    } catch (error) {
      console.error(`❌ Direct: Error processing bucket ${bucketName}:`, error);
      return [];
    }
  }

  static async getTracksFromBuckets(bucketNames: string[]): Promise<DirectTrack[]> {
    console.log(`🎵 Direct: Loading tracks from buckets: ${bucketNames.join(', ')}`);
    
    const allTracks: DirectTrack[] = [];
    
    for (const bucketName of bucketNames) {
      const tracks = await this.getTracksFromBucket(bucketName);
      allTracks.push(...tracks);
    }

    // Shuffle the tracks
    return allTracks.sort(() => Math.random() - 0.5);
  }

  private static cleanTitle(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}