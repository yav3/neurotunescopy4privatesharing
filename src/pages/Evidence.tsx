import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { CheckCircle2, BookOpen, FlaskConical } from "lucide-react";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

export const Evidence = () => {
  const background = usePageBackground();

  const outcomes = [
    {
      stat: "30-45%",
      label: "Anxiety Reduction",
      detail: "Clinically measured reduction in anxiety symptoms after 8 weeks"
    },
    {
      stat: "200+",
      label: "Healthcare Facilities",
      detail: "Hospitals, clinics, and care centers using NeuroTunes"
    },
    {
      stat: "110",
      label: "Validated Biomarkers",
      detail: "Neurological and psychological markers integrated"
    },
    {
      stat: "1M+",
      label: "Therapeutic Sessions",
      detail: "Documented sessions delivered globally"
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

  const journalReferences = [
    {
      title: "Advancing Personalized Digital Therapeutics: Music Therapy, Brainwave Entrainment, and AI Biofeedback",
      journal: "Frontiers in Digital Health, 2025",
      finding: "Framework for AI-driven personalized music interventions with gamma frequency entrainment"
    },
    {
      title: "Music Supercharges Brain Stimulation",
      journal: "Stanford Neuroscience, 2025",
      finding: "Syncing stimulation to musical rhythms significantly amplifies neural effects"
    },
    {
      title: "Music-Based Neurofeedback for Therapeutic Applications",
      journal: "Frontiers in Neuroscience, 2025",
      finding: "Real-time neural entrainment through adaptive music feedback loops"
    },
    {
      title: "The Transformative Power of Music on Brain Function",
      journal: "PMC / National Library of Medicine, 2024",
      finding: "Music is one of the only stimuli that activates the entire brain simultaneously"
    },
    {
      title: "Your Brain on Music",
      journal: "Bryant University Neuroscience, 2024",
      finding: "Only social interaction rivals music in whole-brain activation"
    }
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <PageBackgroundMedia
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      <div className="relative z-10">
        <NavigationHeader />

        <main className="pt-32 pb-28">
          <div className="max-w-5xl mx-auto px-6">

            {/* Header */}
            <div className="text-center mb-20">
              <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-white mb-4">
                Clinical Evidence
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
                Peer-reviewed research and clinical outcomes backing every NeuroTunes intervention
              </p>
            </div>

            {/* Outcome stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
              {outcomes.map((o) => (
                <div
                  key={o.label}
                  className="text-center p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-3xl sm:text-4xl font-light text-white mb-2">{o.stat}</div>
                  <div className="text-sm font-medium text-white/80 mb-1">{o.label}</div>
                  <div className="text-xs text-white/50 font-light">{o.detail}</div>
                </div>
              ))}
            </div>

            {/* Clinical studies */}
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-8">
                <FlaskConical className="w-5 h-5 text-white/60" />
                <h2 className="text-2xl font-light text-white">Clinical Studies</h2>
              </div>
              <div className="space-y-4">
                {studies.map((s) => (
                  <div
                    key={s.title}
                    className="p-6 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <h3 className="text-base font-medium text-white mb-2">{s.title}</h3>
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-white/80 font-light">{s.finding}</p>
                    </div>
                    <p className="text-xs text-white/40 font-light">{s.methodology}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal references */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-5 h-5 text-white/60" />
                <h2 className="text-2xl font-light text-white">Supporting Research</h2>
              </div>
              <div className="space-y-3">
                {journalReferences.map((ref) => (
                  <div
                    key={ref.title}
                    className="p-5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <h3 className="text-sm font-medium text-white/90 mb-1">{ref.title}</h3>
                    <p className="text-xs text-cyan-400/80 mb-1">{ref.journal}</p>
                    <p className="text-xs text-white/50 font-light">{ref.finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
                className="px-8 py-3 rounded-full text-white text-sm font-normal transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
                }}
              >
                Request Access
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Evidence;
