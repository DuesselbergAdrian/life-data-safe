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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">My Data Timeline</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Unified view of all synced health data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All data</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="heart">Heart</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {TIMELINE_DATA.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.type}</span>
                <Badge variant="outline" className="text-xs">{item.source}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">{item.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
