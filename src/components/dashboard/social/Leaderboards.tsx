import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOP_CONTRIBUTORS = [
  { rank: 1, name: "Alex K.", points: 2847, badge: "🏆", change: "+12%" },
  { rank: 2, name: "Sarah M.", points: 2634, badge: "🥈", change: "+8%" },
  { rank: 3, name: "Jordan P.", points: 2401, badge: "🥉", change: "+15%" },
  { rank: 4, name: "You", points: 1247, badge: "", change: "+6%" },
  { rank: 5, name: "Chris L.", points: 1156, badge: "", change: "+4%" },
];

const TOP_COMMUNITIES = [
  { rank: 1, name: "Sleep Optimization", members: "5.2K", points: 42847 },
  { rank: 2, name: "Women's Hormone Health", members: "2.4K", points: 38634 },
  { rank: 3, name: "Copenhagen Health Circle", members: "890", points: 12401 },
];

export const Leaderboards = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Leaderboards</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contributors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
            <TabsTrigger value="communities">Top Communities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contributors" className="space-y-3">
            {TOP_CONTRIBUTORS.map((contributor) => (
              <div 
                key={contributor.rank}
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  contributor.name === "You" 
                    ? "bg-primary/10 border-2 border-primary/30" 
                    : "border border-border hover:border-primary/20"
                }`}
              >
                <div className="text-2xl w-8 text-center">
                  {contributor.badge || `#${contributor.rank}`}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-sm font-semibold">
                    {contributor.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contributor.points.toLocaleString()} points
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {contributor.change}
                </Badge>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="communities" className="space-y-3">
            {TOP_COMMUNITIES.map((community) => (
              <div 
                key={community.rank}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
              >
                <div className="text-2xl w-8 text-center">
                  {community.rank === 1 ? "🏆" : community.rank === 2 ? "🥈" : "🥉"}
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{community.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {community.members} members
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{community.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
