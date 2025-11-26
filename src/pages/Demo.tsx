import { Footer } from "@/components/Footer";
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Link } from "react-router-dom";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

const Demo = () => {
  const background = usePageBackground();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PageBackgroundMedia 
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      
      {/* Background Effects - Mobile optimized */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20 sm:opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(228, 228, 228, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(228, 228, 228, 0.06) 0%, transparent 50%)',
          }}
        />
        {/* Edge lighting gradient for better mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 sm:from-black/20 sm:via-transparent sm:to-black/10" />
      </div>

      <NavigationHeader />
      
      {/* Hero Section - Mobile-first responsive */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-32 pb-16 sm:pb-20 min-h-[calc(100vh-80px)] flex items-center">
        <div 
          className="w-full max-w-5xl mx-auto backdrop-blur-3xl rounded-2xl sm:rounded-3xl md:rounded-[40px] p-8 sm:p-12 md:p-16 lg:p-20 border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.10)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="text-center space-y-8 sm:space-y-10 md:space-y-12">
            <h1 
              className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[80px] font-light leading-[1.1] tracking-tight"
              style={{ color: 'rgba(228, 228, 228, 0.95)' }}
            >
              Experience NeuroTunes
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-[26px] font-light max-w-3xl mx-auto leading-[1.6] sm:leading-relaxed px-2"
              style={{ color: 'rgba(228, 228, 228, 0.70)' }}
            >
              Our original music catalog includes more than 8,000 songs in 8 languages for 20 environmental and therapeutic uses, spanning across 50 genres. Listen now or request a demo of the enterprise or patient-facing products.
            </p>

            {/* CTA Buttons - Glassmorphic mobile-first */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 sm:pt-6 max-w-lg mx-auto">
              <Link to="/consumer-pricing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl text-base sm:text-sm font-medium transition-all bg-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(255,255,255,0.1)_inset,0_4px_20px_rgba(0,0,0,0.3)] border border-white/20 text-platinum-glow/95 hover:bg-white/[0.15] hover:border-white/30 hover:shadow-[0_0_35px_rgba(255,255,255,0.15)_inset,0_6px_25px_rgba(0,0,0,0.4)] hover:scale-[1.02]">
                  Listen Now
                </button>
              </Link>
              <button 
                onClick={() => window.location.href = 'mailto:sales@neuralpositive.com'}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl text-base sm:text-sm font-medium transition-all bg-white/[0.05] backdrop-blur-xl border border-white/15 text-platinum-glow/85 hover:bg-white/10 hover:border-white/25 hover:text-platinum-glow/95 hover:scale-[1.02]"
              >
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
