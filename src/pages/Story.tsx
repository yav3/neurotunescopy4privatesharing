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

          {/* Origin Story */}
          <section className="mb-20">
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Neuralpositive's mission has a personal start: Our founder was caretaker for her dying father; she played music to ease his pain. Our CMO lost his mother to AD; music eased her agitation. The more the team looked, the more it was clear that music could be harnessed to solve many functional problems not just for individuals but for enterprises and population health.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              In healthcare, workplaces, and shared environments, <span style={{ color: '#e4e4e4' }}>nothing influences how people feel more quickly—or more universally—than sound.</span>
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Yet most organizations depend on generic playlists, inconsistent ambient noise, popular music that isn't optimized or designed for purpose, and/or silence that does little to support comfort, wellbeing, or operational flow.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              At the same time, decades of research in <span style={{ color: '#e4e4e4' }}>neuroscience, psychiatry, and music therapy</span> have shown that the structure of music can meaningfully affect emotional state, focus, and physiological calm. But this insight rarely reaches the environments where people need it most.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              We built NeuroTunes to bridge that gap.
            </p>
          </section>

          {/* A New Kind of Audio System */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              A new kind of audio system—for real-world environments
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              NeuroTunes is the result of 8+ years of research and collaboration across <span style={{ color: '#e4e4e4' }}>Columbia University, Cornell Tech, Weill Cornell Medicine, clinical researchers, and composers</span>. Our team saw an opportunity to transform everyday environments—hospitals, senior living communities, workplaces, retail spaces, and public areas—by bringing <span style={{ color: '#e4e4e4' }}>purpose-built, evidence-informed music</span> into the places where people live, work, recover, and connect.
            </p>
            <div className="my-8 pl-6" style={{ borderLeft: '2px solid rgba(228, 228, 228, 0.15)' }}>
              <p className="text-base mb-2" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>Not consumer playlists.</p>
              <p className="text-base mb-2" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>Not generic background tracks.</p>
              <p className="text-base" style={{ color: 'rgba(228, 228, 228, 0.60)' }}>Not wellness apps requiring new habits.</p>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Instead: <span style={{ color: '#e4e4e4' }}>audio carefully composed and engineered for comfort, clarity, and emotional ease—deployable at enterprise scale.</span>
            </p>
          </section>

          {/* Music as Design */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Music as design. Music as supportive care. Music as infrastructure.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              We believe music should be more than entertainment. In healthcare, it can soften difficult moments and support emotional regulation. In workplaces, it can reduce stress and improve cognitive flow. In public spaces, it can create coherence, warmth, and a sense of calm.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              NeuroTunes treats sound as a <span style={{ color: '#e4e4e4' }}>design element</span> and a <span style={{ color: '#e4e4e4' }}>support modality</span>, not a playlist. Our catalog is fully original—8,500+ purpose-composed pieces built using principles from neuroscience, music cognition, and evidence-based therapeutic practice.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Every track is created with intention: <span style={{ color: '#e4e4e4' }}>comfort, clarity, stability, continuity.</span>
            </p>
          </section>

          {/* Built for Organizations */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Built for organizations, not individuals
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Most audio tools are designed for personal use. NeuroTunes is built for:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {[
                "Hospitals and nursing homes",
                "Employee wellness and corporate environments",
                "Public and staff-facing spaces",
                "Retail, hospitality, and transportation"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="px-4 py-3 rounded-lg"
                  style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}
                >
                  <p className="text-sm font-light" style={{ color: 'rgba(228, 228, 228, 0.80)' }}>{item}</p>
                </div>
              ))}
            </div>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              We provide:
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
              {[
                "Multi-room scheduling",
                "Zone-based programming",
                "Season and time-of-day adaptation",
                "QR-based clinical access",
                "Zero-PRO licensing",
                "Enterprise controls",
                "Privacy-conscious architecture"
              ].map((feature, index) => (
                <p key={index} className="text-sm font-light" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                  • {feature}
                </p>
              ))}
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.85)' }}>
              Because organizations need <span style={{ color: '#e4e4e4' }}>infrastructure</span>, not apps.
            </p>
          </section>

          {/* Our Mission */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Our mission
            </h2>
            <div 
              className="p-8 rounded-2xl mb-6"
              style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.10)' }}
            >
              <p className="text-lg font-light leading-relaxed" style={{ color: '#e4e4e4' }}>
                To improve emotional comfort, support focus, and elevate everyday environments through sound—grounded in science, delivered with elegance, and designed for the real world.
              </p>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              We believe everyone deserves access to environments that feel calmer, clearer, and more human. NeuroTunes exists to make that possible at scale.
            </p>
          </section>

          {/* Our Team */}
          <section className="mb-20">
            <h2 className="text-2xl font-light mb-8" style={{ color: '#e4e4e4' }}>
              Our team
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Behind NeuroTunes is a multidisciplinary team of:
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["Composers", "Engineers", "Neuroscientists", "Clinicians", "Designers", "Technologists"].map((role, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-light"
                  style={{ background: 'rgba(228, 228, 228, 0.05)', border: '1px solid rgba(228, 228, 228, 0.12)', color: 'rgba(228, 228, 228, 0.80)' }}
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Each bringing a deep belief in the emotional and human power of sound, and a commitment to delivering it in a way that is modern, accessible, and enterprise-ready.
            </p>
            <div 
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(228, 228, 228, 0.02)', border: '1px solid rgba(228, 228, 228, 0.06)' }}
            >
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                We are built on sponsored research. Thanks to investment from the Jacobs Technion Institute at Cornell Tech, we spun out of the Runway Postdoctoral Program and have received support, mentorship, and further investment from institutions like Weill Cornell Medical College, Cornell University, Stanford University Medical School, and others.
              </p>
              <p className="text-sm" style={{ color: 'rgba(6, 182, 212, 0.9)' }}>
                Founding team with combined total of more than $500M in exits through M&A and IPO.
              </p>
            </div>
          </section>

          {/* Our Approach */}
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#e4e4e4' }}>
              Our Approach
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Evidence-informed", desc: "Built on decades of research in neuroscience, psychiatry, and music therapy" },
                { title: "Purpose-composed", desc: "8,500+ original tracks created with therapeutic intention" },
                { title: "Enterprise deployed", desc: "Infrastructure designed for organizations at scale" }
              ].map((pillar, index) => (
                <div 
                  key={index}
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
