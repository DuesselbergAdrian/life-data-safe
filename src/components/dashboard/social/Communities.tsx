import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COMMUNITIES = [
  { 
    name: "Women's Hormone Health", 
    members: "2.4K", 
    contributions: 156,
    active: true,
    description: "Supporting women through hormonal transitions and health optimization"
  },
  { 
    name: "Copenhagen Health Circle", 
    members: "890", 
    contributions: 43,
    active: true,
    description: "Local health enthusiasts sharing data and insights"
  },
  { 
    name: "Sleep Optimization", 
    members: "5.2K", 
    contributions: 287,
    active: false,
    description: "Improving sleep quality through data-driven insights"
  },
];

export const Communities = () => {
  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">My Communities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {COMMUNITIES.map((community, idx) => (
            <Card key={idx} className={community.active ? "border-primary/30" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base">{community.name}</h3>
                      {community.active && <Badge variant="default" className="text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{community.description}</p>
                  </div>
                  <Button 
                    variant={community.active ? "outline" : "default"}
                    size="sm"
                  >
                    {community.active ? "Leave" : "Join"}
                  </Button>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{community.members} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{community.contributions} contributions this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Discover More Communities</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            Find groups aligned with your health goals and interests
          </p>
          <Button>Browse Communities</Button>
        </CardContent>
      </Card>
    </div>
  );
};
