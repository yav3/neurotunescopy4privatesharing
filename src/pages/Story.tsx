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

          {/* Environmental Music */}
          <section className="mb-20">
            <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>Environmental Music</h2>
            
            <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                NeuroTunes is a premium AI-guided environmental music streaming SaaS delivered as an app for desktop and native download. 
                It enables seamless control of numerous administrative accounts across a customizable, scalable number of locations and set-ups.
              </p>
              <p className="leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Each space an administrative user controls is designed to enhance the experience of those within it. Continuous play 
                with advanced schedule programming enables the delivery of music sessions that meet the specific needs of environments, taking 
                environmental factors, staff needs, community health, and visitor comfort into consideration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>The Science Behind It</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                  Our streaming SaaS is a patented, evidence-based, and clinically-validated system that uses core principles from 
                  music therapy, music cognition, and neuropsychiatry. All music has been purpose-composed using specific musical 
                  patterns, frequencies, audio settings, and beats to support anxiety reduction and cognitive clarity.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>AI-Powered Scheduling</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                  Our machine learning and AI technology pre-programs ideal music streaming playlists for specific times of day and 
                  environmental needs. Administrative users can add notes and teach the playlists to improve through favoriting and 
                  skipping, ensuring the right music plays at the right time and place.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
              <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Evidence-Based Principles</h3>
              <ul className="space-y-3 text-sm" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                <li className="flex items-start gap-3">
                  <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                  <span>Protocol design informed by thousands of publications across music therapy, music cognition, AI, machine learning, neuropsychiatry, neurology, and neuroscience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                  <span>Informed by the principles of music therapy—a field with decades of documented best practices—made scalable and on-demand through our streaming service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                  <span>Delivers benefits for members, visitors, patients, staff, and employees—reduced anxiety and improved focus</span>
                </li>
              </ul>
            </div>
          </section>

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