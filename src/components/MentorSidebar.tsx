import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, BookOpen, Video, Calendar, MessageSquare, DollarSign, Star, User, Settings, LogOut, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Inicio", icon: Home, url: "/mentor-dashboard" },
  { title: "Mis Cursos", icon: BookOpen, url: "/mentor-dashboard/courses" },
  { title: "Mis Mentorías", icon: Video, url: "/mentor-dashboard/mentorships" },
  { title: "Agenda", icon: Calendar, url: "/mentor-dashboard/schedule" },
  { title: "Mensajes", icon: MessageSquare, url: "/mentor-dashboard/messages", badge: 5 },
  { title: "Pagos", icon: DollarSign, url: "/mentor-dashboard/payments" },
  { title: "Reseñas", icon: Star, url: "/mentor-dashboard/reviews" },
  { title: "Perfil", icon: User, url: "/mentor-dashboard/profile" },
  { title: "Configuración", icon: Settings, url: "/mentor-dashboard/settings" },
];

export const MentorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
            CG
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Carlos Gómez</p>
            <Badge className="bg-warning text-warning-foreground mt-1">
              ⭐ Mentor
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel de Mentor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={isActive ? "bg-primary text-primary-foreground" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-4 bg-primary/10 rounded-lg mx-2">
              <GraduationCap className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-semibold mb-1">También puedes aprender</p>
              <p className="text-xs text-muted-foreground mb-3">
                Explora cursos como estudiante
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Ir a Dashboard Estudiante
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
