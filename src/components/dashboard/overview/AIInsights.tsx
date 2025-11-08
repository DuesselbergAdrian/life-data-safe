import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Moon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const INSIGHTS = [
  {
    icon: Moon,
    title: "Sleep Quality Improved",
    description: "Your sleep recovery improved by 8% this week. Keep up your 10:30 PM bedtime routine.",
    impact: "positive",
    tag: "Sleep"
  },
  {
    icon: Zap,
    title: "Activity Consistency",
    description: "You've maintained 10,000+ steps for 5 days straight. Consider adding strength training.",
    impact: "positive",
    tag: "Activity"
  },
  {
    icon: TrendingUp,
    title: "HRV Trending Up",
    description: "Your heart rate variability is 12% higher than last month, indicating improved recovery.",
    impact: "positive",
    tag: "Recovery"
  }
];

export const AIInsights = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">AI Health Insights</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Personalized insights from your health data</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {INSIGHTS.map((insight, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <insight.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">{insight.tag}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
