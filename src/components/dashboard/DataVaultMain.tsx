import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyDataTimeline } from "./vault/MyDataTimeline";
import { ActivityDataTable } from "./vault/ActivityDataTable";
import { CustomUploads } from "./vault/CustomUploads";
import { ConsentsManager } from "./vault/ConsentsManager";
import { RewardsImpact } from "./vault/RewardsImpact";
import { ExportDelete } from "./vault/ExportDelete";
import { DevicesTab } from "./vault/DevicesTab";

interface DataVaultMainProps {
  userId?: string;
}

const DataVaultMain = ({ userId }: DataVaultMainProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Data Vault</h2>
        <p className="text-muted-foreground">Secure repository for all your health data</p>
      </div>

      <Tabs defaultValue="mydata" className="space-y-6">
        <TabsList className="inline-flex bg-muted/50 backdrop-blur">
          <TabsTrigger value="mydata" className="text-sm">My Data</TabsTrigger>
          <TabsTrigger value="devices" className="text-sm">Devices</TabsTrigger>
          <TabsTrigger value="uploads" className="text-sm">Custom Uploads</TabsTrigger>
          <TabsTrigger value="consents" className="text-sm">Consents</TabsTrigger>
          <TabsTrigger value="rewards" className="text-sm">Rewards</TabsTrigger>
          <TabsTrigger value="export" className="text-sm">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="mydata" className="space-y-6">
          <MyDataTimeline />
          <ActivityDataTable />
        </TabsContent>

        <TabsContent value="devices">
          <DevicesTab userId={userId} />
        </TabsContent>

        <TabsContent value="uploads">
          <CustomUploads />
        </TabsContent>

        <TabsContent value="consents">
          <ConsentsManager userId={userId} />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsImpact />
        </TabsContent>

        <TabsContent value="export">
          <ExportDelete userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVaultMain;
