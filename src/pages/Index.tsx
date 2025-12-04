import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ContentCalendar from "@/components/ContentCalendar";
import TransformDemo from "@/components/TransformDemo";
import Footer from "@/components/Footer";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleDemoComplete = () => {
    setShowDemo(false);
    setShowCalendar(true);
    // Scroll to calendar after a brief delay
    setTimeout(() => {
      calendarRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero onStartDemo={handleStartDemo} />
        
        <Features />
        
        <div ref={calendarRef} id="demo">
          {showCalendar && <ContentCalendar />}
        </div>
        
        {!showCalendar && (
          <section className="py-20 px-4 text-center bg-gradient-to-b from-card/50 to-background">
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to see the magic?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Click "See the Magic" above to watch a 27-minute rant transform into a full week of content.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
      
      <TransformDemo 
        isActive={showDemo} 
        onComplete={handleDemoComplete} 
      />
    </div>
  );
};

export default Index;
