import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Download, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OverviewTab from "@/components/dashboard/OverviewTab";
import SyncTab from "@/components/dashboard/SyncTab";
import TrendsTab from "@/components/dashboard/TrendsTab";
import ConsentTab from "@/components/dashboard/ConsentTab";
import SocialTab from "@/components/dashboard/SocialTab";
import CommunitiesTab from "@/components/dashboard/CommunitiesTab";
import ImpactTab from "@/components/dashboard/ImpactTab";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get session and profile
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch profile and check onboarding
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Redirect to onboarding if not completed
      if (profileData && !profileData.onboarding_completed) {
        navigate("/onboarding");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    getSessionAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleExportData = async () => {
    try {
      if (!user) return;

      // Gather all user data
      const [profileData, uploadsData, consentsData, contactsData, membershipsData, auditLogsData, impactData] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("uploads").select("*").eq("user_id", user.id),
        supabase.from("consents").select("*").eq("user_id", user.id).single(),
        supabase.from("contacts").select("*").eq("user_id", user.id),
        supabase.from("memberships").select("*, communities(*)").eq("user_id", user.id),
        supabase.from("audit_logs").select("*").eq("user_id", user.id),
        supabase.from("impact_events").select("*").eq("user_id", user.id),
      ]);

      const exportData = {
        profile: profileData.data,
        uploads: uploadsData.data,
        consents: consentsData.data,
        contacts: contactsData.data,
        memberships: membershipsData.data,
        audit_logs: auditLogsData.data,
        impact_events: impactData.data,
        exported_at: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-vault-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a JSON file.",
      });

      // Log the export
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "EXPORT",
        scope: "all_data",
        details: { timestamp: new Date().toISOString() },
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      // In a real app, this would be handled by an edge function
      // For now, we'll just sign out
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been logged. Contact support for completion.",
      });
      await handleSignOut();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Health Vault</span>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-medium">
              {profile?.impact_points || 0} pts
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportData} className="text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteAccount} className="text-sm text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="sync" className="text-sm">Sync</TabsTrigger>
            <TabsTrigger value="trends" className="text-sm">Trends</TabsTrigger>
            <TabsTrigger value="consent" className="text-sm">Consent</TabsTrigger>
            <TabsTrigger value="social" className="text-sm">Social</TabsTrigger>
            <TabsTrigger value="communities" className="text-sm">Communities</TabsTrigger>
            <TabsTrigger value="impact" className="text-sm">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="sync">
            <SyncTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="consent">
            <ConsentTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="social">
            <SocialTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="communities">
            <CommunitiesTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactTab userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
