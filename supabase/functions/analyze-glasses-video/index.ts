import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { video_base64, file_extension } = await req.json();

    console.log('Analyzing glasses video, extension:', file_extension);

    const response = await fetch('https://a040a4ddeb66.ngrok-free.app/analyze/base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_base64,
        file_extension,
        max_workers: 5
      }),
    });

    if (!response.ok) {
      console.error('API error:', response.status, await response.text());
      throw new Error('Failed to analyze video');
    }

    const data = await response.json();
    console.log('Analysis complete:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-glasses-video function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze video';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
