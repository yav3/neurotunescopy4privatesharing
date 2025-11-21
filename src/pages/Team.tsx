import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Team = () => {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Executive Officer",
      bio: "Neuroscientist specializing in auditory processing and therapeutic interventions. PhD from Stanford University.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "Dr. Michael Torres",
      role: "Chief Scientific Officer",
      bio: "Leading researcher in music therapy and cognitive neuroscience. Former director at Weill Cornell Medicine.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Elena Rodriguez",
      role: "Chief Technology Officer",
      bio: "Technology leader with 15 years building scalable healthcare platforms. MS Computer Science from MIT.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      name: "Dr. James Park",
      role: "Chief Medical Officer",
      bio: "Board-certified psychiatrist and music therapy specialist. MD from Johns Hopkins, fellowship at Stanford.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    }
  ];

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

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div 
                key={index}
                className="rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mb-6 object-cover"
                  style={{ border: '2px solid rgba(255, 255, 255, 0.20)' }}
                />
                <h3 className="text-2xl font-light text-white mb-2">{member.name}</h3>
                <p className="text-cyan-400 mb-4 text-sm uppercase tracking-wider">{member.role}</p>
                <p className="text-neutral-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
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
