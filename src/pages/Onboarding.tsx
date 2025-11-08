import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, Apple, Watch, Shield, Glasses } from "lucide-react";
import { ProviderTile } from "@/components/ProviderTile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const PROVIDERS = [
  { id: "apple-health", name: "Apple Health", description: "iOS health data", icon: <Apple className="h-6 w-6" /> },
  { id: "android-health", name: "Android Health", description: "Google Fit data", icon: <Shield className="h-6 w-6" /> },
  { id: "apple-watch", name: "Apple Watch", description: "Activity & vitals", icon: <Watch className="h-6 w-6" /> },
  { id: "generic-watch", name: "Other Watch", description: "Bluetooth watch", icon: <Watch className="h-6 w-6" /> },
  { id: "oura", name: "Oura Ring", description: "Sleep & readiness", icon: <Shield className="h-6 w-6" /> },
  { id: "galaxy-ring", name: "Galaxy Ring", description: "Samsung health", icon: <Shield className="h-6 w-6" /> },
  { id: "meta-glasses", name: "Meta Glasses", description: "Biometrics", icon: <Glasses className="h-6 w-6" /> },
  { id: "google-glasses", name: "Google Glasses", description: "Activity data", icon: <Glasses className="h-6 w-6" /> },
];

const Onboarding = () => {
  const [step, setStep] = useState<"select" | "authorize" | "complete">("select");
  const [selected, setSelected] = useState<string[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
  };

  const toggleProvider = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConnect = async (providerId: string) => {
    if (!userId) return;
    
    try {
      await supabase.from("device_connections").insert({
        user_id: userId,
        provider: providerId,
        status: "connected",
        access_token: "mock_token",
        metrics_json: {}
      });

      setConnected(prev => [...prev, providerId]);
      
      toast({
        title: "Connected",
        description: `${PROVIDERS.find(p => p.id === providerId)?.name} connected successfully.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async () => {
    if (!userId) return;
    
    try {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
      
      toast({
        title: "All set",
        description: "Your data will start syncing.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  if (step === "select") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Connect your sources</h1>
            <p className="text-muted-foreground">Pick what you use. We'll guide the setup.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROVIDERS.map(provider => (
              <ProviderTile
                key={provider.id}
                name={provider.name}
                description={provider.description}
                icon={provider.icon}
                selected={selected.includes(provider.id)}
                onClick={() => toggleProvider(provider.id)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Skip for now
            </Button>
            <Button 
              size="lg" 
              onClick={() => setStep("authorize")}
              disabled={selected.length === 0}
              className="min-w-32"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "authorize") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Authorize & sync</h2>
            <p className="text-muted-foreground">Complete setup for each source</p>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {selected.map(providerId => {
              const provider = PROVIDERS.find(p => p.id === providerId)!;
              const isConnected = connected.includes(providerId);
              
              return (
                <AccordionItem key={providerId} value={providerId} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      {provider.icon}
                      <span className="font-medium">{provider.name}</span>
                      {isConnected && (
                        <Badge variant="outline" className="ml-auto mr-2 bg-primary/10 border-primary/20">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Open the {provider.name} app on your device</li>
                      <li>Grant read permissions for health metrics</li>
                      <li>Confirm background sync is enabled</li>
                    </ol>
                    {!isConnected ? (
                      <Button onClick={() => handleConnect(providerId)} size="sm">
                        Authorize
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        Manage permissions
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Card className="p-6 bg-muted/30 border-muted">
            <h3 className="font-semibold mb-2">Upload a video (optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a short video for motion or form analysis. Skip anytime.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Upload video</Button>
              <Button variant="ghost" size="sm">Skip for now</Button>
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button 
              onClick={() => setStep("complete")}
              disabled={connected.length === 0}
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">All set</h2>
          <p className="text-muted-foreground">Your data will start syncing.</p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <Button size="lg" onClick={handleComplete}>
            Go to dashboard
          </Button>
          <Button variant="link" size="sm">
            Manage connections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
