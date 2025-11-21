import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";

export const Story = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Our Story
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              From neuroscience research to transforming global wellbeing
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12 text-neutral-400 leading-relaxed">
            
            <section>
              <h2 className="text-3xl font-light text-white mb-6">The Beginning</h2>
              <p className="mb-4">
                NeuroTunes was born from a simple observation: music profoundly affects our brains, yet most therapeutic audio 
                solutions were created without rigorous scientific validation.
              </p>
              <p>
                Founded by a team of neuroscientists, physicians, AI engineers, and professional music artists, we set out to bridge the gap 
                between cutting-edge neuroscience and accessible therapeutic audio.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">The Science</h2>
              <p className="mb-4">
                Working with leading research institutions including Stanford Medicine, Weill Cornell Medicine, and the 
                Jacobs Technion-Cornell Institute, we developed a comprehensive framework of 110 validated biomarkers.
              </p>
              <p>
                Each piece of music in our library is engineered using these biomarkers to support specific cognitive 
                and emotional states—from reducing anxiety to enhancing focus.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">The Impact</h2>
              <p className="mb-4">
                Today, NeuroTunes serves over 200 healthcare facilities, enterprises, and wellness organizations worldwide. 
                Our platform has delivered more than 1 million therapeutic sessions, helping people manage stress, improve 
                sleep, enhance cognitive performance, and support mental health recovery.
              </p>
              <p>
                Clinical studies show 30-45% reduction in anxiety symptoms and measurable improvements in focus and sleep 
                quality among our users.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">The Future</h2>
              <p>
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
  );
};

export default Story;
