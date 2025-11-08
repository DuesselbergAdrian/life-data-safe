import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const CONSENT_OPTIONS = [
  {
    id: "anonymized",
    title: "Share Anonymized Data",
    description: "Allow your anonymized health data to be used for research and public health studies",
    enabled: true,
  },
  {
    id: "provider",
    title: "Share with Healthcare Providers",
    description: "Allow authorized healthcare providers to access your health records",
    enabled: false,
  },
  {
    id: "communities",
    title: "Share with Communities",
    description: "Share selected data with health communities you've joined",
    enabled: true,
  },
];

const AUDIT_LOG = [
  { action: "Consent granted", target: "Research Project #42", time: "2 hours ago", actor: "You" },
  { action: "Data exported", target: "All data (JSON)", time: "1 day ago", actor: "You" },
  { action: "Consent revoked", target: "Community: Heart Health", time: "3 days ago", actor: "You" },
];

export const ConsentsManager = () => {
  const [consents, setConsents] = useState(CONSENT_OPTIONS);

  const toggleConsent = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Data Sharing Consents</CardTitle>
          </div>
          <CardDescription>Control who can access your health data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consents.map((consent) => (
            <div 
              key={consent.id}
              className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{consent.title}</h4>
                  {consent.enabled && <CheckCircle className="h-4 w-4 text-success" />}
                </div>
                <p className="text-sm text-muted-foreground">{consent.description}</p>
              </div>
              <Switch 
                checked={consent.enabled}
                onCheckedChange={() => toggleConsent(consent.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Audit Log</CardTitle>
          <CardDescription>Track all actions related to your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {AUDIT_LOG.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.target}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs mb-1">{log.actor}</Badge>
                <p className="text-xs text-muted-foreground">{log.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
