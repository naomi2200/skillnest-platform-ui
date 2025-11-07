import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
  students: number;
  price: number;
  image: string;
}

export const CourseCard = ({
  id,
  title,
  instructor,
  category,
  rating,
  students,
  price,
  image,
}: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden hover-lift shadow-card hover:shadow-hover transition-all">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {instructor.charAt(0)}
            </div>
            <span>{instructor}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({students.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{students.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-2xl font-bold">S/ {price}</span>
          <NavLink to={`/course/${id}`}>
            <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Ver más
            </Button>
          </NavLink>
        </div>
      </div>
    </Card>
  );
};
