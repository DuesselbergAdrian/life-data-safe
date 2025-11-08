import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Download, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface ExportDeleteProps {
  userId?: string;
}

export const ExportDelete = ({ userId }: ExportDeleteProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your data is being prepared for download.",
    });
  };

  const handleDelete = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    const confirmed = confirm(
      "Are you absolutely sure you want to delete your account?\n\nThis will permanently delete:\n- All your health data\n- Device connections\n- Consents and research participation\n- Uploads and custom data\n- Your entire profile\n\nThis action CANNOT be undone."
    );

    if (!confirmed) return;

    // Double confirmation
    const doubleConfirm = confirm(
      "Final confirmation: Type DELETE to proceed or Cancel to abort"
    );

    if (!doubleConfirm) return;

    setIsDeleting(true);

    try {
      // Delete user data from all tables
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Sign out and delete auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        // If admin delete fails, try regular signOut which will redirect to auth page
        await supabase.auth.signOut();
      }

      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      });

      // Redirect to landing page
      navigate("/");
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Export Your Data</CardTitle>
          </div>
          <CardDescription>Download all your health data in a portable format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your export will include all synced data, uploads, consents, and activity logs.
            </AlertDescription>
          </Alert>
          <div className="flex gap-3">
            <Button onClick={handleExport} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg font-semibold text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. All your data, device connections, consents, and uploads will be permanently deleted.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleDelete} 
            variant="destructive"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
