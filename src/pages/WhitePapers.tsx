import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Download } from "lucide-react";

export const WhitePapers = () => {
  const papers = [
    {
      title: "Biomarker-Driven Therapeutic Audio: A Framework for Evidence-Based Music Therapy",
      authors: "Chen, S., Torres, M., Park, J.",
      date: "2024",
      category: "Clinical Research",
      pages: "42 pages",
      description: "Comprehensive overview of our 110-biomarker framework and validation methodology."
    },
    {
      title: "Anxiety Reduction Through Structured Audio Interventions",
      authors: "Park, J., Chen, S.",
      date: "2023",
      category: "Mental Health",
      pages: "28 pages",
      description: "Clinical trial results showing 30-45% anxiety reduction in controlled studies."
    },
    {
      title: "Cognitive Enhancement via Therapeutic Soundscapes",
      authors: "Torres, M., Rodriguez, E.",
      date: "2023",
      category: "Cognitive Performance",
      pages: "35 pages",
      description: "Analysis of focus and productivity improvements in workplace environments."
    },
    {
      title: "Sleep Quality Optimization Using Audio Therapy",
      authors: "Chen, S., Park, J., Torres, M.",
      date: "2024",
      category: "Sleep Medicine",
      pages: "31 pages",
      description: "Evidence-based protocols for improving sleep onset and quality through audio intervention."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <h1 className="text-6xl font-light tracking-tight text-white">
              Site In Progress
            </h1>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhitePapers;
