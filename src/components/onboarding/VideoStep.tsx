import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, Sparkles, CheckCircle2 } from "lucide-react";

interface VideoStepProps {
  userId: string;
  onComplete: (data: any, valid: boolean) => void;
  initialData?: any;
}

export const VideoStep = ({ userId, onComplete, initialData }: VideoStepProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [hasUpload, setHasUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingUploads();
  }, [userId]);

  useEffect(() => {
    onComplete({ hasUpload, aiSummary }, hasUpload);
  }, [hasUpload, aiSummary]);

  const checkExistingUploads = async () => {
    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (data && data.length > 0) {
      setHasUpload(true);
      setVideoUrl(data[0].url);
      setAiSummary(typeof data[0].ai_summary === 'string' ? data[0].ai_summary : null);
      setVideoMetadata({
        size: data[0].size_bytes,
        duration: data[0].duration_seconds,
        type: data[0].mime_type,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const maxSize = 200 * 1024 * 1024; // 200MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4, MOV, or WEBM file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 200MB.",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("health-videos")
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("health-videos")
        .getPublicUrl(fileName);

      // Get video duration
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = async () => {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);

        // Save to database
        const { error: dbError } = await supabase.from("uploads").insert({
          user_id: userId,
          url: publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
          duration_seconds: duration,
          title: file.name,
        });

        if (!dbError) {
          await supabase.from("audit_logs").insert({
            user_id: userId,
            action: "UPLOAD",
            scope: "content",
            details: { filename: file.name, size: file.size, duration }
          });

          setVideoUrl(publicUrl);
          setVideoMetadata({
            size: file.size,
            duration,
            type: file.type,
          });
          setHasUpload(true);

          toast({
            title: "Video uploaded! 🎉",
            description: "Your demo video has been successfully uploaded.",
          });
        }
      };
      video.src = URL.createObjectURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const generateAISummary = async () => {
    // Mock AI summary generation
    const summaries = [
      "Great workout session! Detected high-intensity cardio with consistent heart rate elevation. Keep up the excellent work!",
      "Noticed steady improvement in form and endurance. Your breathing technique looks much better compared to last session.",
      "Excellent flexibility demonstrated throughout the routine. Consider adding more strength training to your regimen.",
      "Strong performance with good recovery intervals. Your heart rate variability indicates improving cardiovascular fitness.",
    ];

    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { error } = await supabase
      .from("uploads")
      .update({ ai_summary: randomSummary })
      .eq("user_id", userId)
      .eq("url", videoUrl);

    if (!error) {
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "AI_SUMMARY",
        scope: "content",
        details: { summary: randomSummary }
      });

      setAiSummary(randomSummary);
      toast({
        title: "Summary generated!",
        description: "AI has analyzed your video.",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload Demo Video</h2>
        <p className="text-muted-foreground">
          Upload a short health or fitness video to complete your setup.
        </p>
      </div>

      {!hasUpload ? (
        <Card className="p-8 border-dashed border-2">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary/10 p-6 rounded-full">
              <Upload className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Upload your video</h3>
              <p className="text-sm text-muted-foreground">
                MP4, MOV, or WEBM • Max 200MB
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Select Video"}
            </Button>
            {uploading && (
              <div className="w-full">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">Video uploaded</h3>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                {videoMetadata && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Size: {formatBytes(videoMetadata.size)}</p>
                    <p>Duration: {videoMetadata.duration}s</p>
                    <p>Type: {videoMetadata.type}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {!aiSummary ? (
            <Button onClick={generateAISummary} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Demo Summary
            </Button>
          ) : (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">AI Summary</h4>
                  <p className="text-sm text-muted-foreground">{aiSummary}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
