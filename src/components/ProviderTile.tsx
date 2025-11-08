import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderTileProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ProviderTile = ({ name, description, icon, selected, onClick, className }: ProviderTileProps) => {
  return (
    <Card 
      className={cn(
        "relative p-6 cursor-pointer transition-all hover:shadow-card",
        selected ? "border-primary bg-primary/5" : "border-border",
        className
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className="space-y-3">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-base mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
};
