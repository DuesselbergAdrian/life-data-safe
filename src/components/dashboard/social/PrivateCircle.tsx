import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, UserPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const CONTACTS = [
  { name: "Dr. Sarah Chen", relation: "Physician", access: ["Sleep", "Activity"], initials: "SC" },
  { name: "Mom", relation: "Family", access: ["Sleep", "Steps", "Mood"], initials: "MJ" },
  { name: "Coach Alex", relation: "Fitness Coach", access: ["Activity", "Heart Rate"], initials: "AK" },
  { name: "Partner", relation: "Family", access: ["All Data"], initials: "JD" },
];

export const PrivateCircle = () => {
  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Private Circle</CardTitle>
            <CardDescription>Trusted contacts with selective data access</CardDescription>
          </div>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add contact
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {CONTACTS.length} of 100 contacts • Control exactly what each person can see
          </p>
          <div className="space-y-3">
            {CONTACTS.map((contact, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {contact.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{contact.relation}</p>
                  <div className="flex gap-1">
                    {contact.access.map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Data Visibility Settings</CardTitle>
          <CardDescription>Control what data types can be shared</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Activity", "Sleep", "Heart Rate", "Mood", "Lab Results"].map((type) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm font-medium">{type}</span>
              <Switch defaultChecked={type !== "Lab Results"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
