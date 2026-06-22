import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { TEAM } from "@/data/team";


const TEXT = "#e4e4e4";
const MUTED = "rgba(228, 228, 228, 0.65)";
const SOFT = "rgba(228, 228, 228, 0.80)";

export const About = () => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "#050607",
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(30,30,35,0.8) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(20,20,25,0.6) 0%, transparent 50%), linear-gradient(180deg, #050607 0%, #0a0a0c 50%, #050607 100%)",
      }}
    >
      <div className="relative z-10">
        <NavigationHeader />

        <main className="pt-32 pb-28">
          <div className="max-w-5xl mx-auto px-6">

            {/* Hero */}
            <header className="text-center mb-20">
              <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6" style={{ color: TEXT }}>
                About
              </h1>
              <p className="text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ color: SOFT }}>
                A research team building purpose-composed audio and the ML systems that deliver it at enterprise scale.
              </p>
            </header>

            {/* Origin — condensed */}
            <section className="mb-24 max-w-3xl mx-auto">
              <p className="text-base leading-relaxed" style={{ color: SOFT }}>
                Spun out of <span style={{ color: TEXT }}>Cornell Tech's Runway Program</span> with collaborators at Columbia,
                Weill Cornell Medicine, Stanford, and the Jacobs Technion-Cornell Institute. 8+ years of R&D across
                neuroscience, music cognition, and applied machine learning. 8,500+ original tracks composed in-house.
              </p>
            </section>

            {/* ML / AI */}
            <section className="mb-24">
              <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(6, 182, 212, 0.9)" }}>
                  Machine Learning
                </p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight" style={{ color: TEXT }}>
                  Models &amp; architecture
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl" style={{ background: "rgba(228,228,228,0.03)", border: "1px solid rgba(228,228,228,0.08)" }}>
                  <h3 className="text-base font-normal mb-3" style={{ color: TEXT }}>Audio embeddings</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    Self-supervised representations over spectrogram and waveform inputs, fine-tuned on our proprietary corpus
                    to capture timbre, harmonic motion, and rhythmic envelope.
                  </p>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: "rgba(228,228,228,0.03)", border: "1px solid rgba(228,228,228,0.08)" }}>
                  <h3 className="text-base font-normal mb-3" style={{ color: TEXT }}>Multi-label classifiers</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    Per-track predictions over genre, instrumentation, tempo, key, valence, arousal, and target cognitive state—
                    used both as retrieval features and as quality gates in production.
                  </p>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: "rgba(228,228,228,0.03)", border: "1px solid rgba(228,228,228,0.08)" }}>
                  <h3 className="text-base font-normal mb-3" style={{ color: TEXT }}>Sequence-aware ranking</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    Session-level models score next-track candidates against listener trajectory, time of day, and context—
                    optimizing for sustained engagement rather than single-track relevance.
                  </p>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: "rgba(228,228,228,0.03)", border: "1px solid rgba(228,228,228,0.08)" }}>
                  <h3 className="text-base font-normal mb-3" style={{ color: TEXT }}>LLM-assisted curation</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    Claude-class language models annotate, summarize, and reconcile metadata across the catalog, and power
                    natural-language playlist construction inside the product.
                  </p>
                </div>
              </div>
            </section>

            {/* Pipeline / data */}
            <section className="mb-24">
              <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(6, 182, 212, 0.9)" }}>
                  Pipeline &amp; Data
                </p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight" style={{ color: TEXT }}>
                  How the catalog is built
                </h2>
              </div>

              <ol className="space-y-5">
                {[
                  { n: "01", t: "Composition", d: "Original works produced in-house by staff composers and producers—no licensed third-party catalog." },
                  { n: "02", t: "Feature annotation", d: "Each track passes through automated extraction (key, tempo, dynamics, spectral profile) and human-in-the-loop review." },
                  { n: "03", t: "Model training", d: "Annotations feed embedding models and downstream classifiers; evaluation against held-out expert ratings." },
                  { n: "04", t: "Retrieval & delivery", d: "Production retrieval stack serves zone-, schedule-, and context-aware playlists at multi-room scale." },
                ].map((step) => (
                  <li
                    key={step.n}
                    className="flex gap-6 p-5 rounded-2xl"
                    style={{ background: "rgba(228,228,228,0.02)", border: "1px solid rgba(228,228,228,0.06)" }}
                  >
                    <span className="text-2xl font-light shrink-0" style={{ color: "rgba(6,182,212,0.85)" }}>{step.n}</span>
                    <div>
                      <h3 className="text-base font-normal mb-1" style={{ color: TEXT }}>{step.t}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Team */}
            <section className="mb-24">
              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3" style={{ color: TEXT }}>
                  Team
                </h2>
                <p className="text-sm font-light" style={{ color: MUTED }}>
                  Founding team with $500M+ in combined exits through M&amp;A and IPO.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl mx-auto">
                {team.map((member, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    {member.photo ? (
                      <div className="w-28 h-28 mb-3 rounded-full overflow-hidden border border-neutral-700/50 bg-neutral-900">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: member.objectPosition || "center 30%",
                            transform: member.scale ? `scale(${member.scale})` : undefined,
                            transformOrigin: "center",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 mb-3 rounded-full bg-neutral-800/50 border border-neutral-700/50" />
                    )}
                    <h3 className="text-base font-light text-neutral-200 leading-tight">{member.name}</h3>
                    {member.credentials && <p className="text-xs text-neutral-400 mt-0.5">{member.credentials}</p>}
                    {member.role && <p className="text-xs text-neutral-500 mt-1">{member.role}</p>}
                    {member.title && <p className="text-xs text-neutral-500">{member.title}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-14 max-w-3xl mx-auto text-center">
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  Advisory board includes researchers from Stanford Medicine, Weill Cornell Medicine, and the
                  Jacobs Technion-Cornell Institute.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("openContactForm"))}
                className="px-8 py-3 rounded-full text-white text-sm font-normal transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #2563eb)",
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.25)",
                }}
              >
                Get in Touch
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default About;
