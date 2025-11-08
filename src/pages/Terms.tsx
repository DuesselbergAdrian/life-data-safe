import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Health Vault</span>
          </Link>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Demo Platform Notice</h2>
            <p className="text-muted-foreground">
              Health Vault is a demonstration platform showcasing GDPR-compliant health data management. 
              This is not a production medical system. Do not use for actual health data management.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Health Vault, you accept and agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate information</li>
              <li>Maintain account security</li>
              <li>Use the platform responsibly</li>
              <li>Respect community guidelines</li>
              <li>Do not upload sensitive health data (demo only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Service</h2>
            <p className="text-muted-foreground">
              Health Vault provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Health data storage and management</li>
              <li>Consent management tools</li>
              <li>Community features</li>
              <li>Data export and deletion capabilities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Activities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Uploading malicious files</li>
              <li>Attempting to access others' data</li>
              <li>Violating privacy of community members</li>
              <li>Misrepresenting yourself or your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground">
              You may delete your account at any time. We reserve the right to suspend accounts 
              that violate these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              This is a demonstration platform. We are not liable for any decisions made based on 
              data or insights from this platform. Always consult healthcare professionals for medical advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Questions about these terms: legal@healthvault.example
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
