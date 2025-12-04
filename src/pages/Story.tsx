import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { StoryIntro } from "@/components/StoryIntro";

export const Story = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      {/* Cinematic intro overlay */}
      {showIntro && <StoryIntro onComplete={() => setShowIntro(false)} />}
      
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8" style={{ color: '#e4e4e4' }}>
              What is NeuroTunes?
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              NeuroTunes turns music listening into a clinical tool—AI-personalized therapeutic music that 
              adapts in real time to the patient's state and preference.
            </p>
          </div>

          {/* Team */}
          <section className="mb-20">
            <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>Made by Neuralpositive</h2>
            
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Neuralpositive is a deep tech AI company that spun out of the Runway Postdoctoral Program of the Jacobs Technion Institute at Cornell Tech.
              </p>
              <p className="leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Neuroscientists, physicians, AI engineers (including ex-Spotify architect/inventor), composers, 
                and a 5× Grammy-winning sound lead. Proven leadership, ready to deploy and deliver calmer care 
                and measurable relief for patients.
              </p>
              <p className="text-sm" style={{ color: 'rgba(6, 182, 212, 0.9)' }}>
                Founding team with combined total of more than $500M in exits through M&amp;A and IPO.
              </p>
            </div>
          </section>

          {/* Content */}
          <div className="space-y-20" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
            
            {/* The Solution */}
            <section>
              <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>The Solution</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#e4e4e4' }}>The App</h3>
                  <p className="leading-relaxed text-sm">
                    AI-personalized therapeutic music that adapts in real time to the patient's state and preference. 
                    Playlists adjust via a patented closed-loop engine based on quick patient input and response.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#e4e4e4' }}>Catalog</h3>
                  <p className="leading-relaxed text-sm">
                    8,000+ purpose-composed tracks with indication-specific dosing algorithms for anxiety and pain. 
                    Fully owned IP—no royalties, predictable lower cost, and no licensing risk.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Evidence at a Glance</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Meta-analysis of thousands of journal articles examining therapeutic use of music and music therapy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>8+ years R&amp;D at Columbia / Cornell Tech; pilot/UX studies show pre/post anxiety reductions (p&lt;.05)</span>
                  </li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Story;