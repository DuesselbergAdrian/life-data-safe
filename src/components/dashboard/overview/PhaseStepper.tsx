import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseStepperProps {
  currentPhase: 'sync' | 'analyzing' | 'overview';
}

const steps = [
  { key: 'sync', label: 'Sync' },
  { key: 'analyzing', label: 'Analyze' },
  { key: 'overview', label: 'Overview' },
] as const;

export const PhaseStepper = ({ currentPhase }: PhaseStepperProps) => {
  const currentIndex = steps.findIndex(s => s.key === currentPhase);

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {steps.map((step, idx) => {
        const isComplete = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 transition-all duration-150",
              isCurrent && "text-foreground",
              isComplete && "text-foreground/70",
              !isCurrent && !isComplete && "text-foreground/50"
            )}>
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-xs transition-all duration-150",
                isCurrent && "bg-primary text-primary-foreground",
                isComplete && "bg-health-good text-white",
                !isCurrent && !isComplete && "bg-muted"
              )}>
                {isComplete ? <Check className="h-3 w-3" /> : idx + 1}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "h-px w-8 transition-all duration-150",
                idx < currentIndex ? "bg-health-good" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};
