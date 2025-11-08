import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Recommendation } from "@/lib/benchmarks";

interface TipsListProps {
  tips: Recommendation[];
}

export const TipsList = ({ tips }: TipsListProps) => {
  if (tips.length === 0) return null;

  return (
    <Card className="glass p-8 border-2">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">Your Recommendations</h3>
        </div>
        
        <div className="space-y-5">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm group-hover:bg-primary/20 transition-colors">
                {idx + 1}
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="font-medium text-base leading-snug">{tip.action}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
