import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Moon, Heart, TrendingUp, Utensils, Dumbbell } from "lucide-react";

interface ActivityData {
  id: string;
  activity: string;
  dataSource: string;
  value: string;
  dateTime: string;
  icon: React.ReactNode;
  tags: string[];
}

const ACTIVITY_DATA: ActivityData[] = [
  {
    id: "1",
    activity: "Steps",
    dataSource: "Apple Watch",
    value: "8,432 steps",
    dateTime: "2025-01-08 09:30",
    icon: <Activity className="h-4 w-4" />,
    tags: ["Activity", "Movement"]
  },
  {
    id: "2",
    activity: "Sleep",
    dataSource: "Oura Ring",
    value: "7.2 hours",
    dateTime: "2025-01-08 06:42",
    icon: <Moon className="h-4 w-4" />,
    tags: ["Sleep", "Recovery"]
  },
  {
    id: "3",
    activity: "Resting Heart Rate",
    dataSource: "Apple Watch",
    value: "62 bpm",
    dateTime: "2025-01-08 08:15",
    icon: <Heart className="h-4 w-4" />,
    tags: ["Heart", "Vitals"]
  },
  {
    id: "4",
    activity: "Recovery Score",
    dataSource: "Whoop",
    value: "87%",
    dateTime: "2025-01-07 22:00",
    icon: <TrendingUp className="h-4 w-4" />,
    tags: ["Recovery", "Readiness"]
  },
  {
    id: "5",
    activity: "Steps",
    dataSource: "Apple Watch",
    value: "10,234 steps",
    dateTime: "2025-01-07 18:30",
    icon: <Activity className="h-4 w-4" />,
    tags: ["Activity", "Movement"]
  },
  {
    id: "6",
    activity: "Calories",
    dataSource: "Apple Health",
    value: "2,150 kcal",
    dateTime: "2025-01-07 20:00",
    icon: <Utensils className="h-4 w-4" />,
    tags: ["Nutrition", "Diet"]
  },
  {
    id: "7",
    activity: "Workout",
    dataSource: "Garmin",
    value: "45 min run",
    dateTime: "2025-01-07 17:00",
    icon: <Dumbbell className="h-4 w-4" />,
    tags: ["Exercise", "Cardio"]
  },
  {
    id: "8",
    activity: "HRV",
    dataSource: "Oura Ring",
    value: "52 ms",
    dateTime: "2025-01-07 06:30",
    icon: <Heart className="h-4 w-4" />,
    tags: ["Heart", "Recovery"]
  },
];

export const ActivityDataTable = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activity Data Log</CardTitle>
        <p className="text-sm text-muted-foreground">Complete record of all synced activities</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12"></TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACTIVITY_DATA.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.activity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.dataSource}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{item.value}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.dateTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
