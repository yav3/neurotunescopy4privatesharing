import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import teamLeadershipImage from '@/assets/team-leadership-black.png';
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

export const Team = () => {
  const background = usePageBackground();
  
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <PageBackgroundMedia 
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
          <h1 className="text-6xl font-light tracking-tight text-white mb-6">
            Leadership Team
          </h1>
          </div>


          {/* Advisory Board Section */}
          <div className="mt-28 text-center">
            <h2 className="text-4xl font-light text-white mb-6">Advisory Board</h2>
            <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Our advisory board includes leading researchers from Stanford Medicine, Weill Cornell Medicine, 
              and the Jacobs Technion-Cornell Institute, ensuring our platform remains at the 
              forefront of neuroscience and music therapy research.
            </p>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Team;
