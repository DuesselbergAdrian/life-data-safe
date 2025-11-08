import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  source: string;
  action: string;
  time: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ActivityItem = ({ source, action, time, icon, className }: ActivityItemProps) => {
  return (
    <div className={cn("flex items-start gap-3 py-3 border-b border-border last:border-0", className)}>
      {icon || <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Clock className="h-4 w-4 text-primary" />
      </div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{action}</p>
        <p className="text-xs text-muted-foreground">from {source}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
};
