import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Watch, Headphones, Glasses, Activity, Heart, Moon, Zap, Volume2, Sun, CheckCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SyncTabProps {
  userId?: string;
}

const SyncTab = ({ userId }: SyncTabProps) => {
  const [connections, setConnections] = useState<any[]>([]);
  const { toast } = useToast();

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
      .order("created_at", { ascending: false });

    setConnections(data || []);
  };

  const handleConnect = async (provider: string) => {
    if (!userId) return;

    // Mock device connection
    const mockMetrics = {
      steps: Math.floor(Math.random() * 10000) + 3000,
      rhr: Math.floor(Math.random() * 20) + 50,
      sleepScore: Math.floor(Math.random() * 30) + 70,
      activeMinutes: Math.floor(Math.random() * 60) + 30,
      calories: Math.floor(Math.random() * 500) + 1500,
      hrv: Math.floor(Math.random() * 50) + 30,
      spo2: Math.floor(Math.random() * 3) + 95,
      stressLevel: Math.floor(Math.random() * 40) + 30,
      listeningMinutes: provider === "AIRPODS" ? Math.floor(Math.random() * 240) + 60 : undefined,
      avgVolume: provider === "AIRPODS" ? Math.floor(Math.random() * 30) + 50 : undefined,
      lightExposure: provider === "META_GLASSES" ? Math.floor(Math.random() * 12) + 4 : undefined,
    };

    const { error } = await supabase.from("device_connections").insert({
      user_id: userId,
      provider,
      access_token: "demo-token",
      metrics_json: mockMetrics,
    });

    if (error) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Device connected!",
      description: `Successfully connected ${provider.replace("_", " ")}`,
    });

    fetchConnections();
  };

  const getDeviceIcon = (provider: string) => {
    switch (provider) {
      case "APPLE_WATCH": return Watch;
      case "AIRPODS": return Headphones;
      case "META_GLASSES": return Glasses;
      default: return Watch;
    }
  };

  const getDeviceName = (provider: string) => {
    return provider.replace("_", " ").toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isConnected = (provider: string) => {
    return connections.some(c => c.provider === provider && c.status === "connected");
  };

  const getConnectionData = (provider: string) => {
    return connections.find(c => c.provider === provider && c.status === "connected");
  };

  const devices = [
    { provider: "APPLE_WATCH", name: "Apple Watch", icon: Watch },
    { provider: "AIRPODS", name: "AirPods", icon: Headphones },
    { provider: "META_GLASSES", name: "Meta Glasses", icon: Glasses },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Sync Wearables</h2>
        <p className="text-muted-foreground">Connect your devices to automatically track health data</p>
      </div>

      {/* Available Devices */}
      <div className="grid md:grid-cols-3 gap-4">
        {devices.map((device) => {
          const Icon = device.icon;
          const connected = isConnected(device.provider);
          
          return (
            <Card key={device.provider} className={connected ? "border-success" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                    </div>
                  </div>
                  {connected && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <Button 
                    onClick={() => handleConnect(device.provider)}
                    variant="outline" 
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Last synced: {new Date(getConnectionData(device.provider)?.last_sync_at).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Data Summary */}
      {connections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Today's Summary</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {connections[0]?.metrics_json?.steps && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Steps</span>
                      <span className="font-semibold">{connections[0].metrics_json.steps.toLocaleString()}</span>
                    </div>
                    <Progress value={(connections[0].metrics_json.steps / 10000) * 100} className="h-2" />
                  </div>
                )}
                {connections[0]?.metrics_json?.activeMinutes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Minutes</span>
                    <span className="font-semibold">{connections[0].metrics_json.activeMinutes} min</span>
                  </div>
                )}
                {connections[0]?.metrics_json?.calories && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-semibold">{connections[0].metrics_json.calories} kcal</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Heart Health */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-base">Heart Health</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {connections[0]?.metrics_json?.rhr && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Resting HR</span>
                    <span className="font-semibold">{connections[0].metrics_json.rhr} bpm</span>
                  </div>
                )}
                {connections[0]?.metrics_json?.hrv && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">HRV</span>
                    <span className="font-semibold">{connections[0].metrics_json.hrv} ms</span>
                  </div>
                )}
                {connections[0]?.metrics_json?.spo2 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blood Oxygen</span>
                    <span className="font-semibold">{connections[0].metrics_json.spo2}%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sleep */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base">Sleep</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {connections[0]?.metrics_json?.sleepScore && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Sleep Score</span>
                      <span className="font-semibold">{connections[0].metrics_json.sleepScore}/100</span>
                    </div>
                    <Progress value={connections[0].metrics_json.sleepScore} className="h-2" />
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">7h 32m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deep Sleep</span>
                  <span className="font-semibold">1h 45m</span>
                </div>
              </CardContent>
            </Card>

            {/* Stress & Recovery */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <CardTitle className="text-base">Stress & Recovery</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {connections[0]?.metrics_json?.stressLevel && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Stress Level</span>
                      <span className="font-semibold">{connections[0].metrics_json.stressLevel}/100</span>
                    </div>
                    <Progress value={connections[0].metrics_json.stressLevel} className="h-2" />
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recovery Score</span>
                  <span className="font-semibold">82%</span>
                </div>
              </CardContent>
            </Card>

            {/* Audio Health (AirPods) */}
            {connections.some(c => c.provider === "AIRPODS") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-secondary" />
                    <CardTitle className="text-base">Audio Health</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connections.find(c => c.provider === "AIRPODS")?.metrics_json?.listeningMinutes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Listening Time</span>
                      <span className="font-semibold">
                        {connections.find(c => c.provider === "AIRPODS").metrics_json.listeningMinutes} min
                      </span>
                    </div>
                  )}
                  {connections.find(c => c.provider === "AIRPODS")?.metrics_json?.avgVolume && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Volume</span>
                      <span className="font-semibold">
                        {connections.find(c => c.provider === "AIRPODS").metrics_json.avgVolume}%
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground bg-warning/10 p-2 rounded">
                    Safe listening levels maintained
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environment (Meta Glasses) */}
            {connections.some(c => c.provider === "META_GLASSES") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-warning" />
                    <CardTitle className="text-base">Environment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connections.find(c => c.provider === "META_GLASSES")?.metrics_json?.lightExposure && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Light Exposure</span>
                      <span className="font-semibold">
                        {connections.find(c => c.provider === "META_GLASSES").metrics_json.lightExposure} hrs
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">UV Index</span>
                    <span className="font-semibold">Moderate</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
                    Good natural light exposure today
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncTab;
