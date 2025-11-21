import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Smartphone, Monitor, Download as DownloadIcon } from "lucide-react";

export const Download = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Download NeuroTunes
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Access therapeutic audio on all your devices
            </p>
          </div>

          {/* Platform Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-28">
            
            {/* Web App */}
            <div 
              className="rounded-3xl p-8 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(6, 182, 212, 0.15)' }}
              >
                <Monitor className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3">Web App</h3>
              <p className="text-neutral-400 mb-6">
                Access from any browser, no installation required
              </p>
              <button 
                className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                Launch Web App
              </button>
            </div>

            {/* Android */}
            <div 
              className="rounded-3xl p-8 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(16, 185, 129, 0.15)' }}
              >
                <Smartphone className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3">Android App</h3>
              <p className="text-neutral-400 mb-6">
                Download from Google Play Store
              </p>
              <button 
                className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: 'white'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  <span>Get on Android</span>
                </div>
              </button>
            </div>

            {/* iOS */}
            <div 
              className="rounded-3xl p-8 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(139, 92, 246, 0.15)' }}
              >
                <Smartphone className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3">iOS App</h3>
              <p className="text-neutral-400 mb-6">
                Download from Apple App Store
              </p>
              <button 
                className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: 'white'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  <span>Get on iOS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Features List */}
          <div 
            className="rounded-3xl p-12"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 className="text-2xl font-light text-white mb-8 text-center">
              All Platforms Include
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-neutral-400">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>8,500+ scientifically-validated therapeutic tracks</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Personalized session recommendations</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Offline playback capability</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Progress tracking and analytics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Sync across all devices</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Spatial audio support (where available)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Download;
