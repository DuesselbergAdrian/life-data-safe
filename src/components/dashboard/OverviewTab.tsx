import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";

interface OverviewTabProps {
  userId?: string;
}

const OverviewTab = ({ userId }: OverviewTabProps) => {
  const [stats, setStats] = useState({
    steps: 8432,
    sleep: 7.2,
    readiness: 87,
    heartRate: 62,
    impactPoints: 0,
    activeConsents: 0,
    communityCount: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const [profileData, projectConsentsData, membershipsData] = await Promise.all([
        supabase.from("profiles").select("impact_points").eq("id", userId).single(),
        supabase.from("project_consents").select("*").eq("user_id", userId).eq("status", "active"),
        supabase.from("memberships").select("id").eq("user_id", userId),
      ]);

      setStats({
        ...stats,
        impactPoints: profileData.data?.impact_points || 0,
        activeConsents: projectConsentsData.data?.length || 0,
        communityCount: membershipsData.data?.length || 0,
      });
    };

    fetchData();
  }, [userId]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-muted-foreground">Your health overview</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Today" 
          value={stats.steps.toLocaleString()} 
          unit="steps"
          delta={12}
          sparklineData={[65, 72, 68, 80, 75, 85, 90]}
        />
        <StatCard 
          title="Sleep" 
          value={stats.sleep.toString()} 
          unit="hours"
          delta={-5}
          sparklineData={[7, 6.5, 7.2, 8, 7.5, 6.8, 7.2]}
        />
        <StatCard 
          title="Readiness" 
          value={stats.readiness.toString()} 
          unit="%"
          delta={3}
          sparklineData={[80, 82, 85, 87, 84, 86, 87]}
        />
        <StatCard 
          title="Heart" 
          value={stats.heartRate.toString()} 
          unit="bpm"
          sparklineData={[65, 63, 61, 62, 64, 63, 62]}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent updates</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityItem 
            source="Oura Ring" 
            action="Sleep synced" 
            time="06:42"
          />
          <ActivityItem 
            source="Apple Watch" 
            action="Activity recorded" 
            time="08:15"
          />
          <ActivityItem 
            source="Apple Health" 
            action="Heart rate updated" 
            time="09:30"
          />
        </CardContent>
      </Card>

      {/* Consents & Community */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Active consents</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Research projects</p>
            </div>
            <Shield className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.activeConsents}</div>
            <Badge variant="outline" className="mt-3 text-xs">
              Revocable anytime
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Communities</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Groups joined</p>
            </div>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.communityCount}</div>
            <Badge variant="outline" className="mt-3 text-xs bg-primary/10 border-primary/20">
              {stats.impactPoints} pts
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
