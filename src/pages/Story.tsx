import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Story = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
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
            <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>The Team</h2>
            
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
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
                    7,000+ purpose-composed tracks with indication-specific dosing algorithms for anxiety and pain. 
                    Fully owned IP—no royalties, predictable lower cost, and no licensing risk.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Evidence at a Glance</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>Insights from 15,000+ peer-reviewed neuroscience &amp; music-therapy articles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>8+ years R&amp;D at Columbia / Cornell Tech; pilot/UX studies show pre/post anxiety reductions (p&lt;.05)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                    <span>14k+ subjects (biobank AI analysis): reproduced pre-specified symptom–response patterns across indications</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Patient Journey */}
            <section>
              <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>Patient Journey</h2>
              
              <div className="space-y-6">
                {/* Waiting Room */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>Pre-Procedure</span>
                    <h3 className="text-lg font-light" style={{ color: '#e4e4e4' }}>Waiting Room</h3>
                  </div>
                  <p className="leading-relaxed text-sm mb-4">
                    Patient scans a QR code → 60-second intake (choose goal and preferred genre) → 10–15 minute sessions 
                    while waiting. Each session is newly generated from the catalog (no repeats).
                  </p>
                  <div className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    <span className="font-light">Benefits:</span> Patient arrives calmer; lower perceived pain and tension; smoother flow; higher experience scores.
                  </div>
                </div>

                {/* During Procedure */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>During Treatment</span>
                    <h3 className="text-lg font-light" style={{ color: '#e4e4e4' }}>Infusion / ED / Exam Room</h3>
                  </div>
                  <p className="leading-relaxed text-sm mb-4">
                    Patient scans QR → selects goal and genre → 15–30 minute sessions during treatment or observation. 
                    Each session is newly generated.
                  </p>
                  <div className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    <span className="font-light">Benefits:</span> Reduced anxiety and pain; potential reduction in sedatives and analgesics; higher satisfaction.
                  </div>
                </div>

                {/* Take-Home */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'rgba(6, 182, 212, 0.9)' }}>Post-Visit</span>
                    <h3 className="text-lg font-light" style={{ color: '#e4e4e4' }}>Take-Home</h3>
                  </div>
                  <p className="leading-relaxed text-sm mb-4">
                    Patient leaves with a link; short sessions at home for 7–14 days. Each session newly generated.
                  </p>
                  <div className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    <span className="font-light">Benefits:</span> Simple routine to stay calm between visits; consistent experience beyond the hospital.
                  </div>
                </div>
              </div>
            </section>

            {/* Clinical Pilots */}
            <section>
              <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>Clinical Pilot Options</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Oncology */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'rgba(168, 85, 247, 0.9)' }}>Pilot A</span>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#e4e4e4' }}>Oncology</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>Infusion &amp; RT Support</p>
                  <p className="leading-relaxed text-sm mb-4">
                    20–30 min during infusion; 10–15 min pre-RT or during setup; optional at-home after visit.
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    Goal: Calmer treatments; ease anxiety &amp; pain.
                  </p>
                </div>

                {/* Emergency */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'rgba(239, 68, 68, 0.9)' }}>Pilot B</span>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#e4e4e4' }}>Emergency</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>Triage / Observation</p>
                  <p className="leading-relaxed text-sm mb-4">
                    10–20 min sessions while awaiting labs/re-evaluation. Typical ESI 3–5 patients.
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    Goal: Fast relief during the wait; ease anxiety &amp; pain.
                  </p>
                </div>

                {/* Executive */}
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'rgba(34, 197, 94, 0.9)' }}>Pilot C</span>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#e4e4e4' }}>Executive Check-Up</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>Concierge</p>
                  <p className="leading-relaxed text-sm mb-4">
                    8–10 min in-suite demo; 14–30 days at home. Peak-performance &amp; resilience playlists.
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                    Goal: Reduce anxiety &amp; stress; support calm/focus.
                  </p>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Success Metrics (Any Two Met → Scale)</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Anxiety VAS</span>
                    <p className="mt-1">≥ 25–30% mean reduction</p>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Pain NRS</span>
                    <p className="mt-1">−1.0 or better</p>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Experience</span>
                    <p className="mt-1">NPS +10 points</p>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(6, 182, 212, 0.9)' }}>Operations</span>
                    <p className="mt-1">↓ medication use, ↓ LOS</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Integration & Privacy */}
            <section>
              <h2 className="text-3xl font-light mb-8" style={{ color: '#e4e4e4' }}>Integration &amp; Privacy</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Low-Lift Integration</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>Distribution via QR posters/cards and deep links</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>Secure web dashboard for clinician view</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>De-identified CSV/FHIR data exports for research/quality teams</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl" style={{ background: 'rgba(228, 228, 228, 0.03)', border: '1px solid rgba(228, 228, 228, 0.08)' }}>
                  <h3 className="text-lg font-light mb-4" style={{ color: '#e4e4e4' }}>Security &amp; Privacy</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>No PII collected in sessions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>Tokenized access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: 'rgba(6, 182, 212, 0.8)' }}>•</span>
                      <span>Encryption in transit and at rest (LGPD-aligned)</span>
                    </li>
                  </ul>
                </div>
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
