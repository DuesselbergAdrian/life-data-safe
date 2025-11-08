import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, MessageCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Community {
  name: string;
  members: string;
  contributions: number;
  active: boolean;
  description: string;
  image: string;
  goal: string;
  goalProgress: number;
  category: string;
}

const COMMUNITIES: Community[] = [
  { 
    name: "Women's Hormone Health", 
    members: "2.4K", 
    contributions: 156,
    active: true,
    description: "Supporting women through hormonal transitions and health optimization. Share experiences, track cycles, and learn from others.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    goal: "Reach 3,000 members and 200 monthly contributions",
    goalProgress: 78,
    category: "Women's Health"
  },
  { 
    name: "Copenhagen Health Circle", 
    members: "890", 
    contributions: 43,
    active: true,
    description: "Local Copenhagen health enthusiasts sharing data, organizing meetups, and supporting each other's wellness journeys.",
    image: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=800&q=80",
    goal: "Host 12 in-person wellness meetups this year",
    goalProgress: 42,
    category: "Local Group"
  },
  { 
    name: "Sleep Optimization", 
    members: "5.2K", 
    contributions: 287,
    active: false,
    description: "Improving sleep quality through data-driven insights, sharing sleep patterns, and testing optimization techniques together.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    goal: "Collectively improve average sleep score by 15%",
    goalProgress: 62,
    category: "Sleep & Recovery"
  },
  { 
    name: "Plant-Based Athletes", 
    members: "3.1K", 
    contributions: 198,
    active: false,
    description: "Athletes thriving on plant-based nutrition. Share meal plans, performance metrics, and prove that plants fuel performance.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    goal: "Document 500 successful plant-based performance stories",
    goalProgress: 55,
    category: "Nutrition & Fitness"
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
            <Card key={idx} className={community.active ? "border-primary/30 overflow-hidden" : "overflow-hidden"}>
              <div className="flex flex-col md:flex-row">
                {/* Community Image */}
                <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden flex-shrink-0">
                  <img 
                    src={community.image} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/80">
                      {community.category}
                    </Badge>
                  </div>
                </div>

                {/* Community Content */}
                <CardContent className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base">{community.name}</h3>
                        {community.active && <Badge variant="default" className="text-xs">Active</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{community.description}</p>
                    </div>
                    <Button 
                      variant={community.active ? "outline" : "default"}
                      size="sm"
                      className="ml-4"
                    >
                      {community.active ? "Leave" : "Join"}
                    </Button>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{community.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{community.contributions} contributions this month</span>
                    </div>
                  </div>

                  {/* Community Goal */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Community Goal</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{community.goal}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={community.goalProgress} className="h-2" />
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {community.goalProgress}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
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
            Find groups aligned with your health goals and interests. Connect with people on similar health journeys.
          </p>
          <Button>Browse Communities</Button>
        </CardContent>
      </Card>
    </div>
  );
};
