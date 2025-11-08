import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Moon, Heart, TrendingUp, Utensils, Dumbbell, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Get unique values for filters
  const uniqueActivities = useMemo(() => 
    Array.from(new Set(ACTIVITY_DATA.map(item => item.activity))), 
    []
  );
  const uniqueSources = useMemo(() => 
    Array.from(new Set(ACTIVITY_DATA.map(item => item.dataSource))), 
    []
  );

  // Filter data
  const filteredData = useMemo(() => {
    return ACTIVITY_DATA.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dataSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Activity type filter
      const matchesActivity = activityFilter === "all" || item.activity === activityFilter;

      // Source filter
      const matchesSource = sourceFilter === "all" || item.dataSource === sourceFilter;

      // Date filter
      const itemDate = new Date(item.dateTime);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = itemDate.toDateString() === today.toDateString();
      } else if (dateFilter === "yesterday") {
        matchesDate = itemDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === "week") {
        matchesDate = itemDate >= lastWeek;
      }

      return matchesSearch && matchesActivity && matchesSource && matchesDate;
    });
  }, [searchQuery, activityFilter, sourceFilter, dateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setActivityFilter("all");
    setSourceFilter("all");
    setDateFilter("all");
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activity Data Log</CardTitle>
        <p className="text-sm text-muted-foreground">Complete record of all synced activities</p>
        
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities, sources, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activities</SelectItem>
                {uniqueActivities.map(activity => (
                  <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {uniqueSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || activityFilter !== "all" || sourceFilter !== "all" || dateFilter !== "all") && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                Clear filters
              </Button>
            )}
            
            <span className="text-sm text-muted-foreground ml-auto">
              {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        </div>
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No activities found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
