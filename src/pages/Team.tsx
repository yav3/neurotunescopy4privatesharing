import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Team = () => {
  const team = [
    {
      name: "Yasmine Van Wilt",
      credentials: "PhD, FRSA",
      role: "Co-Founder, CEO, CTO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "Peter Blumen",
      credentials: "ScM, MBA",
      role: "Co-Founder, CIO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Jim Anderson",
      credentials: "",
      role: "Co-Founder, Chief Architect",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Brian E. Wallace",
      credentials: "MD, PhD, MBA",
      role: "CMedO, President",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Christopher Long",
      credentials: "MBA",
      role: "CFO, COO",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
      name: "Joshua Langenthal",
      credentials: "MCRP, MLA",
      role: "Chief of Staff, Investor",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    },
    {
      name: "Mike Larson",
      credentials: "",
      role: "Chief Sound Officer aka \"The Minister of Sound\"",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
    },
    {
      name: "Marcin Waryszak",
      credentials: "",
      role: "SVP Operations",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
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
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.05]"
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                  style={{ border: '3px solid rgba(255, 255, 255, 0.30)' }}
                />
                <h3 className="text-xl font-light text-white mb-1">
                  {member.name}
                  {member.credentials && <span className="block text-lg text-neutral-300">{member.credentials}</span>}
                </h3>
                <p className="text-cyan-400 text-sm mt-2">{member.role}</p>
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
