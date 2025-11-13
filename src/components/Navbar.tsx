import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, User, LayoutDashboard } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal, isAdmin, isMentor } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isMentor) {
      navigate('/mentor-dashboard');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

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
              Cursos
            </NavLink>
            <NavLink
              to="/mentors"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Mentorías
            </NavLink>
            <button
              onClick={() => openAuthModal('signup')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Conviértete en Mentor
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || 'Usuario'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Mi Panel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => openAuthModal('login')}>
                  Iniciar sesión
                </Button>
                <Button size="sm" className="gradient-primary hover:opacity-90" onClick={() => openAuthModal('signup')}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
