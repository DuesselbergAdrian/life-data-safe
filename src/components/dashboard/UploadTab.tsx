import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, CheckCircle, Loader2, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadTabProps {
  userId?: string;
}

const UploadTab = ({ userId }: UploadTabProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUploads();
    }
  }, [userId]);

  const fetchUploads = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setUploads(data || []);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file
    const maxSize = 200 * 1024 * 1024; // 200MB
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 200MB",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only MP4, MOV, and WEBM files are supported",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("health-videos")
        .upload(fileName, file);

      clearInterval(progressInterval);
      setProgress(100);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("health-videos")
        .getPublicUrl(fileName);

      // Save metadata
      const { error: dbError } = await supabase.from("uploads").insert({
        user_id: userId,
        url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        title: file.name,
      });

      if (dbError) throw dbError;

      // Log the upload
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "UPLOAD",
        scope: "video",
        details: { file_name: file.name, size: file.size },
      });

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded",
      });

      fetchUploads();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSummarizeAI = async (uploadId: string) => {
    toast({
      title: "AI Summary (Demo)",
      description: "In production, this would analyze your video and provide insights.",
    });

    // Mock AI summary
    const mockSummary = {
      heard: [
        "Described symptoms clearly",
        "Mentioned recent lifestyle changes",
        "Expressed concerns about energy levels",
      ],
      nextStep: "Consider tracking your sleep patterns for the next week. Note any changes in energy levels.",
    };

    await supabase
      .from("uploads")
      .update({ ai_summary: mockSummary })
      .eq("id", uploadId);

    fetchUploads();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Upload Health Videos</h2>
        <p className="text-muted-foreground">Share short clips explaining symptoms or documenting your health journey</p>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            Max 200MB • MP4, MOV, or WEBM formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading...</p>
                  <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop your video here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload videos to get AI-powered health insights
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Uploads List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Uploads</h3>
        {uploads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No uploads yet. Upload your first video to get started!</p>
            </CardContent>
          </Card>
        ) : (
          uploads.map((upload) => (
            <Card key={upload.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{upload.title}</CardTitle>
                    <CardDescription>
                      {new Date(upload.created_at).toLocaleDateString()} • 
                      {(upload.size_bytes / (1024 * 1024)).toFixed(2)} MB
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedVideo(selectedVideo === upload.id ? null : upload.id)}
                >
                  {selectedVideo === upload.id ? (
                    <video src={upload.url} controls className="w-full h-full rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to play</p>
                    </div>
                  )}
                </div>

                {upload.ai_summary ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">What I heard:</h4>
                      <ul className="space-y-1">
                        {upload.ai_summary.heard.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Next tiny step:</h4>
                      <p className="text-sm text-muted-foreground">{upload.ai_summary.nextStep}</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSummarizeAI(upload.id)}
                  >
                    Summarize with AI (demo)
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadTab;
