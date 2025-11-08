import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FileText, Upload, Download, Share2, Trash2, Video, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const UPLOADS = [
  { name: "Lab Results - Q4 2024.pdf", type: "Lab Report", date: "Dec 15, 2024", size: "1.2 MB" },
  { name: "MRI Scan - Brain.pdf", type: "Imaging", date: "Nov 22, 2024", size: "8.4 MB" },
  { name: "Blood Work - Annual.csv", type: "Lab Report", date: "Oct 10, 2024", size: "124 KB" },
];

interface AnalysisResult {
  activity: string;
  type_of_food: string[];
  nutrients: {
    calories_kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g: number;
    sodium_mg: number;
  };
  health_metrics: {
    minutes_active: number;
    steps: number;
    sleep_hours: number;
    heart_rate_resting: number;
    sbp: number;
    dbp: number;
    weight_kg: number;
    bmi: number;
  };
  health_score: number;
}

export const CustomUploads = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    toast({
      title: "Upload started",
      description: "Your file is being securely uploaded.",
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:video/mp4;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleMetaGlassesUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, MOV)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setAnalysisResult(null);

    try {
      // Create video URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      toast({
        title: "Processing video",
        description: "Converting and analyzing your video...",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 2000);

      // Convert to base64
      setProgress(20);
      const base64Video = await convertToBase64(file);
      
      // Get file extension
      const fileExtension = '.' + file.name.split('.').pop();

      setProgress(40);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('analyze-glasses-video', {
        body: {
          video_base64: base64Video,
          file_extension: fileExtension,
        }
      });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      setProgress(100);
      setAnalysisResult(data);

      toast({
        title: "Analysis complete",
        description: "Your video has been processed successfully",
      });
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze video. Please try again.",
        variant: "destructive",
      });
      setVideoUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadAnother = () => {
    setAnalysisResult(null);
    setVideoUrl(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Meta Glasses Video Upload/Results */}
      {!analysisResult ? (
        <Card className="glass border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            {uploading ? (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Processing Video</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                  Analyzing your video for health insights...
                </p>
                <div className="w-full max-w-md px-8">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center mt-2">{progress}% complete</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Meta Glasses Videos</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                  Upload videos from your Meta glasses for AI-powered health insights and activity tracking
                </p>
                <Button onClick={handleMetaGlassesUpload}>
                  <Video className="h-4 w-4 mr-2" />
                  Upload glasses video
                </Button>
                <p className="text-xs text-muted-foreground mt-3">Supported: MP4, MOV (max 100MB)</p>
                
                <div className="mt-6 p-4 rounded-lg bg-muted/30 max-w-md">
                  <p className="text-xs font-medium mb-2">What we analyze:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <span>Food & nutrition</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <span>Activity tracking</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <span>Health metrics</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <span>Health score</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
              <Button variant="outline" size="sm" onClick={handleUploadAnother}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Upload Another
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Preview */}
            {videoUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full max-h-96"
                />
              </div>
            )}

            {/* Activity & Health Score */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Activity</p>
                  <p className="text-2xl font-bold capitalize">{analysisResult.activity}</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                  <p className="text-2xl font-bold">{analysisResult.health_score}/100</p>
                </CardContent>
              </Card>
            </div>

            {/* Food Types */}
            {analysisResult.type_of_food.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Food Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.type_of_food.map((food, idx) => (
                    <Badge key={idx} variant="secondary" className="capitalize">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrients */}
            <div>
              <h4 className="font-semibold mb-3">Nutritional Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.calories_kcal} kcal</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.protein_g}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.carbs_g}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.fat_g}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Fiber</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.fiber_g}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Sugar</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.sugar_g}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Sodium</p>
                  <p className="text-lg font-semibold">{analysisResult.nutrients.sodium_mg}mg</p>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div>
              <h4 className="font-semibold mb-3">Health Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {analysisResult.health_metrics.minutes_active > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Active Minutes</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.minutes_active}</p>
                  </div>
                )}
                {analysisResult.health_metrics.steps > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Steps</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.steps}</p>
                  </div>
                )}
                {analysisResult.health_metrics.sleep_hours > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Sleep</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.sleep_hours}h</p>
                  </div>
                )}
                {analysisResult.health_metrics.heart_rate_resting > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Resting HR</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.heart_rate_resting} bpm</p>
                  </div>
                )}
                {analysisResult.health_metrics.sbp > 0 && analysisResult.health_metrics.dbp > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.sbp}/{analysisResult.health_metrics.dbp}</p>
                  </div>
                )}
                {analysisResult.health_metrics.weight_kg > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.weight_kg} kg</p>
                  </div>
                )}
                {analysisResult.health_metrics.bmi > 0 && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">BMI</p>
                    <p className="text-lg font-semibold">{analysisResult.health_metrics.bmi}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
