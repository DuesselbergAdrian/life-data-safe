import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Watch, Smartphone, Activity, Glasses, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEVICES = [
  { name: "Apple Watch", icon: Watch, status: "synced", lastSync: "2 min ago", color: "text-primary" },
  { name: "Apple Health", icon: Smartphone, status: "synced", lastSync: "5 min ago", color: "text-primary" },
  { name: "Oura Ring", icon: Activity, status: "synced", lastSync: "1 hour ago", color: "text-accent" },
  { name: "Meta Glasses", icon: Glasses, status: "pending", lastSync: "3 hours ago", color: "text-muted-foreground" },
];

export const ConnectedDevices = () => {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Connected Devices</CardTitle>
        <Button variant="ghost" size="sm" className="h-8">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEVICES.map((device) => (
          <div key={device.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-full bg-muted flex items-center justify-center", device.color)}>
                <device.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{device.name}</p>
                <p className="text-xs text-muted-foreground">Last sync: {device.lastSync}</p>
              </div>
            </div>
            <Badge 
              variant={device.status === "synced" ? "default" : "outline"}
              className="text-xs"
            >
              {device.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
