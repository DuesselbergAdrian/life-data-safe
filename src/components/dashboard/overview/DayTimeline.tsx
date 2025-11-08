import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Moon, Briefcase, Coffee, Utensils, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export type BlockType = 'sleep' | 'work' | 'leisure' | 'meal' | 'exercise';

export interface DayBlock {
  start: string;
  end: string;
  type: BlockType;
  meta?: Record<string, any>;
}

const BLOCK_CONFIG = {
  sleep: { icon: Moon, label: 'Sleeping', color: 'bg-purple-500/20 border-purple-500/50' },
  work: { icon: Briefcase, label: 'Working', color: 'bg-blue-500/20 border-blue-500/50' },
  leisure: { icon: Coffee, label: 'Leisure', color: 'bg-green-500/20 border-green-500/50' },
  meal: { icon: Utensils, label: 'Eating', color: 'bg-orange-500/20 border-orange-500/50' },
  exercise: { icon: Dumbbell, label: 'Exercise', color: 'bg-red-500/20 border-red-500/50' },
};

interface DayTimelineProps {
  blocks: DayBlock[];
}

export const DayTimeline = ({ blocks }: DayTimelineProps) => {
  const [selectedBlock, setSelectedBlock] = useState<DayBlock | null>(null);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePress = (block: DayBlock) => {
    const timer = setTimeout(() => {
      setSelectedBlock(block);
    }, 500);
    setPressTimer(timer);
  };

  const handleRelease = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const getTimeFromISO = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Copenhagen'
    });
  };

  const getDuration = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Card className="glass p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Timeline</h3>
            <p className="text-sm text-muted-foreground">Press and hold any segment for details</p>
          </div>

          <div className="relative">
            {/* Hour markers */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className="w-0">{i.toString().padStart(2, '0')}</span>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="flex h-16 rounded-xl overflow-hidden border border-border">
              {blocks.map((block, idx) => {
                const config = BLOCK_CONFIG[block.type];
                const Icon = config.icon;
                const startHour = new Date(block.start).getHours();
                const endHour = new Date(block.end).getHours();
                const duration = endHour - startHour;
                const width = (duration / 24) * 100;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 border-r border-border/50",
                      config.color
                    )}
                    style={{ width: `${width}%` }}
                    onMouseDown={() => handlePress(block)}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease}
                    onTouchStart={() => handlePress(block)}
                    onTouchEnd={handleRelease}
                  >
                    <Icon className="h-4 w-4" />
                    {duration > 2 && (
                      <span className="text-xs font-medium">{config.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Sheet open={!!selectedBlock} onOpenChange={() => setSelectedBlock(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedBlock && BLOCK_CONFIG[selectedBlock.type].label}
            </SheetTitle>
          </SheetHeader>
          {selectedBlock && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{getTimeFromISO(selectedBlock.start)}–{getTimeFromISO(selectedBlock.end)}</span>
                <span>•</span>
                <span>{getDuration(selectedBlock.start, selectedBlock.end)}</span>
              </div>

              {selectedBlock.meta && (
                <div className="space-y-3">
                  {selectedBlock.type === 'meal' && (
                    <>
                      <p className="font-medium">{selectedBlock.meta.meal}</p>
                      <p className="text-sm text-muted-foreground">~{selectedBlock.meta.kcal} kcal</p>
                      <p className="text-xs text-muted-foreground">Source: {selectedBlock.meta.source}</p>
                    </>
                  )}
                  {selectedBlock.type === 'exercise' && (
                    <>
                      <p className="font-medium">{selectedBlock.meta.activity}</p>
                      <p className="text-sm text-muted-foreground">Avg HR: {selectedBlock.meta.avgHR} bpm</p>
                      <p className="text-sm text-muted-foreground">~{selectedBlock.meta.kcal} kcal</p>
                    </>
                  )}
                  {selectedBlock.type === 'sleep' && (
                    <>
                      <p className="text-sm text-muted-foreground">Efficiency: {selectedBlock.meta.efficiency}%</p>
                      <p className="text-sm text-muted-foreground">HRV: {selectedBlock.meta.hrv} ms</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
