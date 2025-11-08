import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Activity, Heart, Watch, Smartphone, CheckCircle2 } from "lucide-react";

const DEVICE_PROVIDERS = [
  { id: "FITBIT", name: "Fitbit", icon: Activity, color: "bg-blue-500" },
  { id: "APPLE_HEALTH", name: "Apple Health", icon: Heart, color: "bg-red-500" },
  { id: "GOOGLE_FIT", name: "Google Fit", icon: Activity, color: "bg-green-500" },
  { id: "OURA", name: "Oura Ring", icon: Watch, color: "bg-purple-500" },
  { id: "WITHINGS", name: "Withings", icon: Activity, color: "bg-cyan-500" },
  { id: "MOCK", name: "Mock Device", icon: Smartphone, color: "bg-orange-500" },
];

interface DeviceStepProps {
  userId: string;
  onComplete: (data: any, valid: boolean) => void;
  initialData?: any;
}

export const DeviceStep = ({ userId, onComplete, initialData }: DeviceStepProps) => {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDevices();
  }, [userId]);

  useEffect(() => {
    onComplete({ devices: connectedDevices }, connectedDevices.length > 0);
  }, [connectedDevices]);

  const loadDevices = async () => {
    const { data } = await supabase
      .from("device_connections")
      .select("provider")
      .eq("user_id", userId);
    
    if (data) {
      setConnectedDevices(data.map(d => d.provider));
    }
  };

  const handleConnect = (providerId: string) => {
    setSelectedProvider(providerId);
    setShowDialog(true);
  };

  const simulateOAuth = async () => {
    if (!selectedProvider) return;

    // Simulate OAuth with fake data
    const fakeToken = `demo_${Math.random().toString(36).substring(7)}`;
    const metrics = {
      steps: Math.floor(Math.random() * (12000 - 4000) + 4000),
      sleepScore: Math.floor(Math.random() * (90 - 60) + 60),
      rhr: Math.floor(Math.random() * (75 - 50) + 50),
    };

    const { error } = await supabase.from("device_connections").insert({
      user_id: userId,
      provider: selectedProvider,
      access_token: fakeToken,
      status: "connected",
      metrics_json: metrics,
    });

    if (!error) {
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "DEVICE_CONNECT",
        scope: "integrations",
        details: { provider: selectedProvider, metrics }
      });

      setConnectedDevices(prev => [...prev, selectedProvider]);
      
      toast({
        title: "Device Connected! 🎉",
        description: `Successfully connected ${DEVICE_PROVIDERS.find(p => p.id === selectedProvider)?.name}`,
      });
    }

    setShowDialog(false);
    setSelectedProvider(null);
  };

  const selectedProviderData = DEVICE_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Connect Your Devices</h2>
        <p className="text-muted-foreground">
          Connect at least one device to track your health metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DEVICE_PROVIDERS.map(provider => {
          const Icon = provider.icon;
          const isConnected = connectedDevices.includes(provider.id);

          return (
            <Card
              key={provider.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                isConnected ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => !isConnected && handleConnect(provider.id)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${provider.color} p-4 rounded-full text-white`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">{provider.name}</h3>
                {isConnected ? (
                  <Badge variant="default" className="w-full">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="w-full">
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {connectedDevices.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm font-medium text-primary">
            ✓ {connectedDevices.length} device{connectedDevices.length > 1 ? 's' : ''} connected
          </p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedProviderData?.name}</DialogTitle>
            <DialogDescription>
              This is a simulated OAuth flow. In production, this would redirect to the provider's authorization page.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              {selectedProviderData && (
                <div className={`${selectedProviderData.color} p-6 rounded-full text-white`}>
                  <selectedProviderData.icon className="h-12 w-12" />
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>{selectedProviderData?.name}</strong> would like to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Read your activity data (steps, calories)</li>
                <li>Read your sleep data</li>
                <li>Read your heart rate data</li>
              </ul>
            </div>

            <Button onClick={simulateOAuth} className="w-full">
              Authorize Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
