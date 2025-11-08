import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Smartphone, Watch, Activity, Wifi, WifiOff, Plus, Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeviceConnection {
  id: string;
  provider: string;
  status: string;
  last_sync_at: string;
  created_at: string;
  metrics_json: any;
}

interface DevicesTabProps {
  userId?: string;
}

const PROVIDER_INFO: Record<string, { icon: any; name: string; color: string }> = {
  apple_health: { icon: Watch, name: "Apple Health", color: "text-gray-700" },
  apple_watch: { icon: Watch, name: "Apple Watch", color: "text-gray-700" },
  google_fit: { icon: Activity, name: "Google Fit", color: "text-blue-600" },
  fitbit: { icon: Activity, name: "Fitbit", color: "text-teal-600" },
  oura: { icon: Watch, name: "Oura Ring", color: "text-purple-600" },
  whoop: { icon: Watch, name: "Whoop", color: "text-red-600" },
  garmin: { icon: Watch, name: "Garmin", color: "text-blue-800" },
  strava: { icon: Activity, name: "Strava", color: "text-orange-600" },
};

export const DevicesTab = ({ userId }: DevicesTabProps) => {
  const [devices, setDevices] = useState<DeviceConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadDevices();
    }
  }, [userId]);

  const loadDevices = async () => {
    const { data, error } = await supabase
      .from("device_connections")
      .select("*")
      .eq("user_id", userId)
      .order("last_sync_at", { ascending: false });

    if (!error && data) {
      setDevices(data);
    }
    setLoading(false);
  };

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getProviderInfo = (provider: string) => {
    return PROVIDER_INFO[provider] || { 
      icon: Smartphone, 
      name: provider.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), 
      color: "text-primary" 
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading devices...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold">Connected Devices</CardTitle>
            </div>
            <Badge variant="outline">{devices.length} connected</Badge>
          </div>
          <CardDescription>Devices currently syncing health data to your vault</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.length > 0 ? (
            devices.map((device) => {
              const providerInfo = getProviderInfo(device.provider);
              const Icon = providerInfo.icon;
              const isConnected = device.status === "connected";

              return (
                <div 
                  key={device.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ${providerInfo.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{providerInfo.name}</p>
                      {isConnected ? (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {device.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Last sync: {formatLastSync(device.last_sync_at)}</span>
                      <span>•</span>
                      <span>Connected: {new Date(device.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No devices connected yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Device */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Connect New Device</CardTitle>
          </div>
          <CardDescription>Sync data from your health and fitness devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Connect your devices to automatically sync health data including steps, sleep, heart rate, and more.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(PROVIDER_INFO).map(([key, info]) => {
              const Icon = info.icon;
              const isConnected = devices.some(d => d.provider === key);

              return (
                <Button
                  key={key}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  disabled={isConnected}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ${info.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{info.name}</p>
                      {isConnected && (
                        <p className="text-xs text-muted-foreground">Already connected</p>
                      )}
                    </div>
                    {!isConnected && <Plus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-medium text-sm mb-2">How to sync your devices:</h4>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Click on the device you want to connect above</li>
              <li>Sign in with your device account credentials</li>
              <li>Grant permission to access your health data</li>
              <li>Data will automatically sync in the background</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Sync Information */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Automatic Sync</CardTitle>
          <CardDescription>Your devices sync automatically throughout the day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Real-time updates</p>
              <p className="text-xs text-muted-foreground">Data syncs every 15 minutes when devices are connected</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Background sync</p>
              <p className="text-xs text-muted-foreground">No need to manually refresh - data updates automatically</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Battery efficient</p>
              <p className="text-xs text-muted-foreground">Optimized sync process to minimize battery usage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
