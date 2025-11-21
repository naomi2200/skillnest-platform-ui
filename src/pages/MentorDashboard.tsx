import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MentorSidebar } from "@/components/MentorSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, DollarSign, TrendingUp, Calendar, CheckCircle, X, Edit } from "lucide-react";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { CreateMentorshipModal } from "@/components/CreateMentorshipModal";
import { CourseEditor } from "@/components/CourseEditor";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [createMentorshipOpen, setCreateMentorshipOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [coursesRes, mentorshipsRes, sessionsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("mentor_id", user.id),
        supabase.from("mentorships").select("*").eq("mentor_id", user.id),
        supabase.from("mentorship_sessions").select("*").eq("mentor_id", user.id).eq("status", "Pendiente"),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (mentorshipsRes.error) throw mentorshipsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      setCourses(coursesRes.data || []);
      setMentorships(mentorshipsRes.data || []);
      setSessions(sessionsRes.data || []);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAcceptSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("mentorship_sessions")
        .update({ status: "Aceptado" })
        .eq("id", sessionId);

      if (error) throw error;
      toast.success("Solicitud aceptada");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Error al aceptar solicitud");
    }
  };

  const handleRejectSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("mentorship_sessions")
        .update({ status: "Rechazado" })
        .eq("id", sessionId);

      if (error) throw error;
      toast.success("Solicitud rechazada");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Error al rechazar solicitud");
    }
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedCourse(null);
    loadData();
  };

  if (showEditor) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MentorSidebar />
          <div className="flex-1 p-8">
            <Button
              variant="ghost"
              onClick={handleCloseEditor}
              className="mb-4"
            >
              ← Volver al Dashboard
            </Button>
            <CourseEditor
              courseId={selectedCourse || undefined}
              onSave={handleCloseEditor}
            />
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
              <Button className="gradient-primary hover:opacity-90" onClick={() => setCreateCourseOpen(true)}>
                + Crear curso
              </Button>
              <Button variant="outline" className="border-success text-success hover:bg-success hover:text-success-foreground" onClick={() => setCreateMentorshipOpen(true)}>
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
                    {sessions.length} pendientes
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {loading ? (
                  <p className="text-muted-foreground">Cargando...</p>
                ) : sessions.length === 0 ? (
                  <p className="text-muted-foreground">No hay solicitudes pendientes</p>
                ) : (
                  sessions.map((session) => (
                    <Card key={session.id} className="p-6 shadow-card">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                            S
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Estudiante</p>
                            <p className="text-sm text-muted-foreground">Quiere agendar mentoría</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.scheduled_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                          </div>
                          {session.topic && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Tema:</p>
                              <p className="text-muted-foreground">{session.topic}</p>
                            </div>
                          )}
                          {session.message && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Mensaje:</p>
                              <p className="text-muted-foreground italic">"{session.message}"</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAcceptSession(session.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aceptar
                          </Button>
                          <Button variant="outline" className="flex-1 border-error text-error hover:bg-error hover:text-error-foreground" onClick={() => handleRejectSession(session.id)}>
                            <X className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* My Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Mis cursos</h2>
                <Button variant="outline" size="sm">Ver todos</Button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-muted-foreground">Cargando...</p>
                ) : courses.length === 0 ? (
                  <p className="text-muted-foreground">No tienes cursos creados aún</p>
                ) : (
                  courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all">
                      <div className="flex flex-col md:flex-row gap-4 p-4">
                        {course.image_url && (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="w-full md:w-32 h-20 object-cover rounded"
                          />
                        )}
                        
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
                              <DollarSign className="h-4 w-4" />
                              <span>S/ {course.price}</span>
                            </div>
                            {course.duration && (
                              <div className="flex items-center gap-1">
                                <span>{course.duration} horas</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span>{course.level}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver inscritos
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <CreateCourseModal 
        open={createCourseOpen} 
        onOpenChange={setCreateCourseOpen}
        onSuccess={loadData}
      />
      <CreateMentorshipModal 
        open={createMentorshipOpen} 
        onOpenChange={setCreateMentorshipOpen}
        onSuccess={loadData}
      />
    </SidebarProvider>
  );
}
