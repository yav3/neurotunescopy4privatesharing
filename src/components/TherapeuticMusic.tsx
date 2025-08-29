import { MusicCategoryCard } from "./MusicCategoryCard";
import focusArtwork from "@/assets/focus-artwork.jpg";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import { useAudio } from "@/context/AudioContext";
import { API } from "@/lib/api";

interface TherapeuticMusicProps {
  onCategorySelect?: (category: string) => void;
}

export const TherapeuticMusic = ({ onCategorySelect }: TherapeuticMusicProps) => {
  const { setPlaylist, loadTrack } = useAudio();
  
  const categories = [
    { id: "focus", title: "Focus", image: focusArtwork },
    { id: "mood-boost", title: "Mood Boost", image: moodBoostArtwork },
    { id: "sleep", title: "Sleep", image: sleepArtwork },
    { id: "acoustic", title: "Acoustic", image: acousticArtwork },
  ];

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    console.log('🎵 Therapeutic category clicked:', categoryTitle);
    
    try {
      // Use API instead of direct Supabase calls
      console.log('🔥 Fetching tracks via API for category:', categoryId);
      const { tracks } = await API.playlist(categoryId);
      console.log('📦 Found tracks via API:', tracks.length);
      
      if (tracks.length > 0) {
        console.log('🎮 Setting playlist and loading first track');
        setPlaylist(tracks);
        await loadTrack(tracks[0]);
        console.log('✅ Music playback initiated for:', tracks[0].title);
      } else {
        // Fallback: try generic 'focus' goal
        console.log('🔄 No specific tracks found, trying focus fallback');
        const fallback = await API.playlist('focus');
        if (fallback.tracks.length > 0) {
          setPlaylist(fallback.tracks);
          await loadTrack(fallback.tracks[0]);
          console.log('✅ Fallback music loaded:', fallback.tracks[0].title);
        }
      }
      
      onCategorySelect?.(categoryId);
    } catch (error) {
      console.error('❌ Error loading therapeutic music via API:', error);
      onCategorySelect?.(categoryId);
    }
  };

  return (
    <section className="px-4 md:px-8 mb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Therapeutic Music</h2>
          <p className="text-muted-foreground">Choose Your Therapeutic Goal</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <MusicCategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              onClick={() => handleCategoryClick(category.id, category.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};