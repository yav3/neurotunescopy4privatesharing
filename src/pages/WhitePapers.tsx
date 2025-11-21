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
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              White Papers & Research
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Scientific foundations of therapeutic audio technology
            </p>
          </div>

          {/* Papers List */}
          <div className="space-y-6">
            {papers.map((paper, index) => (
              <div 
                key={index}
                className="rounded-3xl p-8 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 text-xs rounded-full" style={{
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#06b6d4',
                        border: '1px solid rgba(6, 182, 212, 0.30)'
                      }}>
                        {paper.category}
                      </span>
                      <span className="text-sm text-neutral-500">{paper.pages}</span>
                    </div>
                    
                    <h3 className="text-2xl font-light text-white mb-2">{paper.title}</h3>
                    <p className="text-sm text-neutral-400 mb-3">{paper.authors} • {paper.date}</p>
                    <p className="text-neutral-400 leading-relaxed">{paper.description}</p>
                  </div>
                  
                  <button 
                    className="px-6 py-3 rounded-full flex items-center gap-2 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      color: 'white'
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div 
              className="rounded-3xl p-12 inline-block"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Request Custom Research Reports
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl">
                Need specific data or custom analysis for your organization?
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                Contact Research Team
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhitePapers;
