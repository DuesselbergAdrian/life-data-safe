import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Demo Notice</h2>
            <p className="text-muted-foreground">
              This is a demonstration platform. While we implement GDPR-compliant patterns, 
              this is not a production healthcare system. Do not upload sensitive personal health information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Email address and authentication credentials</li>
              <li>Profile information you provide</li>
              <li>Video files and metadata you upload</li>
              <li>Consent preferences and audit logs</li>
              <li>Community membership and interaction data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide the Health Vault service</li>
              <li>To respect your consent preferences</li>
              <li>To enable community features you choose</li>
              <li>Only with your explicit consent for research or sharing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights (GDPR)</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> Export all your data anytime</li>
              <li><strong>Rectification:</strong> Update your information</li>
              <li><strong>Erasure:</strong> Delete your account and data</li>
              <li><strong>Portability:</strong> Download in JSON format</li>
              <li><strong>Object:</strong> Revoke consent anytime</li>
              <li><strong>Transparency:</strong> View audit logs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="text-muted-foreground">
              Data is stored in EU-region cloud infrastructure. Video files are stored 
              in secure object storage with access limited to your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="text-muted-foreground">
              We never share your data without explicit consent. You control:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Whether to share anonymized data with research</li>
              <li>Which metrics your Private Circle can see</li>
              <li>Whether to contribute aggregated data to Communities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              For privacy questions: privacy@healthvault.example
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
