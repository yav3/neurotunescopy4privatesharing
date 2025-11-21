import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const Careers = () => {
  const positions = [
    {
      title: "Senior ML Engineer - Audio Processing",
      department: "Engineering",
      location: "New York, NY / Remote",
      type: "Full-time"
    },
    {
      title: "Clinical Research Scientist",
      department: "Research",
      location: "Palo Alto, CA",
      type: "Full-time"
    },
    {
      title: "Product Designer - Healthcare UX",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Music Therapist - Content Development",
      department: "Clinical",
      location: "New York, NY / Hybrid",
      type: "Full-time"
    }
  ];

  const values = [
    {
      title: "Science-First",
      description: "Every decision grounded in peer-reviewed research and clinical evidence"
    },
    {
      title: "Patient Impact",
      description: "We measure success by the wellbeing outcomes we create for real people"
    },
    {
      title: "Collaborative Excellence",
      description: "World-class multidisciplinary teams working together towards a common mission"
    },
    {
      title: "Continuous Innovation",
      description: "Pushing boundaries in neuroscience, music therapy, and technology"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-28">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-2xl font-light text-neutral-300 max-w-3xl mx-auto">
              Help us transform mental health and wellbeing through scientifically-validated therapeutic audio
            </p>
          </div>

          {/* Values */}
          <div className="mb-28">
            <h2 className="text-4xl font-light text-white mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="rounded-3xl p-8"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <h3 className="text-2xl font-light text-white mb-3">{value.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-28">
            <h2 className="text-4xl font-light text-white mb-12 text-center">Open Positions</h2>
            <div className="space-y-4">
              {positions.map((position, index) => (
                <button
                  key={index}
                  className="w-full rounded-3xl p-8 text-left transition-all duration-300 hover:scale-[1.01] group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-light text-white mb-2">{position.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Benefits CTA */}
          <div className="text-center">
            <div 
              className="rounded-3xl p-12 inline-block"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Don't see a fit?
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl">
                We're always looking for talented people. Send us your resume and let's talk.
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                Send General Application
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
