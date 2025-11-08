import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Database, Users, Globe } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ConsentTabProps {
  userId?: string;
}

const ConsentTab = ({ userId }: ConsentTabProps) => {
  const [consents, setConsents] = useState({
    share_anonymized: false,
    share_private_circle: false,
    share_communities: false,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchConsents();
      fetchAuditLogs();
    }
  }, [userId]);

  const fetchConsents = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("consents")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setConsents({
        share_anonymized: data.share_anonymized,
        share_private_circle: data.share_private_circle,
        share_communities: data.share_communities,
      });
    }
  };

  const fetchAuditLogs = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    setAuditLogs(data || []);
  };

  const handleConsentChange = async (field: keyof typeof consents, value: boolean) => {
    if (!userId) return;

    try {
      // Update consent
      const { error } = await supabase
        .from("consents")
        .update({ [field]: value })
        .eq("user_id", userId);

      if (error) throw error;

      // Log the change
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: value ? "GRANT_CONSENT" : "REVOKE_CONSENT",
        scope: field,
        details: { timestamp: new Date().toISOString() },
      });

      setConsents({ ...consents, [field]: value });

      toast({
        title: value ? "Consent granted" : "Consent revoked",
        description: "You can change this anytime in your settings.",
      });

      fetchAuditLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Consent Wallet</h2>
        <p className="text-muted-foreground">Control who can access your health data and for what purpose</p>
      </div>

      {/* Consent Controls */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Database className="h-6 w-6 text-primary mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Share with Research</CardTitle>
                  <Switch
                    checked={consents.share_anonymized}
                    onCheckedChange={(checked) => handleConsentChange("share_anonymized", checked)}
                  />
                </div>
                <CardDescription className="mt-2">
                  Share anonymized metrics to contribute to medical research. Your identity remains private.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Users className="h-6 w-6 text-secondary mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Share with Private Circle</CardTitle>
                  <Switch
                    checked={consents.share_private_circle}
                    onCheckedChange={(checked) => handleConsentChange("share_private_circle", checked)}
                  />
                </div>
                <CardDescription className="mt-2">
                  Allow your trusted contacts to see selected health metrics you've permitted.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Globe className="h-6 w-6 text-accent mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Share with Communities</CardTitle>
                  <Switch
                    checked={consents.share_communities}
                    onCheckedChange={(checked) => handleConsentChange("share_communities", checked)}
                  />
                </div>
                <CardDescription className="mt-2">
                  Contribute aggregated data to communities you've joined. Helps community insights.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>
            Complete history of data access and consent changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activity yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Actor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        log.action.includes("GRANT") ? "default" :
                        log.action.includes("REVOKE") ? "outline" :
                        "secondary"
                      }>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.scope}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.actor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentTab;
