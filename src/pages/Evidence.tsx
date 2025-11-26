import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

export const Evidence = () => {
  const background = usePageBackground();
  
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
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <PageBackgroundMedia 
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <h1 className="text-6xl font-light tracking-tight text-white">
              Site In Progress
            </h1>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Evidence;
