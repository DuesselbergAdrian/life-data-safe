import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, CheckCircle, Building2, Users, DollarSign, Sparkles, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ResearchProject {
  id: string;
  name: string;
  institute: string;
  description: string;
  data_requested: string[];
  benefits: string[];
  compensation_type: string;
  compensation_value: string;
  participant_count: number;
}

interface ProjectConsent {
  id: string;
  project_id: string;
  status: string;
  consented_at: string;
  data_shared: string[];
}

interface AuditLog {
  action: string;
  scope: string;
  details: any;
  created_at: string;
  actor: string;
}

interface ConsentsManagerProps {
  userId?: string;
}

export const ConsentsManager = ({ userId }: ConsentsManagerProps) => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [userConsents, setUserConsents] = useState<ProjectConsent[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadProjects();
      loadUserConsents();
      loadAuditLogs();
    }
  }, [userId]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .eq("status", "active")
      .order("participant_count", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const loadUserConsents = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("project_consents")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (!error && data) {
      setUserConsents(data);
    }
  };

  const loadAuditLogs = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .in("scope", ["research", "data_export"])
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setAuditLogs(data);
    }
  };

  const hasConsented = (projectId: string) => {
    return userConsents.some(c => c.project_id === projectId && c.status === "active");
  };

  const handleToggleConsent = async (project: ResearchProject) => {
    if (!userId) return;
    
    const existingConsent = userConsents.find(c => c.project_id === project.id);

    if (existingConsent) {
      const { error } = await supabase
        .from("project_consents")
        .update({ 
          status: "revoked",
          revoked_at: new Date().toISOString()
        })
        .eq("id", existingConsent.id);

      if (!error) {
        await supabase.from("audit_logs").insert({
          user_id: userId,
          action: "CONSENT_REVOKE",
          scope: "research",
          details: { project_id: project.id, project_name: project.name }
        });

        setUserConsents(prev => prev.filter(c => c.id !== existingConsent.id));
        loadAuditLogs();
        
        toast({
          title: "Consent revoked",
          description: `You've stopped sharing data with ${project.name}`,
        });
      }
    } else {
      const { data, error } = await supabase
        .from("project_consents")
        .insert({
          user_id: userId,
          project_id: project.id,
          status: "active",
          data_shared: project.data_requested,
        })
        .select()
        .single();

      if (!error && data) {
        await supabase.from("audit_logs").insert({
          user_id: userId,
          action: "CONSENT_GRANT",
          scope: "research",
          details: { 
            project_id: project.id, 
            project_name: project.name,
            data_shared: project.data_requested 
          }
        });

        setUserConsents(prev => [...prev, data]);
        loadAuditLogs();
        
        toast({
          title: "Consent granted",
          description: `You're now contributing to ${project.name}`,
        });
      }
    }
  };

  const toggleExpanded = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const getDataTypeIcon = (dataType: string) => {
    const icons: Record<string, string> = {
      steps: "👟",
      sleep: "😴",
      heart_rate: "❤️",
      location: "📍",
      weight: "⚖️",
      blood_pressure: "🩺",
      mood: "😊",
      stress_level: "😰",
      screen_time: "📱",
      social_interactions: "👥",
      meal_logs: "🍽️",
      glucose: "🩸",
      age: "📅",
      videos: "🎥",
    };
    return icons[dataType] || "📊";
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading research projects...</div>;
  }

  const activeConsentCount = userConsents.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Consents</p>
              <p className="text-2xl font-bold">{activeConsentCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/10 p-2 rounded">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/10 p-2 rounded">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-bold">
                {projects.reduce((sum, p) => sum + p.participant_count, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Research Projects</CardTitle>
          </div>
          <CardDescription>Choose which research projects to contribute your data to</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => {
            const isConsented = hasConsented(project.id);
            const isExpanded = expandedProjects.has(project.id);

            return (
              <div 
                key={project.id}
                className={`p-4 rounded-lg border transition-colors ${isConsented ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        {isConsented && (
                          <Badge variant="default" className="flex items-center gap-1 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-3 w-3" />
                        {project.institute}
                      </p>
                    </div>
                    <Switch 
                      checked={isConsented}
                      onCheckedChange={() => handleToggleConsent(project)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      {project.participant_count.toLocaleString()} participants
                    </Badge>
                    
                    {project.compensation_type === "monetary" && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-700 border-green-200 text-xs">
                        <DollarSign className="h-3 w-3" />
                        {project.compensation_value}
                      </Badge>
                    )}
                    
                    {project.compensation_type === "insights" && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-500/10 text-blue-700 border-blue-200 text-xs">
                        <Sparkles className="h-3 w-3" />
                        {project.compensation_value}
                      </Badge>
                    )}
                  </div>

                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(project.id)}>
                    <CollapsibleTrigger className="w-full">
                      <Button variant="ghost" size="sm" className="w-full flex items-center justify-between h-8">
                        <span className="text-xs">View details</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-3 pt-3">
                      <div>
                        <h5 className="font-medium text-xs mb-1">About this study</h5>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-xs mb-1">Data requested</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {project.data_requested.map((data) => (
                            <Badge key={data} variant="secondary" className="text-xs">
                              <span className="mr-1">{getDataTypeIcon(data)}</span>
                              {data.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-xs mb-1">What you get</h5>
                        <ul className="space-y-1.5">
                          {project.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {activeConsentCount === 0 && (
        <Card className="p-8 text-center border-dashed">
          <div className="max-w-md mx-auto">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active research consents</h3>
            <p className="text-sm text-muted-foreground">
              Start contributing to research projects above to help advance health science and earn benefits.
            </p>
          </div>
        </Card>
      )}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <CardDescription>Track your recent consent actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {auditLogs.length > 0 ? (
            auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">
                    {log.action === "CONSENT_GRANT" ? "Consent granted" : 
                     log.action === "CONSENT_REVOKE" ? "Consent revoked" : 
                     log.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.details?.project_name || log.scope}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1">{log.actor}</Badge>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(log.created_at)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
