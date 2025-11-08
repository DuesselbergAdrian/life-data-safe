import { Activity, Moon, Heart, TrendingUp } from "lucide-react";
import { SummaryCard } from "./overview/SummaryCard";
import { ConnectedDevices } from "./overview/ConnectedDevices";
import { AIInsights } from "./overview/AIInsights";

interface OverviewMainProps {
  userId?: string;
}

const OverviewMain = ({ userId }: OverviewMainProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-muted-foreground">Your personal health snapshot</p>
      </div>

      {/* Key Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Steps"
          value="8,432"
          change={12}
          trend={[65, 72, 68, 80, 75, 85, 90]}
          icon={<Activity className="h-5 w-5" />}
        />
        <SummaryCard
          title="Sleep"
          value="7.2"
          unit="hrs"
          change={-5}
          trend={[7, 6.5, 7.2, 8, 7.5, 6.8, 7.2]}
          icon={<Moon className="h-5 w-5" />}
        />
        <SummaryCard
          title="HRV"
          value="62"
          unit="ms"
          change={8}
          trend={[55, 58, 60, 62, 61, 63, 62]}
          icon={<Heart className="h-5 w-5" />}
        />
        <SummaryCard
          title="Recovery"
          value="87"
          unit="%"
          change={3}
          trend={[80, 82, 85, 87, 84, 86, 87]}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Connected Devices & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectedDevices />
        <AIInsights />
      </div>
    </div>
  );
};

export default OverviewMain;
