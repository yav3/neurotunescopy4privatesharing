import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { StoryIntro } from "@/components/StoryIntro";
import { Hospital, Plane, Building2, Music } from "lucide-react";

export const Story = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      {showIntro && <StoryIntro onComplete={() => setShowIntro(false)} />}
      
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-24 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ color: '#e4e4e4' }}>
              Our Story
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Music & AI For Better Brain Health
            </p>
          </div>

          {/* Real-World Deployment */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#e4e4e4' }}>
              Real-World Deployment
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Music className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Environmental & Background Music</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Hotels, retail stores, restaurants, spas, gyms, senior living facilities, and public spaces. 
                  PRO-free therapeutic background music with multi-zone control, time-of-day programming, 
                  and cloud management. No licensing fees.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Hospital className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Healthcare Systems</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Waiting rooms, common areas, pre- and post-procedure support, bedside use, 
                  remote at-home care, elder care settings, staff resilience. Non-pharmacologic, 
                  low effort for staff, safe and secure.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Plane className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Enterprise & Performance</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Airlines, corporate wellness, peak performance programs, and employee benefit offerings. 
                  On-demand stress relief, focus support, and recovery as a premium service — 
                  no medication and no extra hardware.
                </p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <Building2 className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <h3 className="text-sm font-light mb-2" style={{ color: '#e4e4e4' }}>Technology Partners</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>
                  Licensed or embedded into existing digital platforms. Our 8,500+ purpose-composed 
                  therapeutic tracks and closed-loop dosing engine plug directly into your product 
                  to enhance outcomes and retention.
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#e4e4e4' }}>
              Meet the Team
            </h2>
            
            <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Neuroscientists, physicians, AI engineers (including ex-Spotify architect/inventor), composers, 
                and a 5× Grammy-winning sound lead. Proven leadership, ready to deploy and deliver calmer care 
                and measurable relief for patients.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                We are built on sponsored research. Thanks to investment from the Jacobs Technion Institute 
                at Cornell Tech, we spun out of the Runway Postdoctoral Program and have received support, 
                mentorship, and further investment from institutions like Weill Cornell Medical College, 
                Cornell University, Stanford University Medical School, and others.
              </p>
              <p className="text-sm" style={{ color: 'rgba(6, 182, 212, 0.9)' }}>
                Founding team with combined total of more than $500M in exits through M&amp;A and IPO.
              </p>
            </div>

            <p className="text-center text-xs" style={{ color: 'rgba(228, 228, 228, 0.50)' }}>
              With generous support from Cornell University, Jacobs Technion-Cornell Institute, 
              Weill Cornell Medicine, and Stanford School of Medicine
            </p>
          </section>

        </div>
      </main>

        <Footer />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Story;