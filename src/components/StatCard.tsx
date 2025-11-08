import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  delta?: number;
  sparklineData?: number[];
  className?: string;
}

export const StatCard = ({ title, value, unit, delta, sparklineData, className }: StatCardProps) => {
  const isPositive = delta && delta > 0;
  
  return (
    <Card className={cn("p-4 hover:shadow-card transition-all", className)}>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        
        {delta !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(delta)}% vs yesterday</span>
          </div>
        )}
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-8 flex items-end gap-0.5">
            {sparklineData.map((point, idx) => (
              <div
                key={idx}
                className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40"
                style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
