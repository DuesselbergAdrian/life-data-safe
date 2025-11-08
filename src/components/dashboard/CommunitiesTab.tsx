import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, CheckCircle, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommunitiesTabProps {
  userId?: string;
}

const CommunitiesTab = ({ userId }: CommunitiesTabProps) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchCommunities();
      fetchMemberships();
    }
  }, [userId]);

  const fetchCommunities = async () => {
    const { data } = await supabase
      .from("communities")
      .select("*")
      .order("member_count", { ascending: false });

    setCommunities(data || []);
  };

  const fetchMemberships = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("memberships")
      .select("community_id")
      .eq("user_id", userId);

    setMemberships(new Set((data || []).map((m) => m.community_id)));
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("memberships").insert({
        user_id: userId,
        community_id: communityId,
      });

      if (error) throw error;

      // Update community member count
      const community = communities.find((c) => c.id === communityId);
      await supabase
        .from("communities")
        .update({ member_count: community.member_count + 1 })
        .eq("id", communityId);

      toast({
        title: "Joined community!",
        description: "You're now part of this health community",
      });

      fetchCommunities();
      fetchMemberships();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("memberships")
        .delete()
        .eq("user_id", userId)
        .eq("community_id", communityId);

      if (error) throw error;

      // Update community member count
      const community = communities.find((c) => c.id === communityId);
      await supabase
        .from("communities")
        .update({ member_count: Math.max(0, community.member_count - 1) })
        .eq("id", communityId);

      toast({
        title: "Left community",
        description: "You've been removed from this community",
      });

      fetchCommunities();
      fetchMemberships();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Communities</h2>
        <p className="text-muted-foreground">
          Join health communities to contribute aggregated data and learn from collective insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {communities.map((community) => {
          const isMember = memberships.has(community.id);

          return (
            <Card key={community.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription className="mt-2">{community.blurb}</CardDescription>
                  </div>
                  {isMember && (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Member
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{community.member_count.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{community.contributions_this_month}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                </div>

                {isMember ? (
                  <div className="space-y-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Your Contribution</p>
                      <p className="text-xs text-muted-foreground">
                        You've contributed 3 anonymized data points this month
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLeaveCommunity(community.id)}
                    >
                      Leave Community
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Community
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Impact Note */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium mb-1">Community Impact</p>
              <p className="text-sm text-muted-foreground">
                When you join a community and enable data sharing in your Consent settings, 
                your anonymized health trends contribute to collective insights that help everyone in the community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitiesTab;
