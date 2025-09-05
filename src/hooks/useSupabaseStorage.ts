import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSupabaseStorageReturn {
  uploadFile: (file: File, path: string, bucket?: string) => Promise<string | null>;
  deleteFile: (path: string, bucket?: string) => Promise<boolean>;
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

  const getPublicUrl = useCallback((
    path: string, 
    bucket: string = 'neuralpositivemusic'  // Fixed: was 'audio'
  ): string => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }, []);

  return {
    uploadFile,
    deleteFile,
    getPublicUrl,
    uploading,
    error
  };
}