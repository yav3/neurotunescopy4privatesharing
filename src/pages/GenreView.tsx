import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerticalTrackList } from '@/components/VerticalTrackList';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';

// Import new mood boost artwork
import moodBoostCoastalCove from '@/assets/mood-boost-coastal-cove.png';
import moodBoostSunsetFlowers from '@/assets/mood-boost-sunset-flowers.png';
import moodBoostFloralField from '@/assets/mood-boost-floral-field.png';
import moodBoostLeafDewdrop from '@/assets/mood-boost-leaf-dewdrop.png';
import moodBoostNordicFjord from '@/assets/mood-boost-nordic-fjord.png';

// Import new energy boost artwork
import energyBoostGrandPiano from '@/assets/energy-boost-grand-piano-mountains.png';
import energyBoostViolin from '@/assets/energy-boost-violin-hills.jpg';

// Import thematic artwork that matches genre descriptions
import crossoverClassicalArt from '@/assets/classical-instruments-crystal-hall.jpg';
import newAgeArt from '@/assets/world-instruments-wildflower-hill.jpg';
import electronicArt from '@/assets/drums-aurora-energy.jpg';
import sambaImage from '@/assets/guitar-beach-sunset-samba.jpg';
import acousticArt from '@/assets/country-guitar-sunset-lake.jpg';
import peacefulPianoArt from '@/assets/piano-mountain-sunset.jpg';
import houseMusicArt from '@/assets/house-music-bright.jpg';
import dancePartyArt from '@/assets/dance-party-beach.jpg';
import popMusicArt from '@/assets/pop-music-joyful-nature.jpg';
import operaArt from '@/assets/opera-violin-garden-terrace.jpg';
import worldInstrumentsZen from '@/assets/world-instruments-zen-garden.jpg';
import worldPainReliefOud from '@/assets/world-pain-relief-oud-landscape.jpg';
import bachWaterfallNature from '@/assets/string-instruments-waterfall.jpg';
import energyBoostArtwork from '@/assets/energy-boost-artwork.jpg';
import energySunsetField from '@/assets/energy-sunset-field.jpg';
import energyHorseField from '@/assets/energy-horse-field.jpg';
import energyWaveAbstract from '@/assets/energy-wave-abstract.jpg';
import energyOceanWaves from '@/assets/energy-ocean-waves.jpg';
import energyTropicalBeach from '@/assets/energy-tropical-beach.jpg';
import energyMountainRiver from '@/assets/energy-mountain-river.jpg';
import energyGeometricSpace from '@/assets/energy-geometric-space.jpg';
// Import new cardio-specific artwork
import hiitCardioDynamic from '@/assets/hiit-cardio-dynamic.jpg';
import houseCardioDj from '@/assets/house-cardio-dj.jpg';
import edmCardioCyber from '@/assets/edm-cardio-cyber.jpg';
import energyCardioLightning from '@/assets/energy-cardio-lightning.jpg';
import popCardioConcert from '@/assets/pop-cardio-concert.jpg';
// Import gradient-based artwork
import gradientGlacierBlue from '@/assets/gradient-glacier-blue.jpg';
import gradientOceanCurrent from '@/assets/gradient-ocean-current.jpg';
import gradientMorningMist from '@/assets/gradient-morning-mist.jpg';
import gradientDesertDawn from '@/assets/gradient-desert-dawn.jpg';
import gradientForestAir from '@/assets/gradient-forest-air.jpg';
import cardioSunsetField from '@/assets/cardio-sunset-field.jpg';
import cardioForestLight from '@/assets/cardio-forest-light.jpg';
import cardioGeometricSun from '@/assets/cardio-geometric-sun.jpg';
import cardioTropicalPalms from '@/assets/cardio-tropical-palms.jpg';
import cardioWaveEnergy from '@/assets/cardio-wave-energy.jpg';
import cardioRunningHorse from '@/assets/cardio-running-horse.jpg';
import cardioGoldenPath from '@/assets/cardio-golden-path.jpg';

// Fallback track generator with varied album art
const generateFallbackTracks = (genreName: string, goalName: string, albumArtUrls: string[] = []) => {
  const trackNames = [
    'Peaceful Focus', 'Classical Concentration', 
    'Mozart Modern', 'Therapeutic Symphony', 'Ambient Classical',
    'Focus Flow', 'Mindful Melody', 'Serene Strings',
    'Calm Composition', 'Tranquil Tones', 'Gentle Harmony'
  ];

  // Fallback to default artwork if no album art provided
  const defaultArtwork = [
    crossoverClassicalArt, newAgeArt, electronicArt, 
    acousticArt, peacefulPianoArt
  ];
  const artworkOptions = albumArtUrls.length > 0 ? albumArtUrls : defaultArtwork;

  return trackNames.map((name, index) => ({
    id: `fallback-${genreName.toLowerCase()}-${index}`,
    title: `${name} ${goalName}`,
    storage_bucket: 'fallback',
    storage_key: `fallback/${name.toLowerCase().replace(/\s+/g, '-')}.mp3`,
    genre: genreName,
    bpm: 60 + (index * 5),
    // Provide a guaranteed working local sample so playback always works
    stream_url: '/audio/sample.mp3',
    artwork_url: artworkOptions[Math.floor(Math.random() * artworkOptions.length)],
    audio_status: 'working' as const,
    therapeutic_applications: [{
      frequency_band_primary: ['delta', 'theta', 'alpha', 'beta', 'gamma'][index % 5],
      condition_targets: [goalName.toLowerCase()]
    }]
  }));
};

interface GenreOption {
  id: string;
  name: string;
  description: string;
  buckets: string[];
  folder?: string;
  artwork: string;
}

interface Track {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  storage_bucket?: string;
  storage_key?: string;
  artwork_url?: string;
  stream_url?: string;
  audio_status?: 'working' | 'missing' | 'unknown';
}

const GenreView: React.FC = () => {
  const { goalId, genreId } = useParams<{ goalId: string; genreId: string }>();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, isPlaying, playFromGoal, play, pause, isLoading: audioLoading } = useAudioStore();

  // Concurrency guards to avoid duplicate loads
  const loadLock = useRef(false);
  const lastLoadKey = useRef<string | null>(null);

  // Get the therapeutic goal
  const goal = goalId ? GOALS_BY_ID[goalId] : null;
  console.log(`🎯 Goal lookup - goalId: ${goalId}, found goal:`, goal?.name || 'NOT FOUND');
  
  // Genre options mapping - aligned with therapeuticGoals.ts buckets
  const getGenreOptions = (goalId: string): GenreOption[] => {
    console.log(`🎨 Getting genre options for goalId: ${goalId}`);
    if (goalId === 'focus-enhancement') {
      return [
        {
          id: 'crossover-classical',
          name: 'Crossover Classical',
          description: 'Modern classical compositions for concentration',
          buckets: ['classicalfocus'],
          artwork: crossoverClassicalArt
        },
        {
          id: 'new-age',
          name: 'New Age & World Focus',
          description: 'Ethereal soundscapes for enhanced focus',
          buckets: ['NewAgeandWorldFocus'],
          artwork: newAgeArt
        },
        {
          id: 'bach-transpositions',
          name: 'Focus Music',
          description: 'Specialized focus compositions for deep concentration',
          buckets: ['focus-music'],
          artwork: bachWaterfallNature
        },
        {
          id: 'peaceful-piano',
          name: 'Chopin',
          description: 'Classical Chopin pieces for deep concentration',
          buckets: ['Chopin'],
          artwork: peacefulPianoArt
        },
        {
          id: 'opera-focus',
          name: 'Opera',
          description: 'Classical opera for focused listening',
          buckets: ['opera'],
          artwork: operaArt
        }
      ];
    } else if (goalId === 'stress-anxiety-support') {
      return [
        {
          id: 'new-age-stress',
          name: 'New Age & World Stress Relief',
          description: 'Ethereal new age sounds for deep relaxation',
          buckets: ['newageworldstressanxietyreduction'],
          artwork: newAgeArt
        },
        {
          id: 'sonatas',
          name: 'Sonatas for Stress',
          description: 'Classical sonatas for deep stress relief',
          buckets: ['sonatasforstress'],
          artwork: '/lovable-uploads/string-quartet-studio.png'
        },
        {
          id: 'peaceful-piano',
          name: 'Chopin',
          description: 'Gentle Chopin pieces for relaxation',
          buckets: ['Chopin'],
          artwork: peacefulPianoArt
        },
        {
          id: 'opera',
          name: 'Opera',
          description: 'Classical opera for emotional release and stress relief',
          buckets: ['opera'],
          artwork: operaArt
        }
      ];
    } else if (goalId === 'pain-support') {
      return [
        {
          id: 'gentle-classical-pain',
          name: 'Gentle Classical for Pain',
          description: 'Soft classical music specifically for pain relief',
          buckets: ['gentleclassicalforpain'],
          artwork: '/lovable-uploads/gentle-classical-piano.png'
        },
        {
          id: 'world-pain-relief',
          name: 'World Pain Relief',
          description: 'Global healing sounds for pain relief',
          buckets: ['painreducingworld'],
          artwork: worldPainReliefOud
        },
        {
          id: 'stress-reduction-classical',
          name: 'Stress Reduction Classical',
          description: 'Classical music for stress and pain management',
          buckets: ['neuralpositivemusic/stressreductionclassical'],
          artwork: '/src/assets/calming-classical-lakeside.jpg'
        },
        {
          id: 'new-age-chill',
          name: 'New Age Chill',
          description: 'Gentle new age sounds for comfort and healing',
          buckets: ['neuralpositivemusic/newagechill'],
          artwork: newAgeArt
        },
        {
          id: 'peaceful-piano',
          name: 'Chopin',
          description: 'Gentle Chopin pieces for comfort and healing',
          buckets: ['Chopin'],
          artwork: peacefulPianoArt
        }
      ];
    } else if (goalId === 'mood-boost') {
      return [
        {
          id: 'house-music',
          name: 'House Music',
          description: 'Energetic house beats for motivation and energy',
          buckets: ['neuralpositivemusic/House'],
          artwork: moodBoostCoastalCove
        },
        {
          id: 'pop',
          name: 'Pop',
          description: 'Uplifting pop music for instant mood elevation',
          buckets: ['pop'],
          folder: 'tracks',
          artwork: moodBoostSunsetFlowers
        },
        {
          id: 'dance-party',
          name: 'Dance Party Remixes',
          description: 'High-energy dance remixes and world beats',
          buckets: ['moodboostremixesworlddance'],
          artwork: moodBoostFloralField
        },
        {
          id: 'edm-crossover',
          name: 'EDM',
          description: 'Electronic dance music crossover tracks for high energy',
          buckets: ['neuralpositivemusic/EDM'],
          artwork: moodBoostLeafDewdrop
        }
      ];
    } else if (goalId === 'energy-boost') {
      return [
        {
          id: 'energetic-classical',
          name: 'Classical Energy Boost',
          description: 'Dynamic classical pieces for vitality',
          buckets: ['neuralpositivemusic/Classical-Energy-Boost'],
          artwork: energySunsetField
        },
        {
          id: 'musical-theater-energy',
          name: 'Musical Theater Energy',
          description: 'Uplifting musical theater pieces for motivation',
          buckets: ['neuralpositivemusic/MusicalTheaterEnergyBoost'],
          artwork: energyBoostViolin
        },
        {
          id: 'motivational-beats',
          name: 'House Music Energy',
          description: 'Upbeat house music for energy and motivation',
          buckets: ['neuralpositivemusic/House'],
          artwork: energyBoostGrandPiano
        },
        {
          id: 'hiit-energy',
          name: 'HIIT Music',
          description: 'High-intensity interval training music for energy',
          buckets: ['HIIT'],
          artwork: energyOceanWaves
        }
      ];
    } else if (goalId === 'cardio-support') {
      return [
        {
          id: 'hiit-cardio',
          name: 'HIIT',
          description: 'High-intensity interval training music',
          buckets: ['HIIT'],
          artwork: hiitCardioDynamic
        },
        {
          id: 'house-cardio',
          name: 'House Music',
          description: 'Pumping house music for cardiovascular exercise',
          buckets: ['house'],
          artwork: houseCardioDj
        },
        {
          id: 'edm-cardio',
          name: 'EDM',
          description: 'Electronic dance music for high-intensity cardio',
          buckets: ['neuralpositivemusic/EDM'],
          artwork: edmCardioCyber
        },
        {
          id: 'pop-cardio',
          name: 'Pop Cardio',
          description: 'Energetic pop hits perfect for cardio sessions',
          buckets: ['pop'],
          artwork: popCardioConcert
        }
      ];
    }

    // Default fallback
    return [];
  };

  // Get the selected genre
  const genreOptions = useMemo(() => (goal ? getGenreOptions(goal.id) : []), [goal?.id]);
  console.log(`🎵 Genre options for ${goal?.name}:`, genreOptions.map(g => g.name));
  
  const selectedGenre = useMemo(() => genreOptions.find(g => g.id === genreId), [genreOptions, genreId]);
  console.log(`🎯 Selected genre: ${selectedGenre?.name || 'NOT FOUND'} (genreId: ${genreId})`);
  // Load tracks directly from bucket - simplified
  useEffect(() => {
    if (!goal || !selectedGenre) return;

    const loadKey = `${goal.id}:${selectedGenre.id}`;
    if (loadLock.current && lastLoadKey.current === loadKey) {
      console.log('⏭️ Skipping duplicate load for', loadKey);
      return;
    }
    lastLoadKey.current = loadKey;
    loadLock.current = true;
    let cancelled = false;

    const loadTracks = async () => {
      if (cancelled) return;
      setIsLoading(true);
      console.log(`🎵 Loading ${selectedGenre.name} tracks directly from buckets:`, selectedGenre.buckets);
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        let allTracks: any[] = [];

        console.log(`🎵 Loading ${selectedGenre.name} tracks from buckets:`, selectedGenre.buckets);
        console.log(`🎯 Goal: ${goal.name}, Genre: ${selectedGenre.id}`);
        console.log(`📋 Available music buckets from config:`, goal.musicBuckets);

        // Determine album art sources
        let albumArtUrls: string[] = [];
        if (selectedGenre.id === 'house-music') {
          // Strict mode: use house bucket for audio; use provided artwork only
          albumArtUrls = [selectedGenre.artwork];
          console.log('🎨 Using provided House Music artwork only');
        } else {
          console.log('🎨 Fetching album art from albumart bucket...');
          const { data: artFiles, error: artError } = await supabase.storage
            .from('albumart')
            .list('', {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });
          if (!artError && artFiles?.length) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            const validArtFiles = artFiles.filter(file => 
              imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
            );
            albumArtUrls = validArtFiles.map(file => {
              const { data: urlData } = supabase.storage.from('albumart').getPublicUrl(file.name);
              return urlData.publicUrl;
            });
            console.log(`🎨 Found ${albumArtUrls.length} album art images`);
          } else {
            console.log('🎨 No album art found, using default genre artwork');
            albumArtUrls = [selectedGenre.artwork];
          }
        }

        // Process each bucket - simplified
        for (const bucketPath of selectedGenre.buckets) {
          console.log(`🗂️ Processing bucket path: ${bucketPath}`);
          
          // Parse bucket and folder from path like "neuralpositivemusic/Classical"
          let bucketName: string;
          let folderPath: string;
          
          if (bucketPath.includes('/')) {
            const parts = bucketPath.split('/');
            bucketName = parts[0];
            folderPath = parts.slice(1).join('/');
            console.log(`📁 Parsed - Bucket: ${bucketName}, Folder: ${folderPath}`);
          } else {
            bucketName = bucketPath;
            folderPath = (selectedGenre as any).folder || '';
            console.log(`📦 Direct bucket: ${bucketName}${folderPath ? `, folder: ${folderPath}` : ''}`);
          }
          
          // List files from bucket/folder
          console.log(`🔍 Listing files from bucket: ${bucketName}, folder: "${folderPath}"`);
          const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list(folderPath, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (listError) {
            console.error(`❌ Error listing files from ${bucketName}/${folderPath}:`, listError);
            continue;
          }

          if (!files || files.length === 0) {
            console.log(`📂 No files found in ${bucketName}/${folderPath}`);
            continue;
          }

          console.log(`📁 Found ${files.length} files in ${bucketName}/${folderPath}`);

          // Filter for audio files
          const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
          const audioFiles = files.filter(file => 
            audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
          );

          console.log(`🎵 Found ${audioFiles.length} audio files in bucket: ${bucketName}/${folderPath}`);

          // Process files in smaller initial batches, load more as needed
          const INITIAL_BATCH_SIZE = 10; // Load only 10 tracks initially
          const limitedFiles = audioFiles.slice(0, INITIAL_BATCH_SIZE);
          console.log(`📊 Processing first ${limitedFiles.length} files from ${audioFiles.length} total (lazy loading)`);

          // Convert to tracks with direct URLs
          const bucketTracks: any[] = [];
          
          for (let i = 0; i < limitedFiles.length; i++) {
            const file = limitedFiles[i];
            try {
              // Construct full path for file access
              const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name;
              const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
              
              if (!urlData?.publicUrl) {
                console.warn(`⚠️ No URL generated for ${file.name}`);
                continue;
              }
              
              const cleanTitle = file.name.replace(/\.[^/.]+$/, ''); // Remove extension only

              // Diverse album art selection using local pool + bucket images
              const localArtPool = [
                '/lovable-uploads/alpha-mountain-lake.png',
                '/lovable-uploads/beta-waterfall.png',
                '/lovable-uploads/gamma-sunbeam-forest.png',
                '/lovable-uploads/delta-moonlit-lake.png',
                '/lovable-uploads/theta-misty-path.png',
                '/lovable-uploads/european-classical-terrace.png',
                '/lovable-uploads/string-quartet-studio.png',
                '/lovable-uploads/classical-meadow-ensemble.png',
                '/lovable-uploads/acoustic-sunset-field.png',
                '/lovable-uploads/folk-instruments-meadow.png'
              ];
              const artPool = [...(albumArtUrls || []), ...localArtPool];
              const seed = Array.from(fullPath).reduce((a, c) => (a + c.charCodeAt(0)) % 2147483647, 0);
              const selectedArtwork = artPool.length ? artPool[seed % artPool.length] : selectedGenre.artwork;

              // Determine correct genre/artist based on bucket and content
              let artistName = 'Therapeutic Music';
              let trackGenre = selectedGenre.name;
              
              if (selectedGenre.id === 'house-music' && bucketName === 'neuralpositivemusic') {
                artistName = 'House Music Collection';
                trackGenre = 'House Music';
              } else if (bucketName === 'classicalfocus') {
                artistName = 'Classical Music';
                trackGenre = 'Classical Crossover';
              } else if (bucketName === 'Chopin') {
                artistName = 'Classical Piano';  
                trackGenre = 'Peaceful Piano';
              } else if (bucketName === 'samba') {
                artistName = 'World Music';
                trackGenre = 'World & New Age';
              }

              const track = {
                id: `${bucketName}-${fullPath}-${Date.now()}-${Math.random()}`, // Unique ID each time
                title: cleanTitle,
                artist: artistName,
                genre: trackGenre,
                storage_bucket: bucketName,
                storage_key: fullPath,
                stream_url: urlData.publicUrl,
                artwork_url: selectedArtwork,
                audio_status: 'working' as const,
              };
              
              bucketTracks.push(track);
            } catch (error) {
              console.error(`❌ Error processing file ${file.name}:`, error);
              continue;
            }
          }

          console.log(`📊 Successfully created ${bucketTracks.length} initial tracks from ${bucketName}/${folderPath}`);

          allTracks.push(...bucketTracks);
          console.log(`✅ Added ${bucketTracks.length} tracks from ${bucketName}/${folderPath}`);
        }

        console.log(`🎯 Total tracks from all buckets: ${allTracks.length}`);
        
        // Set tracks with better randomization and de-duplication by display title
        if (allTracks.length > 0) {
          // De-duplicate by formatted display title (case-insensitive)
          const seen = new Set<string>();
          const uniqueByTitle = allTracks.filter(t => {
            const key = formatTrackTitleForDisplay(t.title || '').toLowerCase();
            if (!key) return true;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          // Multiple shuffle passes for better randomization
          let shuffledTracks = [...uniqueByTitle];
          for (let i = 0; i < 3; i++) {
            shuffledTracks = shuffledTracks.sort(() => Math.random() - 0.5);
          }
          
          // Cap count
          const trackCount = Math.min(50, shuffledTracks.length);
          const finalTracks = shuffledTracks.slice(0, trackCount).map(t => ({
            ...t,
            randomId: Date.now() + Math.random()
          }));
          
          setTracks(finalTracks);
          console.log(`✅ Set ${finalTracks.length} unique tracks (from ${allTracks.length} total)`);
          console.log(`🎵 Sample tracks:`, finalTracks.slice(0, 3).map(t => ({ title: t.title, artwork: t.artwork_url })));
        } else {
          console.log('📂 No tracks found in any bucket, using fallback');
          const fallbackTracks = generateFallbackTracks(selectedGenre.name, goal.name, albumArtUrls);
          setTracks(fallbackTracks);
          console.log(`🔄 Set ${fallbackTracks.length} fallback tracks`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to load tracks:`, error);
        setTracks(generateFallbackTracks(selectedGenre.name, goal.name));
      } finally {
        setIsLoading(false);
        if (!cancelled) loadLock.current = false;
      }
    };

    loadTracks();

    return () => {
      cancelled = true;
      loadLock.current = false;
    };
  }, [goal?.id, selectedGenre?.id]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleTrackPlay = async (track: Track) => {
    if (audioLoading) {
      toast.error("Already loading music, please wait...");
      return;
    }

    try {
      console.log(`🎵 Playing track:`, track);
      toast.loading(`Starting playback...`, { id: "track-play" });
      
      const audioStore = useAudioStore.getState();
      await audioStore.setQueue([track], 0);
      await audioStore.play();
      
      toast.success(`Now playing: ${track.title}`, { id: "track-play" });
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      toast.error("Failed to start playback. Please try another track.", { id: "track-play" });
    }
  };

  if (!goal || !selectedGenre) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Genre not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header - Mobile optimized */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Goal and Genre Info - Mobile responsive */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            {goal.name}
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground leading-tight">
            {selectedGenre.name}
          </h2>
        </div>


        {/* Vertical Track List - Mobile optimized */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm sm:text-base">Loading music collection...</span>
            </div>
          </div>
        ) : (
          <VerticalTrackList
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlay={handleTogglePlay}
            isLoading={audioLoading}
          />
        )}
      </div>
    </div>
  );
};

export default GenreView;