import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Moon, Heart, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIMELINE_DATA = [
  { time: "Today, 09:30", type: "Activity", value: "8,432 steps", icon: Activity, source: "Apple Watch" },
  { time: "Today, 06:42", type: "Sleep", value: "7.2 hours", icon: Moon, source: "Oura Ring" },
  { time: "Today, 08:15", type: "Heart Rate", value: "62 bpm", icon: Heart, source: "Apple Watch" },
  { time: "Yesterday, 22:00", type: "Recovery", value: "87%", icon: TrendingUp, source: "Whoop" },
  { time: "Yesterday, 18:30", type: "Activity", value: "10,234 steps", icon: Activity, source: "Apple Watch" },
];

export const MyDataTimeline = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">My Stats</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Unified view of all synced health data</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIMELINE_DATA.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm block">{item.type}</span>
                  <Badge variant="outline" className="text-xs mt-1">{item.source}</Badge>
                </div>
              </div>
              <div>
                <p className="font-semibold text-2xl">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
