import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, TrendingUp, Heart, Lock, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-comic-street.jpg";

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
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Person on street using Meta smart glasses, AirPods, and smartwatch to collect and manage health data on mobile device" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-32 min-h-[90vh] flex items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                Real-world health data collection
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              Collect. Control.
              <span className="text-primary block mt-2">Contribute.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Your Meta glasses, AirPods, smartwatch—all your wearables working together. Capture health data seamlessly as you live, manage it on your terms, and contribute to research that matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-xl transition-all">
                  Start Your Health Vault
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:bg-primary/10">
                See How It Works
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>EU Data Residency</span>
              </div>
            </div>
          </div>
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
          <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Consent Wallet</h3>
            <p className="text-muted-foreground">
              Grant and revoke data sharing permissions anytime. Full transparency with audit logs.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Private Circle</h3>
            <p className="text-muted-foreground">
              Share selected health metrics with trusted people. Up to 100 contacts under your control.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <TrendingUp className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Impact Dashboard</h3>
            <p className="text-muted-foreground">
              See how your anonymized data contributes to research. Earn impact points and join communities.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to take control?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of people building a healthier future together, one data point at a time.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-xl transition-all">
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
