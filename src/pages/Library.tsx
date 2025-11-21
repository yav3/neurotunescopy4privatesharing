import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Play } from "lucide-react";

export const Library = () => {
  const categories = [
    {
      name: "Focus & Productivity",
      count: "1,200+ tracks",
      color: "#06b6d4",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      name: "Anxiety & Stress Relief",
      count: "980+ tracks",
      color: "#8b5cf6",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Sleep & Recovery",
      count: "850+ tracks",
      color: "#3b82f6",
      image: "https://images.unsplash.com/photo-1541480551145-2370a440d585?w=400&h=400&fit=crop"
    },
    {
      name: "Meditation & Mindfulness",
      count: "720+ tracks",
      color: "#10b981",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop"
    },
    {
      name: "Pain Management",
      count: "650+ tracks",
      color: "#f59e0b",
      image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=400&h=400&fit=crop"
    },
    {
      name: "Mood Enhancement",
      count: "890+ tracks",
      color: "#ec4899",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Playlist Library
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              8,500+ therapeutic tracks scientifically designed for wellbeing
            </p>
          </div>

          {/* Stats Bar */}
          <div 
            className="rounded-3xl p-8 mb-20"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(255, 255, 255, 0.10)' }}>
              <div className="text-center">
                <div className="text-4xl font-light text-white mb-2">8,500+</div>
                <div className="text-sm text-neutral-400">Total Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light text-white mb-2">50+</div>
                <div className="text-sm text-neutral-400">Therapeutic Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light text-white mb-2">110</div>
                <div className="text-sm text-neutral-400">Validated Biomarkers</div>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <button
                key={index}
                className="group rounded-3xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 0%, ${category.color}40 100%)`
                    }}
                  />
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: category.color }}
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-neutral-400">{category.count}</p>
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-28 text-center">
            <div 
              className="rounded-3xl p-12 inline-block"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Enterprise Access
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl">
                Get unlimited access to our entire library for your organization
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                Request Enterprise Demo
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
