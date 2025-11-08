import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity, Moon, Zap, Shield, Lock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";
import heroImage from "@/assets/hero-health-unified.jpg";
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
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8" asChild>
              <Link to="/onboarding">Sync data</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/auth">Explore demo</Link>
            </Button>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Own your data. See it live. Sync from the devices you already use.
          </p>
        </div>
      </section>

      {/* Problem & Vision Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-2">
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
                Problem
              </div>
              <h2 className="text-3xl font-bold">Data locked in silos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every day, Europeans generate millions of data points — from clinics, wearables, and daily life.
                But that data is locked away in silos, disconnected from the people who created it.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Lock className="h-3 w-3" />
                Vision
              </div>
              <h2 className="text-3xl font-bold">Your personal health vault</h2>
              <p className="text-muted-foreground leading-relaxed">
                Health Vault is Europe's platform for storing and managing personal health data — a personal, encrypted vault where your medical, wearable, and lifestyle data finally live together under your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Demo */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <StatCard 
            title="Today" 
            value="8,432" 
            unit="steps"
            delta={12}
            sparklineData={[65, 72, 68, 80, 75, 85, 90]}
          />
          <StatCard 
            title="Sleep" 
            value="7.2" 
            unit="hours"
            delta={-5}
            sparklineData={[7, 6.5, 7.2, 8, 7.5, 6.8, 7.2]}
          />
          <StatCard 
            title="Readiness" 
            value="87" 
            unit="%"
            delta={3}
            sparklineData={[80, 82, 85, 87, 84, 86, 87]}
          />
          <StatCard 
            title="Heart" 
            value="62" 
            unit="bpm"
            sparklineData={[65, 63, 61, 62, 64, 63, 62]}
          />
        </div>
      </section>

      {/* Live Stream */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent updates</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs">All</Button>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Apple</Button>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Oura</Button>
            </div>
          </div>
          <Card className="p-6">
            <ActivityItem 
              source="Oura Ring" 
              action="Sleep synced" 
              time="06:42"
              icon={<Moon className="h-8 w-8 p-2 rounded-full bg-primary/10 text-primary" />}
            />
            <ActivityItem 
              source="Apple Watch" 
              action="Activity recorded" 
              time="08:15"
              icon={<Activity className="h-8 w-8 p-2 rounded-full bg-primary/10 text-primary" />}
            />
            <ActivityItem 
              source="Apple Health" 
              action="Heart rate updated" 
              time="09:30"
              icon={<Heart className="h-8 w-8 p-2 rounded-full bg-primary/10 text-primary" />}
            />
          </Card>
        </div>
      </section>

      {/* Data Tiles */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sleep</h3>
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
              7-day trend chart
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Oura</span>
              <Button variant="link" size="sm" className="text-xs">View details</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Activity</h3>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
              7-day trend chart
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Apple Watch</span>
              <Button variant="link" size="sm" className="text-xs">View details</Button>
            </div>
          </Card>
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
