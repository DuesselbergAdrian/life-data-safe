import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const GROUP_STATS = [
  { label: "Total Members", value: "8.2K", change: "+12%", icon: Users },
  { label: "Studies Supported", value: "24", change: "+3", icon: Target },
  { label: "Collective Points", value: "142K", change: "+8%", icon: Award },
  { label: "Impact Score", value: "94", change: "+6", icon: TrendingUp },
];

const ACTIVE_STUDIES = [
  { 
    name: "Sleep Quality Research 2024",
    participants: 1247,
    goal: 2000,
    timeLeft: "12 days left",
    impact: "High"
  },
  { 
    name: "Movement Patterns Study",
    participants: 892,
    goal: 1000,
    timeLeft: "20 days left",
    impact: "Medium"
  },
];

export const CollectiveImpact = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {GROUP_STATS.map((stat) => (
          <Card key={stat.label} className="glass p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-xs">{stat.change}</Badge>
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Research Studies</CardTitle>
          <CardDescription>Help reach participation goals for important health research</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ACTIVE_STUDIES.map((study, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{study.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{study.impact} impact</Badge>
                    <span className="text-xs text-muted-foreground">{study.timeLeft}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {study.participants.toLocaleString()} of {study.goal.toLocaleString()} participants
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round((study.participants / study.goal) * 100)}%
                  </span>
                </div>
                <Progress value={(study.participants / study.goal) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Your Group's Impact This Month</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your communities have contributed to 3 new studies and helped 24 researchers advance their work.
              </p>
              <Badge className="bg-success text-success-foreground">+450 collective points earned</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
