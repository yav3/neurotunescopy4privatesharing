import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStorageUrl, getPublicStorageUrl, isPublicBucket } from '@/lib/storageUrl';

interface UseSupabaseStorageReturn {
  uploadFile: (file: File, path: string, bucket?: string) => Promise<string | null>;
  deleteFile: (path: string, bucket?: string) => Promise<boolean>;
  /**
   * Resolve an object URL. For private buckets this returns a 1-hour signed
   * URL via the storage-access edge function. For public buckets it returns
   * the direct CDN URL synchronously-fast.
   */
  getUrl: (path: string, bucket?: string) => Promise<string>;
  /**
   * Synchronous public URL. Logs a warning and may return a broken URL if the
   * bucket is private. Prefer `getUrl()`.
   */
  getPublicUrl: (path: string, bucket?: string) => string;
  uploading: boolean;
  error: string | null;
}

export function useSupabaseStorage(): UseSupabaseStorageReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    path: string,
    bucket: string = 'audio'
  ): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploading(false);
      return data?.path || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploading(false);
      return null;
    }
  }, []);

  const deleteFile = useCallback(async (
    path: string,
    bucket: string = 'audio'
  ): Promise<boolean> => {
    setError(null);

    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return false;
    }
  }, []);

  const getUrl = useCallback(
    (path: string, bucket: string = 'audio') => getStorageUrl(bucket, path),
    []
  );

  const getPublicUrl = useCallback(
    (path: string, bucket: string = 'audio') => getPublicStorageUrl(bucket, path),
    []
  );

  return {
    uploadFile,
    deleteFile,
    getUrl,
    getPublicUrl,
    uploading,
    error
  };
}
