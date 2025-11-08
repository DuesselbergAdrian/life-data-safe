import { useState, useEffect } from "react";
import { Glasses, Watch, Smartphone, Activity, Heart, TrendingUp, Utensils, Moon } from "lucide-react";
import { usePhase } from "@/hooks/usePhase";
import { PhaseStepper } from "./overview/PhaseStepper";
import { SyncCard, SyncState } from "./overview/SyncCard";
import { AgentHandoff } from "./overview/AgentHandoff";
import { DayTimeline, DayBlock } from "./overview/DayTimeline";
import { SupercutPanel } from "./overview/SupercutPanel";
import { BenchmarkedMetricCard } from "./overview/BenchmarkedMetricCard";
import { TipsList } from "./overview/TipsList";
import { benchmark, generateRecommendations } from "@/lib/benchmarks";

interface OverviewMainProps {
  userId?: string;
}

type ProviderKey = 'glasses' | 'appleHealth' | 'androidHealth' | 'appleWatch' | 'otherWatch' | 'oura' | 'galaxyRing';

interface ProviderState {
  key: ProviderKey;
  name: string;
  icon: React.ReactNode;
  state: SyncState;
  progress: number;
}

const PROVIDERS: Omit<ProviderState, 'state' | 'progress'>[] = [
  { key: 'glasses', name: 'Glasses', icon: <Glasses className="h-5 w-5" /> },
  { key: 'appleHealth', name: 'Apple Health', icon: <Smartphone className="h-5 w-5" /> },
  { key: 'androidHealth', name: 'Android Health', icon: <Smartphone className="h-5 w-5" /> },
  { key: 'appleWatch', name: 'Apple Watch', icon: <Watch className="h-5 w-5" /> },
  { key: 'otherWatch', name: 'Other Watch', icon: <Watch className="h-5 w-5" /> },
  { key: 'oura', name: 'Oura Ring', icon: <Activity className="h-5 w-5" /> },
  { key: 'galaxyRing', name: 'Galaxy Ring', icon: <Activity className="h-5 w-5" /> },
];

const generateMockBlocks = (): DayBlock[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    { 
      start: `${today}T00:30:00`, 
      end: `${today}T07:00:00`, 
      type: 'sleep',
      meta: { efficiency: 87, hrv: 58 }
    },
    { start: `${today}T07:15:00`, end: `${today}T07:35:00`, type: 'meal', meta: { meal: 'Breakfast: Skyr + granola', kcal: 310, source: 'Apple Health' } },
    { start: `${today}T09:00:00`, end: `${today}T12:00:00`, type: 'work' },
    { start: `${today}T12:15:00`, end: `${today}T12:45:00`, type: 'meal', meta: { meal: 'Lunch: Salmon bowl', kcal: 520, source: 'Manual' } },
    { start: `${today}T13:00:00`, end: `${today}T17:00:00`, type: 'work' },
    { start: `${today}T18:00:00`, end: `${today}T18:40:00`, type: 'exercise', meta: { activity: 'Zone 2 run', avgHR: 138, kcal: 380 } },
    { start: `${today}T18:30:00`, end: `${today}T19:00:00`, type: 'meal', meta: { meal: 'Dinner: Chicken + veggies', kcal: 650, source: 'Oura' } },
    { start: `${today}T19:30:00`, end: `${today}T23:00:00`, type: 'leisure' },
  ];
};

const OverviewMain = ({ userId }: OverviewMainProps) => {
  const { phase, scheduleTransition } = usePhase('sync');
  const [providers, setProviders] = useState<ProviderState[]>(
    PROVIDERS.map(p => ({ ...p, state: 'queued' as SyncState, progress: 0 }))
  );

  // Sync simulation
  useEffect(() => {
    if (phase !== 'sync') return;

    const timers: NodeJS.Timeout[] = [];
    const glassesTime = 5000;

    // Start glasses immediately
    setProviders(prev => prev.map(p => 
      p.key === 'glasses' ? { ...p, state: 'syncing' } : p
    ));

    // Glasses progress
    const glassesInterval = setInterval(() => {
      setProviders(prev => prev.map(p => 
        p.key === 'glasses' && p.state === 'syncing' 
          ? { ...p, progress: Math.min(100, p.progress + 20) }
          : p
      ));
    }, 1000);
    timers.push(glassesInterval);

    // Complete glasses
    const glassesComplete = setTimeout(() => {
      clearInterval(glassesInterval);
      setProviders(prev => prev.map(p => 
        p.key === 'glasses' ? { ...p, state: 'done', progress: 100 } : p
      ));

      // Transition to analyzing after brief pause
      scheduleTransition('analyzing', 1500);
    }, glassesTime);
    timers.push(glassesComplete);

    // Start other providers with stagger
    PROVIDERS.filter(p => p.key !== 'glasses').forEach((provider, idx) => {
      const stagger = 300 + Math.random() * 300;
      const duration = 4000 + Math.floor(Math.random() * 8000);
      const minDuration = Math.max(duration, glassesTime + 1200);

      const startTimer = setTimeout(() => {
        setProviders(prev => prev.map(p => 
          p.key === provider.key ? { ...p, state: 'syncing' } : p
        ));

        const interval = setInterval(() => {
          setProviders(prev => prev.map(p => 
            p.key === provider.key && p.state === 'syncing'
              ? { ...p, progress: Math.min(100, p.progress + 10) }
              : p
          ));
        }, minDuration / 10);
        timers.push(interval);

        const completeTimer = setTimeout(() => {
          clearInterval(interval);
          setProviders(prev => prev.map(p => 
            p.key === provider.key ? { ...p, state: 'done', progress: 100 } : p
          ));
        }, minDuration);
        timers.push(completeTimer);
      }, stagger);
      timers.push(startTimer);
    });

    return () => timers.forEach(clearTimeout);
  }, [phase, scheduleTransition]);

  // Agent phase transition
  useEffect(() => {
    if (phase === 'analyzing') {
      scheduleTransition('overview', 10000);
    }
  }, [phase, scheduleTransition]);

  // Mock metrics
  const metrics = {
    nutrition: 72,
    kcal: 2100,
    exerciseMin: 32,
    rhr: 61,
    hrv: 46,
  };

  if (phase === 'sync') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <PhaseStepper currentPhase="sync" />
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Syncing your health data</h2>
          <p className="text-muted-foreground">Connecting to your devices and apps...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(provider => (
            <SyncCard
              key={provider.key}
              name={provider.name}
              icon={provider.icon}
              state={provider.state}
              progress={provider.progress}
              isPrimary={provider.key === 'glasses'}
            />
          ))}
        </div>

        {providers[0].state === 'done' && (
          <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-300">
            Glasses synced. Handing off to your Health Agent for analysis...
          </div>
        )}
      </div>
    );
  }

  if (phase === 'analyzing') {
    return (
      <div className="animate-in fade-in duration-500">
        <PhaseStepper currentPhase="analyzing" />
        <AgentHandoff />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Your Day</h2>
        <p className="text-muted-foreground">A complete view of your health today</p>
      </div>

      <DayTimeline blocks={generateMockBlocks()} />

      <SupercutPanel />

      <div>
        <h3 className="text-xl font-semibold mb-4">Today's Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BenchmarkedMetricCard
            title="Nutrition Score"
            value={metrics.nutrition.toString()}
            delta={5}
            sparkline={[65, 68, 70, 72, 69, 71, 72]}
            benchmark={benchmark(metrics.nutrition, 'nutrition')}
            icon={<Utensils className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Exercise"
            value={metrics.exerciseMin.toString()}
            unit="min"
            delta={-8}
            sparkline={[45, 38, 42, 35, 40, 32, 32]}
            benchmark={benchmark(metrics.exerciseMin, 'exerciseMin')}
            icon={<Activity className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Resting HR"
            value={metrics.rhr.toString()}
            unit="bpm"
            delta={2}
            sparkline={[59, 60, 61, 62, 60, 61, 61]}
            benchmark={benchmark(metrics.rhr, 'rhr')}
            icon={<Heart className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="HRV"
            value={metrics.hrv.toString()}
            unit="ms"
            delta={-12}
            sparkline={[52, 50, 48, 46, 47, 45, 46]}
            benchmark={benchmark(metrics.hrv, 'hrv')}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Calories"
            value={metrics.kcal.toString()}
            unit="kcal"
            delta={8}
            sparkline={[1900, 2000, 2100, 2050, 2150, 2100, 2100]}
            benchmark={benchmark(metrics.kcal, 'kcal')}
            icon={<Utensils className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Sleep"
            value="7.2"
            unit="hrs"
            delta={-5}
            sparkline={[7, 6.5, 7.2, 8, 7.5, 6.8, 7.2]}
            benchmark={{ label: 'Good', percentile: 65, context: 'Top 30% peers' }}
            icon={<Moon className="h-5 w-5" />}
          />
        </div>
      </div>

      <TipsList tips={generateRecommendations(metrics)} />
    </div>
  );
};

export default OverviewMain;
