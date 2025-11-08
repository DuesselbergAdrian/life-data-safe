import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsentStepProps {
  userId: string;
  onComplete: (data: any, valid: boolean) => void;
  initialData?: any;
}

export const ConsentStep = ({ userId, onComplete, initialData }: ConsentStepProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(initialData?.acceptedTerms || false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(initialData?.acceptedPrivacy || false);
  const [shareAnonymized, setShareAnonymized] = useState(initialData?.shareAnonymized || false);
  const [sharePrivateCircle, setSharePrivateCircle] = useState(initialData?.sharePrivateCircle || false);
  const { toast } = useToast();

  useEffect(() => {
    loadConsents();
  }, [userId]);

  useEffect(() => {
    const data = { acceptedTerms, acceptedPrivacy, shareAnonymized, sharePrivateCircle };
    const valid = acceptedTerms && acceptedPrivacy;
    onComplete(data, valid);
    
    if (valid) {
      saveConsents();
    }
  }, [acceptedTerms, acceptedPrivacy, shareAnonymized, sharePrivateCircle]);

  const loadConsents = async () => {
    const { data } = await supabase
      .from("consents")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setAcceptedTerms(data.accepted_terms);
      setAcceptedPrivacy(data.accepted_privacy);
      setShareAnonymized(data.share_anonymized);
      setSharePrivateCircle(data.share_private_circle);
    }
  };

  const saveConsents = async () => {
    const { error } = await supabase
      .from("consents")
      .update({
        accepted_terms: acceptedTerms,
        accepted_privacy: acceptedPrivacy,
        share_anonymized: shareAnonymized,
        share_private_circle: sharePrivateCircle,
      })
      .eq("user_id", userId);

    if (!error) {
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "CONSENT_ACCEPT",
        scope: "privacy",
        details: { 
          terms: acceptedTerms, 
          privacy: acceptedPrivacy,
          timestamp: new Date().toISOString() 
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Privacy & Consent</h2>
        <p className="text-muted-foreground">
          Review and accept our terms to continue. You can adjust sharing preferences at any time.
        </p>
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I accept the{" "}
            <a href="/terms" target="_blank" className="text-primary underline">
              Terms of Service
            </a>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <Label htmlFor="privacy" className="text-sm cursor-pointer">
            I accept the{" "}
            <a href="/privacy" target="_blank" className="text-primary underline">
              Privacy Policy
            </a>
          </Label>
        </div>
      </div>

      <div className="bg-accent/50 border rounded-lg p-4">
        <h3 className="font-medium mb-2">What's next?</h3>
        <p className="text-sm text-muted-foreground">
          After completing setup, you'll be able to choose specific research projects to share your data with. Each project offers unique benefits and compensation.
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
        <strong>Demo Notice:</strong> This is a demonstration app. No real medical advice is provided.
      </div>
    </div>
  );
};
