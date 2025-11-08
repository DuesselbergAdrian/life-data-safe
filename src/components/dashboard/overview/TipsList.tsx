import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface TipsListProps {
  tips: string[];
}

export const TipsList = ({ tips }: TipsListProps) => {
  if (tips.length === 0) return null;

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recommendations</h3>
        </div>
        
        <ul className="space-y-3">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
              <span className="text-primary font-semibold flex-shrink-0">{idx + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
