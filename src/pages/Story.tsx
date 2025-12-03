import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Story = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8" style={{ color: '#e4e4e4' }}>
              What is NeuroTunes?
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Premium AI-guided environmental music streaming delivered as an app for desktop and native download. 
              NeuroTunes enables seamless control of numerous administrative accounts across a customizable, 
              scalable number of locations and set-ups.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-16" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
            
            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Discover Neuralpositive</h2>
              <p className="mb-5 leading-relaxed">
                Each room an administrative user controls is designed to enhance the experience of those in the space. 
                Continuous play with advanced schedule programming enables the delivery of music sessions that meet 
                the specific needs of spaces, taking environmental factors, staff and faculty needs, community health, 
                and visitor comfort into consideration.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>The Science &amp; Medicine</h2>
              <p className="mb-5 leading-relaxed">
                Our streaming service is a patented, evidence-based, and clinically-validated system that uses core 
                principles from music therapy, music cognition, and neuropsychiatry.
              </p>
              <p className="mb-5 leading-relaxed">
                Our music has all been purpose-composed using specific musical patterns, frequencies, audio settings, 
                and beats to support anxiety reduction and cognitive clarity.
              </p>
              <p className="leading-relaxed">
                Our machine learning and AI technology pre-programs ideal music streaming playlists for specific times 
                of day and community needs. Administrative users can add notes and teach the playlists to improve through 
                favoriting and skipping specific songs—ensuring that the right music plays at the right time and in the 
                right place.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Evidence-Based Principles</h2>
              <p className="mb-5 leading-relaxed">
                Grounded in research: Protocol design informed by 15,000+ publications across music therapy, music cognition, 
                AI, machine learning, neuropsychiatry, neurology, and neuroscience.
              </p>
              <p className="leading-relaxed">
                Informed by the principles of music therapy—a field with decades of documented best practices—made scalable 
                and on-demand through our streaming service, providing a powerful adjunct to existing support services whilst 
                delivering benefit for members, visitors, patients, staff, faculty, and employees.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Real-World Evidence</h2>
              <p className="mb-5 leading-relaxed">
                Prospective pilots in leading care environments including Weill Cornell. Retrospective analyses across 
                approximately 14,000 patient records inform predictive models for "right music, right moment" matching.
              </p>
              <p className="leading-relaxed">
                Clinical results demonstrate meaningful reductions in anxiety and improved resilience following guided sessions. 
                Results presented at the American Academy of Neurology (AAN) 2024 annual meeting.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Safety Profile</h2>
              <p className="mb-5 leading-relaxed">
                No adverse events reported to date or across any of the studies. Safe at moderate room volume in all 
                available modes for group and common-space use.
              </p>
              <p className="leading-relaxed">
                Playlists avoid sudden dynamic shifts and provide easy pause/stop access.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Acoustic Features</h2>
              <p className="leading-relaxed">
                Each administrative user has access to pre-prepared room-specific sessions designed for high and low traffic 
                times with appropriate tempo ranges, rhythm, spectral balance, harmonic stability, and dynamic range. 
                Calmer timbre and harmonics for dining areas and high-traffic periods when visitors, members, and patients 
                need to attenuate stress. Steady mid-tempo music for focus in physical therapy rooms and lower traffic 
                periods during administrative work or shift changes.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Administrative Workflow</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-cyan-400 font-light">01</span>
                  <p className="leading-relaxed">Select mode: Calm / Anxiety / Mood / Pain / Focus / Sleep</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-cyan-400 font-light">02</span>
                  <p className="leading-relaxed">Run session: Hands-off once started</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-cyan-400 font-light">03</span>
                  <p className="leading-relaxed">Closed-loop update: System adapts next session automatically</p>
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
