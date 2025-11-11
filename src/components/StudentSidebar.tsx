import { Home, BookOpen, Target, MessageSquare, User, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Mis Cursos", url: "/catalog", icon: BookOpen },
  { title: "Mentorías", url: "/mentors", icon: Target },
  { title: "Mensajes", url: "/dashboard", icon: MessageSquare, badge: 3 },
  { title: "Perfil", url: "/dashboard", icon: User },
  { title: "Configuración", url: "/dashboard", icon: Settings },
];

export function StudentSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarHeader className="p-4">
        {open ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              J
            </div>
            <div>
              <p className="font-semibold text-sm">Juan Pérez</p>
              <Badge variant="outline" className="text-xs">Estudiante</Badge>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
            J
          </div>
        )}
      </SidebarHeader>

      <Separator />

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent transition-colors"
                      activeClassName="bg-primary text-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && (
                        <div className="flex items-center justify-between flex-1">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start" size={open ? "default" : "icon"}>
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
