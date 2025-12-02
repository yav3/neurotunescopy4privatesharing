import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";
import mikeHeadshot from "@/assets/team/mike-larson.jpg";

interface TeamMember {
  name: string;
  credentials?: string;
  role: string;
  title?: string;
  photo?: string;
}

const foundingTeam: TeamMember[] = [
  // Top row - as requested: Yasmine, Mike, Chris, Brian
  {
    name: "Yasmine Van Wilt",
    credentials: "PhD, FRSA",
    role: "Co-Founder",
    title: "CEO, CTO",
  },
  {
    name: "Mike Larson",
    role: "Chief Sound Officer",
    title: '"The Minister of Sound"',
    photo: mikeHeadshot,
  },
  {
    name: "Christopher Long",
    credentials: "MBA",
    role: "CFO, COO",
  },
  {
    name: "Brian E. Wallace",
    credentials: "MD, PhD, MBA",
    role: "CMedO, President",
  },
  // Second row - Josh, Peter, Jim, Marcin
  {
    name: "Joshua Langenthal",
    credentials: "MCRP, MLA",
    role: "",
  },
  {
    name: "Peter Blumen",
    credentials: "ScM, MBA",
    role: "Co-Founder",
  },
  {
    name: "Jim Anderson",
    role: "Co-Founder",
  },
  {
    name: "Marcin Waryszak",
    role: "SVP Operations",
  },
];

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
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light tracking-tight text-neutral-200 mb-6">
              Leadership Team
            </h1>
          </div>

          {/* Founding Team Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-neutral-200 text-center mb-12">Founding Team</h2>
            
            {/* Top Row - 4 members */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {foundingTeam.slice(0, 4).map((member, index) => (
                <div key={index} className="text-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border border-neutral-700/50"
                    />
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-neutral-800/50 border border-neutral-700/50" />
                  )}
                  <h3 className="text-lg font-light text-neutral-200">{member.name}</h3>
                  {member.credentials && (
                    <p className="text-sm text-neutral-400">{member.credentials}</p>
                  )}
                  {member.role && (
                    <p className="text-sm text-neutral-500 mt-1">{member.role}</p>
                  )}
                  {member.title && (
                    <p className="text-sm text-neutral-500">{member.title}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Second Row - 4 members */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {foundingTeam.slice(4, 8).map((member, index) => (
                <div key={index} className="text-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border border-neutral-700/50"
                    />
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-neutral-800/50 border border-neutral-700/50" />
                  )}
                  <h3 className="text-lg font-light text-neutral-200">{member.name}</h3>
                  {member.credentials && (
                    <p className="text-sm text-neutral-400">{member.credentials}</p>
                  )}
                  {member.role && (
                    <p className="text-sm text-neutral-500 mt-1">{member.role}</p>
                  )}
                  {member.title && (
                    <p className="text-sm text-neutral-500">{member.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advisory Board Section */}
          <div className="mt-28 text-center">
            <h2 className="text-4xl font-light text-neutral-200 mb-6">Advisory Board</h2>
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
