import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Film, Loader2 } from "lucide-react";

interface SupercutPanelProps {
  delayMs?: number;
}

export const SupercutPanel = ({ delayMs = 3500 }: SupercutPanelProps) => {
  const [state, setState] = useState<'preparing' | 'loading' | 'ready'>('preparing');
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const prepTimer = setTimeout(() => {
      setState('loading');
      
      // Simulate video generation/loading
      const loadTimer = setTimeout(() => {
        // Mock video URL - replace with actual Supabase URL
        setVideoUrl('https://yoqsviiqmkdeurzipdmq.supabase.co/storage/v1/object/public/supercuts/today.mp4');
        setState('ready');
      }, 2000);

      return () => clearTimeout(loadTimer);
    }, delayMs);

    return () => clearTimeout(prepTimer);
  }, [delayMs]);

  if (state === 'preparing') {
    return null;
  }

  if (state === 'loading') {
    return (
      <Card className="glass p-6">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm">Creating a 20-second supercut of your day's highlights...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Supercut of Today</h3>
        </div>
        
        <div className="relative rounded-xl overflow-hidden bg-muted aspect-video shadow-lg">
          {videoUrl ? (
            <video 
              controls 
              muted 
              className="w-full h-full"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Film className="h-12 w-12 animate-pulse" />
                <p className="text-sm">Loading your supercut...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
