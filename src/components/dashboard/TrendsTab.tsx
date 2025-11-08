import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Heart, Moon, Zap, TrendingUp, Calendar } from "lucide-react";

interface TrendsTabProps {
  userId?: string;
}

const TrendsTab = ({ userId }: TrendsTabProps) => {
  const [connections, setConnections] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"7" | "30">("7");

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const fetchConnections = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("device_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "connected")
      .order("created_at", { ascending: false });

    setConnections(data || []);
  };

  // Generate mock historical data based on current metrics
  const generateHistoricalData = (days: number) => {
    const currentMetrics = connections[0]?.metrics_json || {};
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add realistic variation to metrics
      const variation = () => (Math.random() - 0.5) * 0.2; // +/- 10% variation
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        steps: Math.round((currentMetrics.steps || 7000) * (1 + variation())),
        rhr: Math.round((currentMetrics.rhr || 60) * (1 + variation() * 0.3)),
        sleepScore: Math.min(100, Math.max(40, Math.round((currentMetrics.sleepScore || 75) * (1 + variation())))),
        sleepHours: Number((6 + Math.random() * 2).toFixed(1)),
        activeMinutes: Math.round((currentMetrics.activeMinutes || 45) * (1 + variation())),
        calories: Math.round((currentMetrics.calories || 2000) * (1 + variation())),
        hrv: Math.round((currentMetrics.hrv || 40) * (1 + variation())),
        stressLevel: Math.min(100, Math.max(20, Math.round((currentMetrics.stressLevel || 45) * (1 + variation())))),
      });
    }
    
    return data;
  };

  const data = generateHistoricalData(parseInt(timeRange));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (connections.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Health Trends</h2>
          <p className="text-muted-foreground">Track your health metrics over time</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Connect a device in the Sync tab to see your health trends</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Health Trends</h2>
          <p className="text-muted-foreground">Track your progress over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "7" | "30")}>
            <TabsList>
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Activity Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Activity</CardTitle>
          </div>
          <CardDescription>Daily steps and active minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="steps"
                stroke="hsl(var(--muted-foreground))"
                fillOpacity={1}
                fill="url(#colorSteps)"
                name="Steps"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="activeMinutes"
                stroke="hsl(var(--muted-foreground))"
                fillOpacity={1}
                fill="url(#colorActive)"
                name="Active Minutes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heart Health Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Heart Health</CardTitle>
          </div>
          <CardDescription>Resting heart rate and HRV</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rhr"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))", r: 4 }}
                name="Resting HR (bpm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hrv"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))", r: 4 }}
                name="HRV (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Sleep Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sleep</CardTitle>
            </div>
            <CardDescription>Sleep score and duration</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="sleepScore"
                  fill="hsl(var(--muted-foreground))"
                  radius={[4, 4, 0, 0]}
                  name="Sleep Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stress & Recovery */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Stress Level</CardTitle>
            </div>
            <CardDescription>Daily stress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="stressLevel"
                  stroke="hsl(var(--muted-foreground))"
                  fillOpacity={1}
                  fill="url(#colorStress)"
                  name="Stress Level"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Period Summary</CardTitle>
          <CardDescription>Average metrics for the past {timeRange} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Steps</p>
              <p className="text-2xl font-bold">
                {Math.round(data.reduce((sum, d) => sum + d.steps, 0) / data.length).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Resting HR</p>
              <p className="text-2xl font-bold">
                {Math.round(data.reduce((sum, d) => sum + d.rhr, 0) / data.length)} bpm
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Sleep Score</p>
              <p className="text-2xl font-bold">
                {Math.round(data.reduce((sum, d) => sum + d.sleepScore, 0) / data.length)}/100
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Stress</p>
              <p className="text-2xl font-bold">
                {Math.round(data.reduce((sum, d) => sum + d.stressLevel, 0) / data.length)}/100
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsTab;
