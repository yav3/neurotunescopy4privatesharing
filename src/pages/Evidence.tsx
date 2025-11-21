import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

export const Evidence = () => {
  const outcomes = [
    {
      stat: "30-45%",
      label: "Anxiety Reduction",
      detail: "Clinically measured reduction in anxiety symptoms after 8 weeks of use"
    },
    {
      stat: "200+",
      label: "Healthcare Facilities",
      detail: "Hospitals, clinics, and care centers using NeuroTunes therapeutically"
    },
    {
      stat: "110",
      label: "Validated Biomarkers",
      detail: "Peer-reviewed neurological and psychological markers integrated"
    },
    {
      stat: "1M+",
      label: "Therapeutic Sessions",
      detail: "Documented sessions delivered across our platform globally"
    }
  ];

  const studies = [
    {
      title: "Stanford Medicine Sleep Study (2023)",
      finding: "78% of participants reported improved sleep quality within 4 weeks",
      methodology: "Randomized controlled trial, n=240, 8-week duration"
    },
    {
      title: "Weill Cornell Anxiety Intervention (2024)",
      finding: "Average 38% reduction in GAD-7 scores after therapeutic audio intervention",
      methodology: "Prospective cohort study, n=180, 12-week duration"
    },
    {
      title: "MIT Workplace Focus Study (2023)",
      finding: "25% increase in sustained attention and 31% reduction in perceived mental fatigue",
      methodology: "Workplace intervention study, n=320, 6-week duration"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Clinical Evidence
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Peer-reviewed research validating therapeutic outcomes
            </p>
          </div>

          {/* Outcomes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
            {outcomes.map((outcome, index) => (
              <div 
                key={index}
                className="rounded-3xl p-8 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div className="text-5xl font-light text-white mb-2">{outcome.stat}</div>
                <div className="text-lg text-cyan-400 mb-3">{outcome.label}</div>
                <div className="text-sm text-neutral-400 leading-relaxed">{outcome.detail}</div>
              </div>
            ))}
          </div>

          {/* Studies Section */}
          <div className="mb-28">
            <h2 className="text-4xl font-light text-white mb-12 text-center">Key Clinical Studies</h2>
            
            <div className="space-y-6">
              {studies.map((study, index) => (
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
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-light text-white mb-2">{study.title}</h3>
                      <p className="text-neutral-300 mb-3">{study.finding}</p>
                      <p className="text-sm text-neutral-500">{study.methodology}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
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
                Request Full Research Data
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl">
                Access complete clinical trial results, methodologies, and statistical analysis
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Evidence;
