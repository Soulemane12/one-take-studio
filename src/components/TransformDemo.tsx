import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Sparkles, Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransformDemoProps {
  isActive: boolean;
  onComplete: () => void;
}

const steps = [
  { label: "Analyzing audio...", icon: Mic, duration: 800 },
  { label: "Detecting themes & hooks...", icon: Sparkles, duration: 1000 },
  { label: "Generating TikTok scripts...", icon: Wand2, duration: 600 },
  { label: "Creating Twitter threads...", icon: Wand2, duration: 500 },
  { label: "Writing LinkedIn posts...", icon: Wand2, duration: 400 },
  { label: "Crafting newsletter...", icon: Wand2, duration: 400 },
  { label: "Building content calendar...", icon: Check, duration: 300 },
];

const TransformDemo = ({ isActive, onComplete }: TransformDemoProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= steps.length) {
        setTimeout(onComplete, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const step = steps[stepIndex];
      
      // Animate progress for this step
      const progressStart = (stepIndex / steps.length) * 100;
      const progressEnd = ((stepIndex + 1) / steps.length) * 100;
      const increment = (progressEnd - progressStart) / (step.duration / 50);
      
      let currentProgress = progressStart;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= progressEnd) {
          currentProgress = progressEnd;
          clearInterval(progressInterval);
        }
        setProgress(currentProgress);
      }, 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        stepIndex++;
        runStep();
      }, step.duration);
    };

    runStep();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const CurrentIcon = steps[currentStep]?.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 p-8 border-primary/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CurrentIcon className={cn(
              "w-8 h-8 text-primary",
              currentStep < steps.length - 1 && "animate-pulse"
            )} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Transforming Your Rant
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep]?.label || "Processing..."}
          </p>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
                index < currentStep && "bg-primary/5",
                index === currentStep && "bg-primary/10 border border-primary/30",
                index > currentStep && "opacity-40"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                index < currentStep && "bg-primary text-primary-foreground",
                index === currentStep && "bg-primary/20 text-primary border border-primary",
                index > currentStep && "bg-muted text-muted-foreground"
              )}>
                {index < currentStep ? <Check className="w-3 h-3" /> : index + 1}
              </div>
              <span className={cn(
                "text-sm",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TransformDemo;
