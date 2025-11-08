import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FileText, Upload, Download, Share2, Trash2, Video, Glasses, Info, CheckCircle2, Smartphone, Bluetooth } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const UPLOADS = [
  { name: "Lab Results - Q4 2024.pdf", type: "Lab Report", date: "Dec 15, 2024", size: "1.2 MB" },
  { name: "MRI Scan - Brain.pdf", type: "Imaging", date: "Nov 22, 2024", size: "8.4 MB" },
  { name: "Blood Work - Annual.csv", type: "Lab Report", date: "Oct 10, 2024", size: "124 KB" },
];

export const CustomUploads = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    toast({
      title: "Upload started",
      description: "Your file is being securely uploaded.",
    });
  };

  const handleMetaGlassesUpload = async () => {
    setUploading(true);
    
    // Simulating API call - replace with actual API endpoint
    toast({
      title: "Processing Meta glasses video",
      description: "Analyzing your video for health insights...",
    });

    // Expected API call structure:
    // const formData = new FormData();
    // formData.append('video', videoFile);
    // 
    // const response = await fetch('/api/analyze-glasses-video', {
    //   method: 'POST',
    //   body: formData
    // });
    // 
    // const result = await response.json();
    
    // Expected JSON response structure:
    const expectedResponse = {
      recommendations: [
        {
          id: "rec_001",
          type: "exercise",
          title: "Increase daily movement",
          description: "Based on your activity patterns, consider adding 15 minutes of walking after meals",
          priority: "medium",
          evidence: ["low_step_count", "extended_sitting_periods"]
        },
        {
          id: "rec_002", 
          type: "sleep",
          title: "Optimize sleep schedule",
          description: "Your sleep consistency could improve. Try maintaining the same bedtime",
          priority: "high",
          evidence: ["irregular_sleep_times", "morning_fatigue_indicators"]
        },
        {
          id: "rec_003",
          type: "nutrition",
          title: "Hydration reminder",
          description: "Video analysis suggests low hydration levels. Aim for 8 glasses daily",
          priority: "low",
          evidence: ["environment_indicators", "activity_level"]
        }
      ],
      activities: [
        {
          id: "act_001",
          type: "walking",
          start_time: "2025-01-08T14:30:00Z",
          end_time: "2025-01-08T15:15:00Z",
          duration_minutes: 45,
          intensity: "moderate",
          location: "outdoor",
          steps_estimated: 5200,
          calories_burned: 220
        },
        {
          id: "act_002",
          type: "social_interaction",
          start_time: "2025-01-08T12:00:00Z",
          end_time: "2025-01-08T12:45:00Z",
          duration_minutes: 45,
          participants_count: 3,
          interaction_quality: "positive"
        }
      ],
      health_metrics: {
        stress_indicators: {
          level: "low",
          confidence: 0.78,
          factors: ["calm_environment", "steady_movements", "positive_interactions"]
        },
        mood_assessment: {
          primary_mood: "content",
          confidence: 0.82,
          secondary_moods: ["engaged", "focused"]
        },
        environmental_context: {
          lighting: "natural_bright",
          noise_level: "moderate",
          setting: "outdoor_urban"
        },
        physical_indicators: {
          posture_quality: "good",
          movement_steadiness: "stable",
          fatigue_level: "low"
        },
        screen_time_estimate: {
          duration_minutes: 12,
          context: "navigation_and_photos"
        }
      },
      metadata: {
        video_duration_seconds: 180,
        analysis_timestamp: "2025-01-08T16:00:00Z",
        model_version: "v2.1.0",
        confidence_score: 0.85
      }
    };

    console.log("Expected API Response Structure:", JSON.stringify(expectedResponse, null, 2));
    
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Analysis complete",
        description: "Your Meta glasses video has been processed successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Meta Glasses Sync Instructions */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Glasses className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Sync Meta Glasses</CardTitle>
          </div>
          <CardDescription>Import videos and photos from your Ray-Ban Meta or Oakley Meta glasses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Auto-import is enabled by default</strong> for Android 13+ and iOS devices when using the Meta AI mobile app.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Manual import steps:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bluetooth className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Enable Bluetooth & pair glasses</p>
                  <p className="text-xs text-muted-foreground">Ensure Bluetooth is on and glasses are paired with the Meta AI mobile app</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Smartphone className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Open Meta AI mobile app</p>
                  <p className="text-xs text-muted-foreground">Tap the profile icon in bottom right corner</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Upload className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Import media</p>
                  <p className="text-xs text-muted-foreground">If you have unimported captures, tap "Import" next to Gallery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Access your media</p>
                  <p className="text-xs text-muted-foreground">Once imported to your phone's photo app, upload videos here for analysis</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Glasses Video Upload */}
      <Card className="glass border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Upload Meta Glasses Videos</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            Upload videos from your Meta glasses for AI-powered health insights and activity tracking
          </p>
          <Button onClick={handleMetaGlassesUpload} disabled={uploading}>
            <Video className="h-4 w-4 mr-2" />
            {uploading ? "Processing..." : "Upload glasses video"}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Supported: MP4, MOV (max 100MB)</p>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/30 max-w-md">
            <p className="text-xs font-medium mb-2">What we analyze:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Activities & movement</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Stress indicators</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Mood assessment</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Environmental context</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Social interactions</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Personalized tips</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regular File Upload */}
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
