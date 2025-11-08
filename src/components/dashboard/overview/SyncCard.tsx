import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SyncState = 'queued' | 'syncing' | 'done' | 'error';

interface SyncCardProps {
  name: string;
  icon: React.ReactNode;
  state: SyncState;
  progress?: number;
  isPrimary?: boolean;
}

export const SyncCard = ({ name, icon, state, progress = 0, isPrimary }: SyncCardProps) => {
  return (
    <Card className={cn(
      "p-4 transition-all duration-150",
      isPrimary && "border-primary bg-primary/5",
      state === 'done' && "border-health-good/50"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            isPrimary ? "bg-primary/10" : "bg-muted"
          )}>
            {icon}
          </div>
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">
              {state === 'queued' && 'Waiting...'}
              {state === 'syncing' && 'Reading steps, HR, sleep...'}
              {state === 'done' && 'Last update: just now'}
              {state === 'error' && 'Connection failed'}
            </p>
          </div>
        </div>
        
        {state === 'queued' && (
          <Badge variant="outline" className="text-xs">Queued</Badge>
        )}
        {state === 'syncing' && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
        {state === 'done' && (
          <div className="h-6 w-6 rounded-full bg-health-good flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        {state === 'error' && (
          <AlertCircle className="h-4 w-4 text-health-bad" />
        )}
      </div>
      
      {state === 'syncing' && (
        <Progress value={progress} className="h-1" />
      )}
    </Card>
  );
};
