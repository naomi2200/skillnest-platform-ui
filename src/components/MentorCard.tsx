import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface MentorCardProps {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  sessions: number;
  pricePerHour: number;
  available: boolean;
}

export const MentorCard = ({
  name,
  title,
  rating,
  sessions,
  pricePerHour,
  available,
}: MentorCardProps) => {
  return (
    <Card className="p-6 hover-lift shadow-card hover:shadow-hover transition-all text-center">
      <div className="space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full gradient-primary p-0.5">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
            </div>
          </div>
          {available && (
            <Badge className="absolute bottom-0 right-0 bg-success text-success-foreground">
              Disponible
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        <div className="flex items-center justify-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">({sessions} sesiones)</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-2xl font-bold mb-3">S/ {pricePerHour}/hora</p>
          <Button className="w-full gradient-primary hover:opacity-90">
            Ver perfil
          </Button>
        </div>
      </div>
    </Card>
  );
};
