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
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5 space-y-4">
        {/* Header with Icon & Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
              {icon}
            </div>
            <p className="text-sm font-medium text-foreground/70">{title}</p>
          </div>
          
          {benchmark && (
            <Badge 
              className={cn(
                "text-xs font-semibold px-2.5 py-0.5",
                benchmark.label === 'Good' && "bg-health-good/15 text-health-good border-health-good/30",
                benchmark.label === 'Medium' && "bg-health-medium/15 text-health-medium border-health-medium/30",
                benchmark.label === 'Bad' && "bg-health-bad/15 text-health-bad border-health-bad/30"
              )}
            >
              {benchmark.label}
            </Badge>
          )}
        </div>

        {/* Value & Delta */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              {value}
            </span>
            {unit && <span className="text-base text-muted-foreground font-medium">{unit}</span>}
          </div>
          
          <div className="flex items-center justify-between">
            {delta !== undefined && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md",
                delta > 0 ? "bg-health-good/10 text-health-good" : "bg-health-bad/10 text-health-bad"
              )}>
                {delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{Math.abs(delta)}%</span>
              </div>
            )}
            
            {benchmark && (
              <p className="text-xs text-muted-foreground font-medium">
                {benchmark.context}
              </p>
            )}
          </div>
        </div>

        {/* Sparkline with trend indication */}
        {sparkline && sparkline.length > 0 && (
          <div className="space-y-1.5 pt-3 border-t border-border/50">
            <div className="flex items-end gap-1 h-12">
              {sparkline.map((point, idx) => {
                const height = (point / Math.max(...sparkline)) * 100;
                const isLast = idx === sparkline.length - 1;
                const prevPoint = idx > 0 ? sparkline[idx - 1] : point;
                const isImproving = point > prevPoint;
                const isWorsening = point < prevPoint;
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex-1 rounded-t-sm transition-all duration-200 relative",
                      isLast && "ring-2 ring-primary/60 ring-offset-1",
                      isImproving && !isLast && "bg-gradient-to-t from-health-good/40 to-health-good/20 hover:from-health-good/60 hover:to-health-good/30",
                      isWorsening && !isLast && "bg-gradient-to-t from-health-bad/40 to-health-bad/20 hover:from-health-bad/60 hover:to-health-bad/30",
                      !isImproving && !isWorsening && !isLast && "bg-gradient-to-t from-primary/30 to-primary/10 hover:from-primary/50 hover:to-primary/20",
                      isLast && "bg-gradient-to-t from-primary to-primary/60"
                    )}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
              <span>{sparkline.length}d ago</span>
              <span className="text-primary">Today</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
