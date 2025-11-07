import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  courseCount: number;
}

export const CategoryCard = ({ icon: Icon, title, courseCount }: CategoryCardProps) => {
  return (
    <Card className="p-6 hover-lift shadow-card hover:shadow-hover cursor-pointer transition-all group">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {courseCount} cursos
          </p>
        </div>
      </div>
    </Card>
  );
};
