import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import teamLeadershipImage from '@/assets/team-leadership.png';

export const Team = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Leadership Team
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              World-class experts in neuroscience, music therapy, and technology
            </p>
          </div>

          {/* Team Image */}
          <div className="mb-20">
            <img 
              src={teamLeadershipImage}
              alt="NeuroTunes Leadership Team"
              className="w-full rounded-3xl"
              style={{ 
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            />
          </div>

          {/* Advisory Board Section */}
          <div className="mt-28 text-center">
            <h2 className="text-4xl font-light text-white mb-6">Advisory Board</h2>
            <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Our advisory board includes leading researchers from Stanford Medicine, Weill Cornell Medicine, 
              MIT Media Lab, and the Jacobs Technion-Cornell Institute, ensuring our platform remains at the 
              forefront of neuroscience and music therapy research.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
