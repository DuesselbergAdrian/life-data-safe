import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BenchmarkResult } from "@/lib/benchmarks";

interface BenchmarkedMetricCardProps {
  title: string;
  value: string;
  unit?: string;
  delta?: number;
  sparkline?: number[];
  benchmark: BenchmarkResult;
  icon?: React.ReactNode;
}

export const BenchmarkedMetricCard = ({ 
  title, 
  value, 
  unit, 
  delta, 
  sparkline,
  benchmark,
  icon 
}: BenchmarkedMetricCardProps) => {
  const isPositive = delta && delta > 0;
  
  const benchmarkColor = {
    Good: 'bg-health-good/10 text-health-good border-health-good/20',
    Medium: 'bg-health-medium/10 text-health-medium border-health-medium/20',
    Bad: 'bg-health-bad/10 text-health-bad border-health-bad/20',
  }[benchmark.label];

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>

        {delta !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isPositive ? "text-health-good" : "text-health-bad"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(delta)}% vs yesterday</span>
          </div>
        )}

        <Badge variant="outline" className={cn("text-xs font-medium", benchmarkColor)}>
          {benchmark.label} • {benchmark.context}
        </Badge>

        {sparkline && sparkline.length > 0 && (
          <div className="h-8 flex items-end gap-0.5">
            {sparkline.map((point, idx) => (
              <div
                key={idx}
                className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                style={{ height: `${(point / Math.max(...sparkline)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
