import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

export const Help = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              AI Assistant
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Your intelligent guide powered by Anthropic
            </p>
          </div>

          {/* AI Chat Interface Placeholder */}
          <div 
            className="rounded-3xl p-12 mb-12 max-w-4xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-light text-white mb-4">
                Ask Me Anything
              </h2>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
                Get instant answers about NeuroTunes products, pricing, clinical applications, and more. 
                Our AI assistant is trained to help with all your questions.
              </p>
              
              {/* Chat input */}
              <div 
                className="rounded-full px-6 py-4 flex items-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <input 
                  type="text"
                  placeholder="Type your question here..."
                  className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* What I Can Help With */}
          <div className="mb-20">
            <h3 className="text-3xl font-light text-white text-center mb-12">
              What I Can Help With
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                "Product recommendations and features",
                "Pricing and subscription details",
                "Clinical applications and research",
                "Technical integration support",
                "Account and billing questions",
                "Implementation guidance"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p className="text-neutral-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div>
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
