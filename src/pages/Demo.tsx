import { Footer } from "@/components/Footer";
import { NavigationHeader } from '@/components/navigation/NavigationHeader';

const Demo = () => {

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(228, 228, 228, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(228, 228, 228, 0.06) 0%, transparent 50%)',
          }}
        />
      </div>

      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-32 pb-20 min-h-[calc(100vh-80px)] flex items-center">
        <div 
          className="max-w-5xl mx-auto backdrop-blur-3xl rounded-[40px] p-16 md:p-20 border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.10)',
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="text-center">
            <h1 
              className="text-[48px] md:text-[64px] lg:text-[80px] font-light leading-[1.1] mb-10"
              style={{ color: 'rgba(228, 228, 228, 0.95)' }}
            >
              Experience NeuroTunes
            </h1>
            <p 
              className="text-[18px] md:text-[22px] lg:text-[26px] font-extralight max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'rgba(228, 228, 228, 0.70)' }}
            >
              Our original music catalog includes more than 8,000 songs in 8 languages for 20 environmental and therapeutic uses, spanning across 50 genres. Listen now or request a demo of the enterprise or patient-facing products.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
