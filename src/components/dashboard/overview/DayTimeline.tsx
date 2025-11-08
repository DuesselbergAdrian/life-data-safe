import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  const renderTooltipContent = (block: DayBlock) => {
    const config = BLOCK_CONFIG[block.type];
    
    return (
      <div className="space-y-2 min-w-[200px]">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <config.icon className="h-4 w-4" />
          <p className="font-semibold">{config.label}</p>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {getTimeFromISO(block.start)} – {getTimeFromISO(block.end)} • {getDuration(block.start, block.end)}
        </div>

        {block.meta && (
          <div className="space-y-1.5 pt-1 text-sm">
            {block.type === 'sleep' && (
              <>
                <p>Efficiency: <span className="font-medium">{block.meta.efficiency}%</span></p>
                <p>HRV: <span className="font-medium">{block.meta.hrv} ms</span></p>
                {block.meta.deepSleep && <p>Deep Sleep: <span className="font-medium">{block.meta.deepSleep}</span></p>}
                {block.meta.remSleep && <p>REM Sleep: <span className="font-medium">{block.meta.remSleep}</span></p>}
              </>
            )}
            
            {block.type === 'meal' && (
              <>
                <p className="font-medium">{block.meta.meal}</p>
                <p>~{block.meta.kcal} kcal</p>
                {block.meta.protein && <p>Protein: {block.meta.protein}</p>}
                {block.meta.source && <p className="text-xs text-muted-foreground">Source: {block.meta.source}</p>}
              </>
            )}
            
            {block.type === 'exercise' && (
              <>
                <p className="font-medium">{block.meta.activity}</p>
                {block.meta.avgHR && <p>Avg HR: {block.meta.avgHR} bpm</p>}
                {block.meta.steps && <p>Steps: {block.meta.steps.toLocaleString()}</p>}
                {block.meta.kcal && <p>~{block.meta.kcal} kcal burned</p>}
              </>
            )}
            
            {block.type === 'work' && (
              <>
                {block.meta.posture && <p>Posture: <span className="font-medium">{block.meta.posture}</span></p>}
                {block.meta.standTime && <p>Stand Time: <span className="font-medium">{block.meta.standTime}</span></p>}
                {block.meta.focusScore && <p>Focus Score: <span className="font-medium">{block.meta.focusScore}/100</span></p>}
                {block.meta.scrollTime && <p className="text-health-bad">{block.meta.scrollTime}</p>}
              </>
            )}
            
            {block.type === 'leisure' && (
              <>
                {block.meta.activities && <p className="font-medium">{block.meta.activities}</p>}
                {block.meta.activity && <p className="font-medium">{block.meta.activity}</p>}
                {block.meta.context && <p className="text-muted-foreground">{block.meta.context}</p>}
                {block.meta.screenTime && <p>Screen Time: {block.meta.screenTime}</p>}
                {block.meta.steps && <p>Steps: {block.meta.steps.toLocaleString()}</p>}
                {block.meta.transport && <p>Transport: {block.meta.transport}</p>}
                {block.meta.mood && <p>Mood: {block.meta.mood}</p>}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Timeline</h3>
          <p className="text-sm text-muted-foreground">Hover over segments to see details</p>
        </div>

          <div className="relative">
            {/* Hour markers */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className="w-0">{i.toString().padStart(2, '0')}</span>
              ))}
            </div>

            {/* Timeline bar */}
            <TooltipProvider delayDuration={100}>
              <div className="flex h-16 rounded-xl overflow-hidden border border-border">
                {blocks.map((block, idx) => {
                  const config = BLOCK_CONFIG[block.type];
                  const Icon = config.icon;
                  
                  // Calculate duration in minutes for accurate width
                  const startMs = new Date(block.start).getTime();
                  const endMs = new Date(block.end).getTime();
                  const durationMinutes = (endMs - startMs) / 60000;
                  const width = (durationMinutes / (24 * 60)) * 100;

                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "flex-shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-125 hover:scale-105 border-r border-border/50",
                            config.color
                          )}
                          style={{ width: `${width}%` }}
                        >
                          <Icon className="h-4 w-4" />
                          {durationMinutes > 120 && (
                            <span className="text-xs font-medium">{config.label}</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="p-4">
                        {renderTooltipContent(block)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </Card>
  );
};
