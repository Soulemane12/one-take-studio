import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { AudioAnalyzer, type AnalysisResult } from "@/components/AudioAnalyzer";
import TransformDemo from "@/components/TransformDemo";
import Footer from "@/components/Footer";

type View = 'landing' | 'upload' | 'results';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [showDemo, setShowDemo] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  const handleStartDemo = () => {
    setCurrentView('upload');
  };

  const handleDemoComplete = () => {
    setShowDemo(false);
    // Only change view if we have analysis data
    if (analysisData) {
      setCurrentView('results');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Landing View */}
      {currentView === 'landing' && (
        <main className="pt-16">
          <Hero onStartDemo={handleStartDemo} />
          <Features />
          <section className="py-20 px-4 text-center bg-gradient-to-b from-card/50 to-background">
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to see the magic?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Click "See the Magic" above to start your content creation journey.
              </p>
            </div>
          </section>
          <Footer />
        </main>
      )}

      {/* Upload View */}
      {currentView === 'upload' && (
        <AudioAnalyzer
          onShowDemo={() => setShowDemo(true)}
          onAnalysisComplete={(analysis) => {
            setAnalysisData(analysis);
            // If animation is already done, go to results immediately
            if (!showDemo) {
              setCurrentView('results');
            }
          }}
        />
      )}

      {/* Results View */}
      {currentView === 'results' && analysisData && (
        <main className="pt-16">
          <AudioAnalyzer
            initialAnalysis={analysisData}
            onBack={() => setCurrentView('upload')}
          />
          <Footer />
        </main>
      )}

      <TransformDemo
        isActive={showDemo}
        onComplete={handleDemoComplete}
      />
    </div>
  );
};

export default Index;
