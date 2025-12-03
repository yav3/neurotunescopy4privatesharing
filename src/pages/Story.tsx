import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Story = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <div className="relative z-10">
        <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8" style={{ color: '#e4e4e4' }}>
              What is NeuroTunes?
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              NeuroTunes is a therapeutic audio platform that harnesses the power of neuroscience and AI to deliver 
              clinically-validated music experiences. Whether you're looking to reduce anxiety, improve focus, or enhance 
              relaxation, our platform adapts to your unique needs—streaming personalized therapeutic audio directly to 
              your workspace, clinic, or home.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-16" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
            
            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>Discover Neuralpositive</h2>
              <p className="mb-5 leading-relaxed">
                NeuroTunes was born from a simple observation: music profoundly affects our brains, yet most therapeutic audio 
                solutions were created without rigorous scientific validation.
              </p>
              <p className="leading-relaxed">
                Founded by a team of neuroscientists, physicians, AI engineers, and professional music artists, we set out to bridge the gap 
                between cutting-edge neuroscience and accessible therapeutic audio.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>The Science</h2>
              <p className="leading-relaxed">
                Working with leading research institutions including Stanford Medicine, Weill Cornell Medicine, and the 
                Jacobs Technion-Cornell Institute, we continue to advance the science of therapeutic audio.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#e4e4e4' }}>The Future</h2>
              <p className="leading-relaxed">
                We're just getting started. Our vision is to make scientifically-validated therapeutic audio accessible 
                to everyone, everywhere—from hospitals and clinics to homes and workplaces. Through continued research, 
                innovation, and partnerships, we're building the future of audio-based therapy.
              </p>
            </section>

          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Story;
