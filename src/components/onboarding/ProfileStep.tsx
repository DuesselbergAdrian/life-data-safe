import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const EU_COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
  "Spain", "Sweden"
];

const HEALTH_INTERESTS = [
  "Fitness", "Nutrition", "Mental Health", "Sleep", "Heart Health",
  "Weight Management", "Stress Management", "Chronic Conditions"
];

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  birthYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  heightCm: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
});

interface ProfileStepProps {
  userId: string;
  onComplete: (data: any, valid: boolean) => void;
  initialData?: any;
}

export const ProfileStep = ({ userId, onComplete, initialData }: ProfileStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialData?.interests || []);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      country: initialData?.country || "",
      birthYear: initialData?.birthYear || new Date().getFullYear() - 30,
      heightCm: initialData?.heightCm,
      weightKg: initialData?.weightKg,
    },
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = form.formState.isValid;
      onComplete({ ...value, interests: selectedInterests }, isValid);
      
      if (isValid) {
        saveProfile(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.formState.isValid, selectedInterests]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      form.reset({
        name: data.name || "",
        country: data.country || "",
        birthYear: data.birth_year || new Date().getFullYear() - 30,
        heightCm: data.height_cm,
        weightKg: data.weight_kg,
      });
      setSelectedInterests(data.interests || []);
    }
  };

  const saveProfile = async (values: any) => {
    await supabase
      .from("profiles")
      .update({
        name: values.name,
        country: values.country,
        birth_year: values.birthYear,
        height_cm: values.heightCm || null,
        weight_kg: values.weightKg || null,
        interests: selectedInterests,
      })
      .eq("id", userId);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Profile Information</h2>
        <p className="text-muted-foreground">Tell us about yourself to personalize your experience.</p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EU_COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Year *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1990" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="170" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Health Interests (Optional)</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {HEALTH_INTERESTS.map(interest => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {selectedInterests.includes(interest) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
