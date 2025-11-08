import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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

const ConsentTab = ({ userId }: { userId?: string }) => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [userConsents, setUserConsents] = useState<ProjectConsent[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadProjects();
      loadUserConsents();
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

  const hasConsented = (projectId: string) => {
    return userConsents.some(c => c.project_id === projectId && c.status === "active");
  };

  const handleToggleConsent = async (project: ResearchProject) => {
    if (!userId) return;
    
    const existingConsent = userConsents.find(c => c.project_id === project.id);

    if (existingConsent) {
      // Revoke consent
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
        
        toast({
          title: "Consent revoked",
          description: `You've stopped sharing data with ${project.name}`,
        });
      }
    } else {
      // Grant consent
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
        
        toast({
          title: "Consent granted! 🎉",
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

  if (loading) {
    return <div className="text-center py-8">Loading research projects...</div>;
  }

  const activeConsentCount = userConsents.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Research Consent Wallet</h2>
        <p className="text-muted-foreground">
          Choose which research projects to contribute your health data to. Each project offers unique benefits and compensation.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded">
              <CheckCircle2 className="h-5 w-5 text-primary" />
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

      {/* Research Projects */}
      <div className="space-y-4">
        {projects.map((project) => {
          const isConsented = hasConsented(project.id);
          const isExpanded = expandedProjects.has(project.id);

          return (
            <Card key={project.id} className={`p-6 ${isConsented ? "border-primary bg-primary/5" : ""}`}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      {isConsented && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {project.institute}
                    </p>
                  </div>
                  <Switch
                    checked={isConsented}
                    onCheckedChange={() => handleToggleConsent(project)}
                  />
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.participant_count.toLocaleString()} participants
                  </Badge>
                  
                  {project.compensation_type === "monetary" && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-700 border-green-200">
                      <DollarSign className="h-3 w-3" />
                      {project.compensation_value}
                    </Badge>
                  )}
                  
                  {project.compensation_type === "insights" && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-blue-500/10 text-blue-700 border-blue-200">
                      <Sparkles className="h-3 w-3" />
                      {project.compensation_value}
                    </Badge>
                  )}
                </div>

                {/* Expandable Details */}
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(project.id)}>
                  <CollapsibleTrigger className="w-full">
                    <Button variant="ghost" size="sm" className="w-full flex items-center justify-between">
                      <span className="text-sm">View details</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-medium mb-2">About this study</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Data requested</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.data_requested.map((data) => (
                          <Badge key={data} variant="secondary">
                            <span className="mr-1">{getDataTypeIcon(data)}</span>
                            {data.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">What you get</h4>
                      <ul className="space-y-2">
                        {project.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
};

export default ConsentTab;
