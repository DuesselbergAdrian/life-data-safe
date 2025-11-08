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
      start: `${today}T00:00:00`, 
      end: `${today}T08:00:00`, 
      type: 'sleep',
      meta: { efficiency: 84, hrv: 52, deepSleep: '1h 45min', remSleep: '2h 12min' }
    },
    { 
      start: `${today}T08:00:00`, 
      end: `${today}T08:45:00`, 
      type: 'leisure', 
      meta: { activities: 'Watched TV, ate sandwich', screenTime: '35 min', meal: 'Sandwich + coffee', kcal: 420 } 
    },
    { 
      start: `${today}T08:45:00`, 
      end: `${today}T09:45:00`, 
      type: 'leisure', 
      meta: { activity: 'Commute', transport: 'Car/Train', steps: 1240 } 
    },
    { 
      start: `${today}T09:45:00`, 
      end: `${today}T10:30:00`, 
      type: 'leisure', 
      meta: { activity: 'Socializing', context: 'Coffee with colleagues', mood: 'Positive' } 
    },
    { 
      start: `${today}T10:30:00`, 
      end: `${today}T12:15:00`, 
      type: 'work', 
      meta: { posture: 'Sitting', standTime: '0 min', focusScore: 72 } 
    },
    { 
      start: `${today}T12:15:00`, 
      end: `${today}T12:45:00`, 
      type: 'meal', 
      meta: { meal: 'Lunch: Chicken salad', kcal: 580, protein: '35g', source: 'Apple Health' } 
    },
    { 
      start: `${today}T12:45:00`, 
      end: `${today}T14:00:00`, 
      type: 'work', 
      meta: { posture: 'Sitting', standTime: '0 min', screenTime: '1h 15min' } 
    },
    { 
      start: `${today}T14:00:00`, 
      end: `${today}T14:30:00`, 
      type: 'exercise', 
      meta: { activity: 'Light walk', avgHR: 105, steps: 3200, kcal: 140 } 
    },
    { 
      start: `${today}T14:30:00`, 
      end: new Date().toISOString(), 
      type: 'work', 
      meta: { posture: 'Sitting', standTime: '0 min', scrollTime: '45 min on TikTok', focusScore: 58 } 
    },
  ];
};

const OverviewMain = ({ userId }: OverviewMainProps) => {
  // Check if phases have been run today
  const getLastRunDate = () => localStorage.getItem('overview_last_run');
  const setLastRunDate = () => localStorage.setItem('overview_last_run', new Date().toDateString());
  const shouldRunPhases = getLastRunDate() !== new Date().toDateString();
  
  const { phase, scheduleTransition } = usePhase(shouldRunPhases ? 'sync' : 'overview');
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

  // Mark phases as complete when reaching overview
  useEffect(() => {
    if (phase === 'overview' && shouldRunPhases) {
      setLastRunDate();
    }
  }, [phase, shouldRunPhases]);

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

      <TipsList tips={generateRecommendations(metrics)} />

      <DayTimeline blocks={generateMockBlocks()} />

      <SupercutPanel />

      <div>
        <h3 className="text-2xl font-semibold mb-6 tracking-tight">Health Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BenchmarkedMetricCard
            title="Nutrition"
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
          <BenchmarkedMetricCard
            title="Steps"
            value="8,234"
            delta={12}
            sparkline={[7200, 8100, 7800, 8500, 8000, 7900, 8234]}
            benchmark={{ label: 'Good', percentile: 70, context: 'Top 30% peers' }}
            icon={<Activity className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Water"
            value="2.1"
            unit="L"
            delta={-3}
            sparkline={[2.3, 2.2, 2.4, 2.0, 2.3, 2.2, 2.1]}
            benchmark={{ label: 'Medium', percentile: 50, context: 'Around average' }}
            icon={<Activity className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Active Energy"
            value="412"
            unit="kcal"
            delta={15}
            sparkline={[380, 350, 390, 420, 400, 380, 412]}
            benchmark={{ label: 'Good', percentile: 68, context: 'Top 30% peers' }}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Max HR"
            value="156"
            unit="bpm"
            delta={8}
            sparkline={[142, 148, 152, 158, 150, 154, 156]}
            benchmark={{ label: 'Good', percentile: 72, context: 'Top 30% peers' }}
            icon={<Heart className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Avg HR"
            value="72"
            unit="bpm"
            delta={-2}
            sparkline={[75, 74, 73, 72, 73, 72, 72]}
            benchmark={{ label: 'Good', percentile: 65, context: 'Top 30% peers' }}
            icon={<Heart className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="VO2 Max"
            value="48.5"
            unit="ml/kg/min"
            delta={3}
            sparkline={[46, 46.5, 47, 47.8, 48, 48.2, 48.5]}
            benchmark={{ label: 'Good', percentile: 75, context: 'Top 25% peers' }}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Sleep Score"
            value="82"
            delta={-4}
            sparkline={[85, 84, 86, 88, 84, 83, 82]}
            benchmark={{ label: 'Good', percentile: 70, context: 'Top 30% peers' }}
            icon={<Moon className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Recovery"
            value="68"
            delta={-10}
            sparkline={[75, 72, 78, 80, 74, 70, 68]}
            benchmark={{ label: 'Medium', percentile: 55, context: 'Around average' }}
            icon={<Activity className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Stress"
            value="42"
            delta={5}
            sparkline={[38, 40, 39, 41, 40, 41, 42]}
            benchmark={{ label: 'Medium', percentile: 50, context: 'Around average' }}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <BenchmarkedMetricCard
            title="Readiness"
            value="75"
            delta={-8}
            sparkline={[82, 80, 83, 85, 80, 78, 75]}
            benchmark={{ label: 'Good', percentile: 65, context: 'Top 35% peers' }}
            icon={<Activity className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewMain;
