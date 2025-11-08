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
import { LayoutDashboard, Users, BookOpen, Video, Star, DollarSign, BarChart3, Settings, LogOut, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
  { title: "Usuarios", icon: Users, url: "/admin/users" },
  { title: "Cursos", icon: BookOpen, url: "/admin/courses", badge: 8 },
  { title: "Mentorías", icon: Video, url: "/admin/mentorships" },
  { title: "Reseñas", icon: Star, url: "/admin/reviews" },
  { title: "Transacciones", icon: DollarSign, url: "/admin/transactions" },
  { title: "Reportes", icon: BarChart3, url: "/admin/reports" },
  { title: "Configuración", icon: Settings, url: "/admin/settings" },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r-0">
      <SidebarHeader className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-primary flex items-center justify-center text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Admin Panel</p>
            <p className="text-xs text-gray-400">SkillNest</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={
                        isActive
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-warning text-warning-foreground">
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
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => navigate("/")}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
