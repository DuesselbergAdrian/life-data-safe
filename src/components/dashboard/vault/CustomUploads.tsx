import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Upload, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const UPLOADS = [
  { name: "Lab Results - Q4 2024.pdf", type: "Lab Report", date: "Dec 15, 2024", size: "1.2 MB" },
  { name: "MRI Scan - Brain.pdf", type: "Imaging", date: "Nov 22, 2024", size: "8.4 MB" },
  { name: "Blood Work - Annual.csv", type: "Lab Report", date: "Oct 10, 2024", size: "124 KB" },
];

export const CustomUploads = () => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload started",
      description: "Your file is being securely uploaded.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Upload Custom Data</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            Securely upload lab results, PDFs, CSVs, or medical reports
          </p>
          <Button onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Choose files
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Supported: PDF, CSV (max 10MB)</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {UPLOADS.map((file, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{file.type}</Badge>
                  <span className="text-xs text-muted-foreground">{file.date}</span>
                  <span className="text-xs text-muted-foreground">• {file.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
