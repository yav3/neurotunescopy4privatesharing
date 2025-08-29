import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";
import { SupabaseService } from "@/services/supabase";

interface MusicCategoryCardProps {
  title: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

export const MusicCategoryCard = ({ title, image, className, onClick }: MusicCategoryCardProps) => {
  const { setPlaylist, loadTrack } = useAudio();

  const handleClick = async () => {
    console.log('🎵 Category card clicked:', title.toLowerCase());
    
    // Test basic audio functionality first
    console.log('🔧 Testing basic audio element...');
    const testAudio = new Audio();
    console.log('🔧 Audio element created:', testAudio);
    
    try {
      console.log('🔍 Loading tracks for category:', title.toLowerCase());
      const demoTracks = await SupabaseService.getMusicTracksByCategory(title.toLowerCase());
      console.log('📦 Found tracks:', demoTracks.length, demoTracks);
      
      if (demoTracks.length > 0) {
        console.log('🎮 Setting playlist and loading first track:', demoTracks[0].title);
        setPlaylist(demoTracks);
        
        // Add a small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await loadTrack(demoTracks[0]);
        console.log('✅ Track loading initiated for:', demoTracks[0].title);
      } else {
        console.warn('⚠️ No tracks found for category:', title.toLowerCase());
        
        // Try to get any tracks as fallback
        const fallbackTracks = await SupabaseService.fetchTracks({ limit: 5 });
        console.log('🔄 Fallback tracks found:', fallbackTracks.length);
        
        if (fallbackTracks.length > 0) {
          setPlaylist(fallbackTracks);
          await new Promise(resolve => setTimeout(resolve, 100));
          await loadTrack(fallbackTracks[0]);
          console.log('✅ Fallback track loading initiated:', fallbackTracks[0].title);
        }
      }
      
      onClick?.();
    } catch (error) {
      console.error('❌ Error in category card click handler:', error);
      
      // Ultimate fallback - try to test a basic audio URL
      console.log('🔄 Testing basic audio URL as ultimate fallback...');
      try {
        const testUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-audio?filePath=tangelo_jazz_relaxation_remix_2.mp3&bucket=neuralpositivemusic';
        console.log('🔧 Testing URL:', testUrl);
        
        const testResponse = await fetch(testUrl, { method: 'HEAD' });
        console.log('🔧 Test response:', testResponse.status, testResponse.statusText);
        
        testAudio.src = testUrl;
        testAudio.load();
        console.log('🔧 Test audio loaded with URL');
        
        // Just try to play for 1 second as a test
        testAudio.play().then(() => {
          console.log('🎉 Test audio started playing!');
          setTimeout(() => {
            testAudio.pause();
            console.log('🔧 Test audio stopped');
          }, 1000);
        }).catch(playError => {
          console.error('🔧 Test audio play failed:', playError);
        });
        
      } catch (testError) {
        console.error('🔧 Ultimate fallback test failed:', testError);
      }
      
      onClick?.();
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-card bg-gradient-card border-border/50",
        className
      )}
      onClick={handleClick}
    >
      <div className="aspect-square relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        </div>
      </div>
    </Card>
  );
};