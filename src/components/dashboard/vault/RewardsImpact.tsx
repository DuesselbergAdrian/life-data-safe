import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Award, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const IMPACT_STATS = [
  { label: "Impact Points", value: "1,247", icon: Award, color: "text-primary" },
  { label: "Studies Supported", value: "12", icon: FileText, color: "text-accent" },
  { label: "Data Contributions", value: "43", icon: TrendingUp, color: "text-success" },
  { label: "Community Reach", value: "2.4K", icon: Users, color: "text-primary" },
];

const RECENT_REWARDS = [
  { title: "Sleep Data Contribution", points: "+50", date: "2 days ago", study: "Sleep Quality Research 2024" },
  { title: "Activity Data Contribution", points: "+30", date: "5 days ago", study: "Movement Patterns Study" },
  { title: "Heart Data Contribution", points: "+40", date: "1 week ago", study: "Cardiovascular Health" },
];

export const RewardsImpact = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {IMPACT_STATS.map((stat) => (
          <Card key={stat.label} className="glass p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <Badge variant="outline" className="text-xs">+12%</Badge>
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Impact Over Time</CardTitle>
          <CardDescription>Your contribution to health research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Studies Supported This Month</span>
                <span className="text-sm text-muted-foreground">4 of 5 goal</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Impact Points Goal</span>
                <span className="text-sm text-muted-foreground">1,247 of 2,000</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RECENT_REWARDS.map((reward, idx) => (
            <div key={idx} className="flex items-start justify-between p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="font-medium text-sm">{reward.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{reward.study}</p>
                <p className="text-xs text-muted-foreground">{reward.date}</p>
              </div>
              <Badge className="bg-success text-success-foreground">{reward.points}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
