import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  trend?: number[];
  icon?: React.ReactNode;
}

export const SummaryCard = ({ title, value, unit, change, trend, icon }: SummaryCardProps) => {
  const isPositive = change && change > 0;
  
  return (
    <Card className="glass p-6 hover:shadow-glass transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      {change !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(change)}% vs last week</span>
        </div>
      )}
      
      {trend && trend.length > 0 && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {trend.map((point, idx) => (
            <div
              key={idx}
              className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
              style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
