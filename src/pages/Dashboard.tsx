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
import { LogOut, Download, Trash2, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OverviewMain from "@/components/dashboard/OverviewMain";
import DataVaultMain from "@/components/dashboard/DataVaultMain";
import SocialImpactMain from "@/components/dashboard/SocialImpactMain";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData && !profileData.onboarding_completed) {
        navigate("/onboarding");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    getSessionAndProfile();

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

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-vault-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });

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
    if (!user?.id) return;

    const confirmed = confirm(
      "Are you absolutely sure you want to delete your account?\n\nThis will permanently delete:\n- All your health data\n- Device connections\n- Consents and research participation\n- Uploads and custom data\n- Your entire profile\n\nThis action CANNOT be undone."
    );

    if (!confirmed) return;

    // Double confirmation
    const doubleConfirm = confirm(
      "Final confirmation: Click OK to permanently delete your account"
    );

    if (!doubleConfirm) return;

    try {
      // Delete user profile and related data
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Sign out (deletion cascades will handle related records)
      await supabase.auth.signOut();

      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account. Please try signing out and contacting support.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Health Vault</span>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-medium bg-primary/5">
              {profile?.impact_points || 0} pts
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
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
          <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 p-1 backdrop-blur">
            <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
            <TabsTrigger value="vault" className="text-sm font-medium">Data Vault</TabsTrigger>
            <TabsTrigger value="social" className="text-sm font-medium">Social & Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewMain userId={user?.id} />
          </TabsContent>

          <TabsContent value="vault">
            <DataVaultMain userId={user?.id} />
          </TabsContent>

          <TabsContent value="social">
            <SocialImpactMain userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Button 
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-glass h-14 px-6"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Data
      </Button>
    </div>
  );
};

export default Dashboard;
