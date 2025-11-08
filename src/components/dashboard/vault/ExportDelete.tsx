import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Download, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ExportDelete = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your data is being prepared for download.",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      toast({
        title: "Deletion requested",
        description: "Your account deletion request has been logged.",
        variant: "destructive",
      });
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
          <CardDescription>Permanently delete your Health Vault account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. All your data, consents, and uploads will be permanently deleted.
            </AlertDescription>
          </Alert>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
