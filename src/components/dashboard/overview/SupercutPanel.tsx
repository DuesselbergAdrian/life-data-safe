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
        setVideoUrl('https://player.cloudinary.com/embed/?cloud_name=diqe550vg&public_id=Min_film_2_eo7mxx&profile=cld-default');
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
        
        <div className="relative rounded-xl overflow-hidden bg-muted shadow-lg mx-auto" style={{ aspectRatio: '9/16', maxWidth: '400px' }}>
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
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
