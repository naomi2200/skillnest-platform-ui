import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Video, DollarSign, TrendingUp, Eye, Edit, Trash2, Mail, CheckCircle, X } from "lucide-react";
import courseLaravel from "@/assets/course-laravel.jpg";
import courseVue from "@/assets/course-vue.jpg";

const topCourses = [
  { rank: "🥇", title: "Laravel Avanzado", students: 1234 },
  { rank: "🥈", title: "Vue.js Completo", students: 987 },
  { rank: "🥉", title: "React Desde Cero", students: 856 },
  { rank: "4", title: "Diseño UX/UI", students: 745 },
  { rank: "5", title: "Marketing Digital", students: 698 },
];

const topMentors = [
  { name: "Carlos Gómez", revenue: 4562, rating: 4.9, sessions: 45 },
  { name: "María López", revenue: 3890, rating: 4.8, sessions: 38 },
  { name: "José Ramírez", revenue: 3234, rating: 5.0, sessions: 32 },
];

const pendingCourses = [
  {
    id: "C-1235",
    title: "Vue.js Completo",
    mentor: "María López",
    image: courseVue,
    status: "pending",
  },
  {
    id: "C-1236",
    title: "React Avanzado",
    mentor: "José Ramírez",
    image: courseLaravel,
    status: "pending",
  },
];

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
        
        <div className="flex-1">
          <header className="h-16 border-b bg-background flex items-center px-6 justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold ml-4">Panel de Administración</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Últimos 30 días ▼
              </Button>
              <Button className="gradient-primary hover:opacity-90" size="sm">
                Exportar reporte
              </Button>
            </div>
          </header>

          <main className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Usuarios totales</p>
                    <p className="text-3xl font-bold">3,456</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% vs mes anterior</span>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos activos</p>
                    <p className="text-3xl font-bold">234</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% vs mes anterior</span>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mentorías activas</p>
                    <p className="text-3xl font-bold">89</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15% vs mes anterior</span>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ingresos totales</p>
                    <p className="text-3xl font-bold">S/ 145,230</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+23% vs mes anterior</span>
                </div>
              </Card>
            </div>

            {/* Main Chart */}
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Inscripciones y mentorías últimos 30 días</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const enrollments = Math.random() * 100;
                  const mentorships = Math.random() * 60;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                      <div 
                        className="w-full bg-primary rounded-t" 
                        style={{ height: `${enrollments}%`, minHeight: "4px" }}
                      ></div>
                      <div 
                        className="w-full bg-success rounded-t" 
                        style={{ height: `${mentorships}%`, minHeight: "4px" }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Inscripciones a cursos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span>Mentorías agendadas</span>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Courses */}
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">🏆 Top 5 cursos más populares</h3>
                <div className="space-y-3">
                  {topCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold w-8">{course.rank}</span>
                        <span className="font-medium">{course.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.students.toLocaleString()} inscritos
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Mentors */}
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">💎 Top 3 mentores del mes</h3>
                <div className="space-y-4">
                  {topMentors.map((mentor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                        {mentor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{mentor.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="text-success font-semibold">S/ {mentor.revenue.toLocaleString()}</span>
                          <span>⭐ {mentor.rating}</span>
                          <span>({mentor.sessions} sesiones)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Pending Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Cursos pendientes de aprobación</h2>
                  <Badge className="bg-warning text-warning-foreground">
                    {pendingCourses.length} pendientes
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {pendingCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden shadow-card">
                    <div className="flex gap-4 p-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{course.id}</p>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.mentor}</p>
                        </div>
                        
                        <Badge className="bg-warning/10 text-warning">
                          ⏳ En revisión
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t p-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprobar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-error text-error hover:bg-error hover:text-error-foreground">
                        <X className="h-3 w-3 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
