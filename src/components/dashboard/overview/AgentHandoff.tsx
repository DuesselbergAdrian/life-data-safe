import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export const AgentHandoff = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 1000);

    const stepTimer = setTimeout(() => setStep(2), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(stepTimer);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="glass p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {step === 1 ? 'Analyzing signals from your glasses...' : 'Building your day...'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {step === 1 
                ? 'Extracting activities, posture, and context' 
                : 'Analysis complete'}
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Model pass {step}/2</span>
              <span>{Math.floor(progress / 10)}s</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
