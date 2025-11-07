import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, TrendingUp, Calendar, Video } from "lucide-react";
import courseLaravel from "@/assets/course-laravel.jpg";
import courseReact from "@/assets/course-react.jpg";
import courseVue from "@/assets/course-vue.jpg";

const upcomingMentorships = [
  {
    mentor: "Carlos Gómez",
    topic: "Consultoría Laravel",
    date: "Viernes 10 Nov",
    time: "3:00 PM",
    duration: "1 hora",
  },
  {
    mentor: "Ana García",
    topic: "React Hooks Avanzados",
    date: "Lunes 13 Nov",
    time: "5:00 PM",
    duration: "1 hora",
  },
];

const coursesInProgress = [
  {
    id: "1",
    title: "Laravel Avanzado: De Cero a Experto",
    instructor: "Carlos Gómez",
    progress: 70,
    lastLesson: "Introducción a Eloquent",
    image: courseLaravel,
  },
  {
    id: "2",
    title: "React desde Cero: Hooks, Context y más",
    instructor: "Ana García",
    progress: 45,
    lastLesson: "useState y useEffect",
    image: courseReact,
  },
  {
    id: "3",
    title: "Vue.js 3: Composición API Completa",
    instructor: "María López",
    progress: 30,
    lastLesson: "Componentes básicos",
    image: courseVue,
  },
];

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        
        <div className="flex-1">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold ml-4">Hola, Juan 👋</h1>
          </header>

          <main className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos inscritos</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">En progreso</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completados</p>
                    <p className="text-3xl font-bold">5</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Horas totales</p>
                    <p className="text-3xl font-bold">124h</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-hover/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-hover" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Upcoming Mentorships */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Próximas mentorías</h2>
                <Button variant="outline" size="sm">Ver todas</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {upcomingMentorships.map((mentorship, index) => (
                  <Card key={index} className="p-6 shadow-card hover:shadow-hover transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                            {mentorship.mentor.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{mentorship.mentor}</p>
                            <p className="text-sm text-muted-foreground">{mentorship.topic}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{mentorship.date}, {mentorship.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duración: {mentorship.duration}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 gradient-primary hover:opacity-90">
                          <Video className="h-4 w-4 mr-2" />
                          Unirse
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Continúa aprendiendo</h2>
                <Button variant="outline" size="sm">Ver todos mis cursos</Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesInProgress.map((course) => (
                  <Card key={course.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all group">
                    <div className="relative aspect-video">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm">
                        {course.progress}% completado
                      </Badge>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      </div>

                      <div className="space-y-2">
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Última lección: {course.lastLesson}
                        </p>
                      </div>

                      <Button className="w-full gradient-primary hover:opacity-90">
                        Continuar curso
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Tu progreso esta semana</h3>
              <div className="h-64 flex items-end justify-between gap-4">
                {[
                  { day: "Lun", hours: 2 },
                  { day: "Mar", hours: 3 },
                  { day: "Mié", hours: 1.5 },
                  { day: "Jue", hours: 4 },
                  { day: "Vie", hours: 2.5 },
                  { day: "Sáb", hours: 0 },
                  { day: "Dom", hours: 1 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${(item.hours / 4) * 100}%`, minHeight: "4px" }}>
                      <div className="absolute inset-0 bg-primary rounded-t-lg"></div>
                    </div>
                    <span className="text-sm font-medium">{item.day}</span>
                    <span className="text-xs text-muted-foreground">{item.hours}h</span>
                  </div>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
