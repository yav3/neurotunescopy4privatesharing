import { supabase } from '@/integrations/supabase/client';

// Album art images to upload
const albumArtImages = [
  { file: 'album-art-ocean-wave.png', name: 'ocean-wave.png' },
  { file: 'album-art-zen-stones.png', name: 'zen-stones.png' },
  { file: 'album-art-mountain-lake.png', name: 'mountain-lake.png' },
  { file: 'album-art-water-drop.png', name: 'water-drop.png' },
  { file: 'album-art-leaf-droplets.png', name: 'leaf-droplets.png' },
  { file: 'album-art-golden-splash.png', name: 'golden-splash.png' },
  { file: 'album-art-sunset-lake.png', name: 'sunset-lake.png' },
  { file: 'album-art-dewdrop.png', name: 'dewdrop.png' }
];

/**
 * Upload album art images from src/assets to the albumart storage bucket
 */
export const uploadAlbumArtToStorage = async (): Promise<void> => {
  console.log('📸 Starting album art upload to storage...');
  
  for (const image of albumArtImages) {
    try {
      // Fetch the image file from assets
      const response = await fetch(`/src/assets/${image.file}`);
      if (!response.ok) {
        console.warn(`❌ Could not fetch ${image.file}:`, response.statusText);
        continue;
      }
      
      const blob = await response.blob();
      const file = new File([blob], image.name, { type: blob.type });
      
      // Upload to albumart bucket
      const { data, error } = await supabase.storage
        .from('albumart')
        .upload(image.name, file, {
          upsert: true,
          cacheControl: '3600'
        });
      
      if (error) {
        console.error(`❌ Failed to upload ${image.name}:`, error.message);
      } else {
        console.log(`✅ Successfully uploaded ${image.name} to albumart bucket`);
      }
      
    } catch (error) {
      console.error(`❌ Error uploading ${image.file}:`, error);
    }
  }
  
  console.log('📸 Album art upload process completed');
};

/**
 * Initialize album art upload - call this once to populate the storage bucket
 */
export const initializeAlbumArt = () => {
  // Only upload if we haven't done so already (check localStorage flag)
  const hasUploaded = localStorage.getItem('albumart-uploaded');
  if (!hasUploaded) {
    uploadAlbumArtToStorage().then(() => {
      localStorage.setItem('albumart-uploaded', 'true');
      console.log('🎨 Album art collection initialized in storage');
    });
  }
};