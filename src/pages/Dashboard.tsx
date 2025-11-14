import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, TrendingUp, Calendar, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch enrolled courses with course details
      const { data: enrollments } = await supabase
        .from('course_enrollments' as any)
        .select(`
          *,
          courses (
            id,
            title,
            image_url,
            category
          )
        `)
        .eq('student_id', user?.id);

      setEnrolledCourses(enrollments || []);

      // Fetch upcoming mentorship sessions
      const { data: sessions } = await supabase
        .from('mentorship_sessions' as any)
        .select(`
          *,
          profiles!mentorship_sessions_mentor_id_fkey (
            full_name
          ),
          mentorships (
            title
          )
        `)
        .eq('student_id', user?.id)
        .eq('status', 'Confirmada')
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true });

      setUpcomingSessions(sessions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completedCourses = enrolledCourses.filter(e => e.progress === 100);
  const inProgressCourses = enrolledCourses.filter(e => e.progress > 0 && e.progress < 100);
  const totalHours = enrolledCourses.length * 12; // Estimación
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        
        <div className="flex-1">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold ml-4">Hola, {user?.full_name || 'Estudiante'} 👋</h1>
          </header>

          <main className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos inscritos</p>
                    <p className="text-3xl font-bold">{enrolledCourses.length}</p>
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
                    <p className="text-3xl font-bold">{inProgressCourses.length}</p>
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
                    <p className="text-3xl font-bold">{completedCourses.length}</p>
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
                    <p className="text-3xl font-bold">{totalHours}h</p>
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
                <Button variant="outline" size="sm" onClick={() => navigate('/mentors')}>Ver todas</Button>
              </div>

              {loading ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">Cargando...</p>
                </Card>
              ) : upcomingSessions.length === 0 ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">No tienes mentorías próximas agendadas</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingSessions.map((session: any) => (
                    <Card key={session.id} className="p-6 shadow-card hover:shadow-hover transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                              {session.profiles?.full_name?.charAt(0) || 'M'}
                            </div>
                            <div>
                              <p className="font-semibold">{session.profiles?.full_name || 'Mentor'}</p>
                              <p className="text-sm text-muted-foreground">{session.mentorships?.title || session.topic}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(session.scheduled_date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })} - {new Date(session.scheduled_date).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Duración: {session.duration} min</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            className="flex-1"
                            onClick={() => window.open(`https://meet.jit.si/skillnest-${session.id}`, '_blank')}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Unirse
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={async () => {
                              const { error } = await supabase
                                .from('mentorship_sessions' as any)
                                .update({ status: 'Cancelada' })
                                .eq('id', session.id);
                              
                              if (!error) {
                                toast({
                                  title: "Sesión cancelada",
                                  description: "La mentoría ha sido cancelada"
                                });
                                fetchDashboardData();
                              }
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Continúa aprendiendo</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/catalog')}>Ver todos mis cursos</Button>
              </div>

              {loading ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">Cargando...</p>
                </Card>
              ) : inProgressCourses.length === 0 ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">No tienes cursos en progreso. <Button variant="link" onClick={() => navigate('/catalog')}>Explorar cursos</Button></p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((enrollment: any) => (
                    <Card 
                      key={enrollment.id} 
                      className="overflow-hidden shadow-card hover:shadow-hover transition-all group cursor-pointer"
                      onClick={() => navigate(`/courses/${enrollment.courses.id}/learn`)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={enrollment.courses?.image_url || '/placeholder.svg'}
                          alt={enrollment.courses?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm">
                          {enrollment.progress}% completado
                        </Badge>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {enrollment.courses?.title}
                          </h3>
                          <Badge variant="secondary">
                            {enrollment.courses?.category}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>

                        <Button className="w-full">
                          Continuar aprendiendo
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
