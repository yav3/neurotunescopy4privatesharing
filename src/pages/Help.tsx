import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { BookOpen, Stethoscope, Settings, MessageCircle } from "lucide-react";

export const Help = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "General Help",
      description: "Get started, learn features, and find answers to common questions",
      link: "/help/faq",
      color: "#06b6d4"
    },
    {
      icon: Stethoscope,
      title: "Clinical Support",
      description: "Resources for healthcare providers and therapists",
      link: "/help/clinical",
      color: "#8b5cf6"
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "Troubleshooting, integrations, and technical documentation",
      link: "/help/technical",
      color: "#10b981"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Reach out to our team for personalized assistance",
      link: "/support",
      color: "#f59e0b"
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
              Help Center
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Find answers and get the support you need
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-20">
            <div 
              className="rounded-full px-6 py-4 flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
              }}
            >
              <input 
                type="text"
                placeholder="Search for help..."
                className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none"
              />
            </div>
          </div>

          {/* Support Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Link
                  key={index}
                  to={section.link}
                  className="group rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                    style={{ 
                      background: `${section.color}20`,
                      border: `1px solid ${section.color}40`
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: section.color }} />
                  </div>
                  <h3 className="text-2xl font-light text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {section.description}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Emergency Contact */}
          <div className="mt-20">
            <div 
              className="rounded-3xl p-12 text-center"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(239, 68, 68, 0.30)',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.15)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
                For urgent technical issues affecting patient care or critical system downtime
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.30)',
                  color: '#fca5a5'
                }}
              >
                Emergency Support: Available 24/7
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
