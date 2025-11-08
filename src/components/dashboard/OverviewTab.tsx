import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Moon, Smile, TrendingUp, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  userId?: string;
}

const OverviewTab = ({ userId }: OverviewTabProps) => {
  const [stats, setStats] = useState({
    steps: 8234,
    sleepScore: 82,
    mood: "Good",
    impactPoints: 0,
    activeConsents: 0,
    communityCount: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const [profileData, consentsData, membershipsData] = await Promise.all([
        supabase.from("profiles").select("impact_points").eq("id", userId).single(),
        supabase.from("consents").select("*").eq("user_id", userId).single(),
        supabase.from("memberships").select("id").eq("user_id", userId),
      ]);

      let activeConsents = 0;
      if (consentsData.data) {
        if (consentsData.data.share_anonymized) activeConsents++;
        if (consentsData.data.share_private_circle) activeConsents++;
        if (consentsData.data.share_communities) activeConsents++;
      }

      setStats({
        ...stats,
        impactPoints: profileData.data?.impact_points || 0,
        activeConsents,
        communityCount: membershipsData.data?.length || 0,
      });
    };

    fetchData();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's your health overview for this week</p>
      </div>

      {/* My Week Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.steps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Score</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sleepScore}/100</div>
            <p className="text-xs text-muted-foreground">Average this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mood}</div>
            <p className="text-xs text-muted-foreground">Trending positive</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Latest AI Summary</CardTitle>
          <CardDescription>From your last video upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What I heard:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Feeling more energetic in the mornings</li>
                <li>• Occasional knee discomfort during exercise</li>
                <li>• Improved sleep quality this week</li>
              </ul>
            </div>
            <div className="bg-secondary/20 p-3 rounded-lg">
              <h4 className="font-medium mb-1 text-sm">Next tiny step:</h4>
              <p className="text-sm text-muted-foreground">
                Try 5 minutes of gentle knee stretches before your morning walk. Focus on circular motions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consents & Community Impact */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Active Consents</CardTitle>
              <CardDescription className="text-xs">Data sharing permissions</CardDescription>
            </div>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConsents}</div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs">Revocable anytime</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Community Impact</CardTitle>
              <CardDescription className="text-xs">Communities joined</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.communityCount}</div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                {stats.impactPoints} impact points
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
