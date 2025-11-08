import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Users, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ImpactTabProps {
  userId?: string;
}

const ImpactTab = ({ userId }: ImpactTabProps) => {
  const [impactData, setImpactData] = useState({
    totalPoints: 0,
    studiesContributed: 0,
    communityContributions: 0,
  });

  useEffect(() => {
    if (userId) {
      fetchImpactData();
    }
  }, [userId]);

  const fetchImpactData = async () => {
    if (!userId) return;

    const [profileData, eventsData] = await Promise.all([
      supabase.from("profiles").select("impact_points").eq("id", userId).single(),
      supabase.from("impact_events").select("*").eq("user_id", userId),
    ]);

    const studiesCount = (eventsData.data || []).filter(
      (e) => e.type === "STUDY_CONTRIBUTION"
    ).length;

    const communityCount = (eventsData.data || []).filter(
      (e) => e.type === "COMMUNITY_CHALLENGE"
    ).length;

    setImpactData({
      totalPoints: profileData.data?.impact_points || 0,
      studiesContributed: studiesCount,
      communityContributions: communityCount,
    });
  };

  // Mock data for charts
  const pointsOverTime = [
    { date: "Week 1", points: 10 },
    { date: "Week 2", points: 25 },
    { date: "Week 3", points: 45 },
    { date: "Week 4", points: 70 },
    { date: "Week 5", points: 95 },
    { date: "Week 6", points: 120 },
  ];

  const contributionsByType = [
    { type: "Research", count: 8 },
    { type: "Challenges", count: 5 },
    { type: "Milestones", count: 3 },
    { type: "Community", count: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Impact Dashboard</h2>
        <p className="text-muted-foreground">
          Track your contribution to health research and community wellness
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Points</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{impactData.totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Studies Contributed</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.studiesContributed}</div>
            <p className="text-xs text-muted-foreground mt-1">Anonymized data points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Contributions</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.communityContributions}</div>
            <p className="text-xs text-muted-foreground mt-1">Challenges joined</p>
          </CardContent>
        </Card>
      </div>

      {/* Points Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Points Over Time</CardTitle>
          <CardDescription>Your contribution growth over the past 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="points"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contributions by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Contributions by Type</CardTitle>
          <CardDescription>Breakdown of your health data contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Target className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium mb-1">Earn 10 points</p>
              <p className="text-sm text-muted-foreground">
                Share this week's anonymized sleep trend with research. Help researchers understand sleep patterns across populations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Community Leaderboard</CardTitle>
          <CardDescription>Top contributors this month (demo data)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Anonymous User #4821", points: 450 },
              { rank: 2, name: "Anonymous User #2943", points: 387 },
              { rank: 3, name: "You", points: impactData.totalPoints, isUser: true },
              { rank: 4, name: "Anonymous User #7102", points: 298 },
              { rank: 5, name: "Anonymous User #5567", points: 276 },
            ].map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isUser ? "bg-accent/10 border border-accent/20" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm">
                    {entry.rank}
                  </div>
                  <span className={entry.isUser ? "font-medium" : ""}>{entry.name}</span>
                </div>
                <span className="font-medium text-accent">{entry.points} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactTab;
