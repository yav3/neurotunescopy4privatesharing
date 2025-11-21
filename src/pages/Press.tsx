import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ExternalLink } from "lucide-react";

export const Press = () => {
  const articles = [
    {
      outlet: "Nature Medicine",
      title: "Therapeutic Audio Shows Promise in Anxiety Treatment",
      date: "March 2024",
      url: "#"
    },
    {
      outlet: "JAMA Psychiatry",
      title: "Non-Pharmacological Interventions: The Role of Music Therapy",
      date: "February 2024",
      url: "#"
    },
    {
      outlet: "TechCrunch",
      title: "NeuroTunes Raises Series B to Scale Therapeutic Audio Platform",
      date: "January 2024",
      url: "#"
    },
    {
      outlet: "Healthcare IT News",
      title: "200+ Hospitals Now Using AI-Driven Music Therapy",
      date: "December 2023",
      url: "#"
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
              Press & Media
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              NeuroTunes in the news
            </p>
          </div>

          {/* Press Articles */}
          <div className="space-y-6 mb-28">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl p-8 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm text-cyan-400 mb-2">{article.outlet}</p>
                    <h3 className="text-2xl font-light text-white mb-2">{article.title}</h3>
                    <p className="text-sm text-neutral-500">{article.date}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>

          {/* Media Kit CTA */}
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
                Media Inquiries
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl">
                For press inquiries, interviews, or to request our media kit
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: 'white'
                }}
              >
                Contact Press Team
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Press;
