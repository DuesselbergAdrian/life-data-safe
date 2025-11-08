import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrivateCircle } from "./social/PrivateCircle";
import { Communities } from "./social/Communities";
import { CollectiveImpact } from "./social/CollectiveImpact";
import { Leaderboards } from "./social/Leaderboards";

interface SocialImpactMainProps {
  userId?: string;
}

const SocialImpactMain = ({ userId }: SocialImpactMainProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social & Impact</h2>
        <p className="text-muted-foreground">Connect, share, and contribute to health impact</p>
      </div>

      <Tabs defaultValue="circle" className="space-y-6">
        <TabsList className="inline-flex bg-muted/50 backdrop-blur">
          <TabsTrigger value="circle" className="text-sm">Private Circle</TabsTrigger>
          <TabsTrigger value="communities" className="text-sm">Communities</TabsTrigger>
          <TabsTrigger value="impact" className="text-sm">Collective Impact</TabsTrigger>
          <TabsTrigger value="leaderboards" className="text-sm">Leaderboards</TabsTrigger>
        </TabsList>

        <TabsContent value="circle">
          <PrivateCircle />
        </TabsContent>

        <TabsContent value="communities">
          <Communities />
        </TabsContent>

        <TabsContent value="impact">
          <CollectiveImpact />
        </TabsContent>

        <TabsContent value="leaderboards">
          <Leaderboards />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialImpactMain;
