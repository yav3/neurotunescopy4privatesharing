import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import HuggingFaceClassifier from "@/components/HuggingFaceClassifier";

const MoodAnalyzerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* AI Mood Analyzer Section */}
      <section className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">AI Mood Analyzer</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let our AI analyze your text to understand your current mood and recommend the perfect music to match or enhance your emotional state.
            </p>
          </div>
          <HuggingFaceClassifier />
        </div>
      </section>
      
      <Navigation activeTab="mood-analyzer" />
    </div>
  );
};

export default MoodAnalyzerPage;