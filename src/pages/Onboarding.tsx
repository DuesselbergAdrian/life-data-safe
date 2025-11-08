import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ConsentStep } from "@/components/onboarding/ConsentStep";
import { ProfileStep } from "@/components/onboarding/ProfileStep";
import { DeviceStep } from "@/components/onboarding/DeviceStep";
import { VideoStep } from "@/components/onboarding/VideoStep";

const STEPS = [
  { id: 1, name: "Consent", component: ConsentStep },
  { id: 2, name: "Profile", component: ProfileStep },
  { id: 3, name: "Devices", component: DeviceStep },
  { id: 4, name: "Video", component: VideoStep },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [stepData, setStepData] = useState<Record<number, any>>({});
  const [canContinue, setCanContinue] = useState(false);
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
    
    // Check if already completed
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", session.user.id)
      .single();
    
    if (profile?.onboarding_completed) {
      navigate("/dashboard");
    }
  };

  const handleStepComplete = (stepId: number, data: any, valid: boolean) => {
    setStepData(prev => ({ ...prev, [stepId]: data }));
    setCanContinue(valid);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setCanContinue(false);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);
      
      if (error) throw error;
      
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "ONBOARDING_COMPLETE",
        scope: "account",
        details: { completed_at: new Date().toISOString() }
      });
      
      toast({
        title: "Welcome to Health Vault!",
        description: "Your account is ready to use.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Health Vault</h1>
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {step.id}
                </div>
                <div className={`flex-1 text-sm font-medium ml-2 ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.name}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 w-full mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {userId && (
            <CurrentStepComponent
              userId={userId}
              onComplete={(data: any, valid: boolean) => handleStepComplete(currentStep, data, valid)}
              initialData={stepData[currentStep]}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canContinue}
          >
            {currentStep === STEPS.length ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
