import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, TrendingUp, Heart, Lock, CheckCircle } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Health Vault</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Your Health Data,
            <span className="text-primary"> Your Control</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            GDPR-native health data platform. Share on your terms, contribute to research, and build your health community—all while keeping full control.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Start Your Health Vault
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">EU Data Residency</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Human-Centered Health Data
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Consent Wallet</h3>
            <p className="text-muted-foreground">
              Grant and revoke data sharing permissions anytime. Full transparency with audit logs.
            </p>
          </Card>

          <Card className="p-6">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Private Circle</h3>
            <p className="text-muted-foreground">
              Share selected health metrics with trusted people. Up to 100 contacts under your control.
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Impact Dashboard</h3>
            <p className="text-muted-foreground">
              See how your anonymized data contributes to research. Earn impact points and join communities.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to take control?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of people building a healthier future together, one data point at a time.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Health Vault. EU-based, privacy-first health data platform.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            {" · "}
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
