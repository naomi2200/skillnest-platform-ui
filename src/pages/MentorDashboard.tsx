import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MentorSidebar } from "@/components/MentorSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, DollarSign, TrendingUp, Calendar, Clock, CheckCircle, X } from "lucide-react";
import courseLaravel from "@/assets/course-laravel.jpg";
import courseReact from "@/assets/course-react.jpg";

const mentorshipRequests = [
  {
    id: "1",
    student: "Juan Pérez",
    topic: "Consultoría Laravel",
    requestedDate: "Jueves 12 Nov",
    requestedTime: "4:00 PM",
    message: "Necesito ayuda con deploy en AWS",
  },
  {
    id: "2",
    student: "María Silva",
    topic: "Arquitectura de aplicaciones",
    requestedDate: "Viernes 13 Nov",
    requestedTime: "2:00 PM",
    message: "Quiero revisar la arquitectura de mi proyecto",
  },
];

const myCourses = [
  {
    id: "1",
    title: "Laravel Avanzado: De Cero a Experto",
    image: courseLaravel,
    status: "Publicado",
    students: 1234,
    rating: 4.8,
    reviews: 89,
    revenue: 98450,
  },
  {
    id: "2",
    title: "React desde Cero: Hooks, Context y más",
    image: courseReact,
    status: "Publicado",
    students: 987,
    rating: 4.9,
    reviews: 76,
    revenue: 78960,
  },
];

export default function MentorDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MentorSidebar />
        
        <div className="flex-1">
          <header className="h-16 border-b bg-background flex items-center px-6 justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold ml-4">Dashboard de Mentor</h1>
            </div>
            <div className="flex gap-2">
              <Button className="gradient-primary hover:opacity-90">
                + Crear curso
              </Button>
              <Button variant="outline" className="border-success text-success hover:bg-success hover:text-success-foreground">
                + Ofrecer mentoría
              </Button>
            </div>
          </header>

          <main className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos activos</p>
                    <p className="text-3xl font-bold">2</p>
                    <Button variant="link" className="p-0 h-auto mt-1 text-primary">
                      Ver todos
                    </Button>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estudiantes totales</p>
                    <p className="text-3xl font-bold">2,221</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ingresos este mes</p>
                    <p className="text-3xl font-bold">S/ 4,562</p>
                    <Badge className="bg-success/10 text-success mt-1">
                      +23%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-success" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Income Chart */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tus ingresos últimos 30 días</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Por curso</Button>
                  <Button variant="outline" size="sm">Por mentoría</Button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 30 }, (_, i) => {
                  const height = Math.random() * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary rounded-t-lg" 
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Mentorship Requests */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Solicitudes de mentoría pendientes</h2>
                  <Badge className="bg-warning text-warning-foreground">
                    {mentorshipRequests.length} pendientes
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mentorshipRequests.map((request) => (
                  <Card key={request.id} className="p-6 shadow-card">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {request.student.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{request.student}</p>
                          <p className="text-sm text-muted-foreground">Quiere agendar mentoría</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{request.requestedDate}, {request.requestedTime}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Tema:</p>
                          <p className="text-muted-foreground">{request.topic}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Mensaje:</p>
                          <p className="text-muted-foreground italic">"{request.message}"</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aceptar
                        </Button>
                        <Button variant="outline" className="flex-1 border-error text-error hover:bg-error hover:text-error-foreground">
                          <X className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* My Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Mis cursos</h2>
                <Button variant="outline" size="sm">Ver todos</Button>
              </div>

              <div className="space-y-4">
                {myCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all">
                    <div className="flex flex-col md:flex-row gap-4 p-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full md:w-32 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <Badge className="bg-success/10 text-success mt-1">
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students.toLocaleString()} estudiantes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span>{course.rating} ({course.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-success">
                            <DollarSign className="h-4 w-4" />
                            <span>S/ {course.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Ver inscritos
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Estadísticas
                        </Button>
                      </div>
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
