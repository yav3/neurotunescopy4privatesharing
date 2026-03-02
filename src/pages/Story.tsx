import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { StoryIntro } from "@/components/StoryIntro";

export const Story = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      {showIntro && <StoryIntro onComplete={() => setShowIntro(false)} />}
      
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-24 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ color: '#e4e4e4' }}>
              Our Story
            </h1>
            <p className="text-xl font-light" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Where science, sound, and human experience meet.
            </p>
          </div>

          {/* Origin */}
          <section className="mb-20">
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Our founder played music to ease her dying father's pain. Our CMO lost his mother to Alzheimer's—music calmed her agitation. The pattern was clear: <span style={{ color: '#e4e4e4' }}>nothing influences how people feel more quickly than sound.</span>
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Yet most organizations rely on generic playlists and silence. We built NeuroTunes to bridge that gap.
            </p>
          </section>

          {/* What We Built */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Purpose-built audio infrastructure
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              8+ years of R&D across <span style={{ color: '#e4e4e4' }}>Columbia, Cornell Tech, Weill Cornell Medicine, and Stanford</span>. 8,500+ original tracks composed using neuroscience, music cognition, and evidence-based therapeutic practice.
            </p>
            <div className="my-8 pl-6" style={{ borderLeft: '2px solid rgba(228, 228, 228, 0.15)' }}>
              <p className="text-base" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>Not playlists. Not wellness apps. Not background noise.</p>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Audio engineered for <span style={{ color: '#e4e4e4' }}>comfort, clarity, and emotional ease—deployable at enterprise scale.</span>
            </p>
          </section>

          {/* Built for Organizations */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Built for organizations
            </h2>
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                "Hospitals & senior living",
                "Corporate wellness",
                "Retail & hospitality",
                "Public spaces"
              ].map((item, i) => (
                <div 
                  key={i}
                  className="px-4 py-3 rounded-lg"
                  style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}
                >
                  <p className="text-sm font-light" style={{ color: 'rgba(228, 228, 228, 0.80)' }}>{item}</p>
                </div>
              ))}
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Multi-room scheduling, zone-based programming, zero-PRO licensing, and privacy-conscious architecture. Because organizations need <span style={{ color: '#e4e4e4' }}>infrastructure</span>, not apps.
            </p>
          </section>

          {/* Mission */}
          <section className="mb-20">
            <div 
              className="p-8 rounded-2xl"
              style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.10)' }}
            >
              <h2 className="text-2xl font-light mb-4" style={{ color: '#e4e4e4' }}>Our mission</h2>
              <p className="text-lg font-light leading-relaxed" style={{ color: '#e4e4e4' }}>
                Improve emotional comfort and elevate everyday environments through sound—grounded in science, designed for the real world.
              </p>
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-6" style={{ color: '#e4e4e4' }}>
              Our team
            </h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {["Composers", "Engineers", "Neuroscientists", "Clinicians", "Designers", "Technologists"].map((role, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-light"
                  style={{ background: 'rgba(228, 228, 228, 0.05)', border: '1px solid rgba(228, 228, 228, 0.12)', color: 'rgba(228, 228, 228, 0.80)' }}
                >
                  {role}
                </span>
              ))}
            </div>
            <div 
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(228, 228, 228, 0.02)', border: '1px solid rgba(228, 228, 228, 0.06)' }}
            >
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                Spun out of Cornell Tech's Runway Program with support from Weill Cornell, Stanford, and the Jacobs Technion Institute.
              </p>
              <p className="text-sm" style={{ color: 'rgba(6, 182, 212, 0.9)' }}>
                Founding team with $500M+ in combined exits through M&A and IPO.
              </p>
            </div>
          </section>

          {/* Approach */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Evidence-informed", desc: "Decades of neuroscience and music therapy research" },
                { title: "Purpose-composed", desc: "8,500+ original tracks with therapeutic intention" },
                { title: "Enterprise deployed", desc: "Infrastructure designed for organizations at scale" }
              ].map((pillar, i) => (
                <div 
                  key={i}
                  className="p-5 rounded-2xl text-center"
                  style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}
                >
                  <h3 className="text-base font-light mb-2" style={{ color: '#e4e4e4' }}>{pillar.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Story;
