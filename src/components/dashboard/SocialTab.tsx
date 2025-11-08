import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SocialTabProps {
  userId?: string;
}

const SocialTab = ({ userId }: SocialTabProps) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContact, setNewContact] = useState({ name: "", email: "", relation: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchContacts();
    }
  }, [userId]);

  const fetchContacts = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setContacts(data || []);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const { error } = await supabase.from("contacts").insert({
        user_id: userId,
        ...newContact,
      });

      if (error) throw error;

      toast({
        title: "Contact added",
        description: `${newContact.name} has been added to your Private Circle`,
      });

      setNewContact({ name: "", email: "", relation: "" });
      setDialogOpen(false);
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTogglePermission = async (contactId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ [field]: value })
        .eq("id", contactId);

      if (error) throw error;

      fetchContacts();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Private Circle</h2>
          <p className="text-muted-foreground">
            Share selected health metrics with up to 100 trusted contacts
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Private Circle</DialogTitle>
              <DialogDescription>
                Invite someone to your health data sharing circle
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relation">Relationship</Label>
                <Input
                  id="relation"
                  placeholder="e.g., Family, Doctor, Coach"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Add Contact</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4" />
        {contacts.length} / 100 contacts
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No contacts yet. Add trusted people to share your health journey with.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </CardDescription>
                        {contact.relation && (
                          <Badge variant="outline" className="mt-2">
                            {contact.relation}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium">Visibility Permissions:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <Label htmlFor={`steps-${contact.id}`} className="text-sm">Steps</Label>
                      <Switch
                        id={`steps-${contact.id}`}
                        checked={contact.can_see_steps}
                        onCheckedChange={(checked) =>
                          handleTogglePermission(contact.id, "can_see_steps", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <Label htmlFor={`sleep-${contact.id}`} className="text-sm">Sleep</Label>
                      <Switch
                        id={`sleep-${contact.id}`}
                        checked={contact.can_see_sleep}
                        onCheckedChange={(checked) =>
                          handleTogglePermission(contact.id, "can_see_sleep", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <Label htmlFor={`mood-${contact.id}`} className="text-sm">Mood</Label>
                      <Switch
                        id={`mood-${contact.id}`}
                        checked={contact.can_see_mood}
                        onCheckedChange={(checked) =>
                          handleTogglePermission(contact.id, "can_see_mood", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <Label htmlFor={`ai-${contact.id}`} className="text-sm">AI Notes</Label>
                      <Switch
                        id={`ai-${contact.id}`}
                        checked={contact.can_see_ai_summary}
                        onCheckedChange={(checked) =>
                          handleTogglePermission(contact.id, "can_see_ai_summary", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialTab;
