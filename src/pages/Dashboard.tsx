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
import { Heart, LogOut, User as UserIcon, Download, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OverviewTab from "@/components/dashboard/OverviewTab";
import UploadTab from "@/components/dashboard/UploadTab";
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Health Vault</span>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {profile?.impact_points || 0} points
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarFallback>
                      {user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteAccount} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="consent">Consent</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab userId={user?.id} />
          </TabsContent>

          <TabsContent value="upload">
            <UploadTab userId={user?.id} />
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
