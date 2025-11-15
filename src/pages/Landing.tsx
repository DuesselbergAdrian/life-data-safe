import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Lock } from "lucide-react";
import { DataUnificationAnimation } from "@/components/landing/DataUnificationAnimation";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Health Vault</span>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/onboarding">Sync data</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/privacy">Privacy</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 h-[80vh] flex flex-col items-center justify-center">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <DataUnificationAnimation />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Your health, unified.
          </h1>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8" asChild>
              <Link to="/onboarding">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">View demo</Link>
            </Button>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Take control of your health data. Unified, secure, and entirely yours.
          </p>
        </div>
      </section>

      {/* Problem & Vision Section */}
      <section className="container mx-auto px-6 py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
                The Problem
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Data locked in silos</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every day, Europeans generate millions of health data points—from clinics, wearables, and daily life. 
                But that data is locked away in silos, disconnected from the people who created it.
              </p>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="h-4 w-4" />
                Our Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Your personal health vault</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Health Vault is Europe's platform for storing and managing personal health data—a personal, encrypted vault 
                where your medical, wearable, and lifestyle data finally live together under your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Built on European values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Lock className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Privacy-first</h3>
              <p className="text-muted-foreground">Your data stays yours. Encrypted, secure, and under your complete control.</p>
            </div>
            <div className="space-y-3">
              <Shield className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">GDPR compliant</h3>
              <p className="text-muted-foreground">Built for Europe, respecting the highest standards of data protection.</p>
            </div>
            <div className="space-y-3">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">You decide</h3>
              <p className="text-muted-foreground">Choose what to share, with whom, and for how long. Always reversible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Strip */}
      <section className="container mx-auto px-6 py-16">
        <Card className="p-8 max-w-4xl mx-auto bg-muted/30 border-primary/20">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold">You're in control</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Edit permissions or disconnect any time. Your data, your rules.
              </p>
              <div className="flex gap-4 pt-2">
                <Button variant="link" size="sm" className="px-0">Manage connections</Button>
                <Button variant="link" size="sm" className="px-0">Export data</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Health Vault · EU-based, privacy-first
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
