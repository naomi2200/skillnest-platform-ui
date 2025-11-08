import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              SkillNest
            </span>
          </NavLink>

          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Explorar
            </NavLink>
            <NavLink
              to="/mentors"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Mentorías
            </NavLink>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Conviértete en Mentor
            </a>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/dashboard">
              <Button variant="outline" size="sm">
                Estudiante
              </Button>
            </NavLink>
            <NavLink to="/mentor-dashboard">
              <Button variant="outline" size="sm">
                Mentor
              </Button>
            </NavLink>
            <NavLink to="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </NavLink>
            <Button variant="outline" size="sm">
              Iniciar sesión
            </Button>
            <Button size="sm" className="gradient-primary hover:opacity-90">
              Unirse
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
