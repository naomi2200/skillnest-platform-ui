import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuizView } from "@/components/QuizView";
import { 
  BookOpen, 
  Lock, 
  CheckCircle, 
  PlayCircle, 
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function CourseLearning() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCourseData();
  }, [id, user]);

  useEffect(() => {
    if (modules.length > 0) {
      fetchLessons(modules[currentModuleIndex].id);
    }
  }, [currentModuleIndex, modules]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData } = await supabase
        .from('courses' as any)
        .select('*')
        .eq('id', id)
        .single();

      setCourse(courseData);

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('course_modules' as any)
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      setModules(modulesData || []);

      // Fetch student progress
      const { data: progressData } = await supabase
        .from('student_progress' as any)
        .select('*')
        .eq('student_id', user?.id)
        .eq('course_id', id);

      setProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (moduleId: string) => {
    try {
      const { data } = await supabase
        .from('course_lessons' as any)
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      setLessons(data || []);
      setCurrentLessonIndex(0);
      setShowQuiz(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    
    const previousModule = modules[moduleIndex - 1];
    const moduleProgress = progress.find(p => p.module_id === previousModule?.id);
    
    return moduleProgress?.completed === true;
  };

  const isModuleCompleted = (moduleId: string) => {
    const moduleProgress = progress.find(p => p.module_id === moduleId);
    return moduleProgress?.completed === true;
  };

  const markLessonComplete = async () => {
    const currentModule = modules[currentModuleIndex];
    
    // Check if it's the last lesson
    if (currentLessonIndex === lessons.length - 1) {
      // Show quiz
      setShowQuiz(true);
    } else {
      // Move to next lesson
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (!passed) {
      toast({
        title: "Quiz no aprobado",
        description: "Debes aprobar el quiz para continuar al siguiente módulo",
        variant: "destructive"
      });
      return;
    }

    const currentModule = modules[currentModuleIndex];

    // Mark module as completed
    const { error } = await supabase
      .from('student_progress' as any)
      .upsert({
        student_id: user?.id,
        course_id: id,
        module_id: currentModule.id,
        completed: true,
        completed_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso",
        variant: "destructive"
      });
      return;
    }

    // Update enrollment progress
    const completedModules = progress.filter(p => p.completed).length + 1;
    const totalModules = modules.length;
    const progressPercentage = Math.round((completedModules / totalModules) * 100);

    await supabase
      .from('course_enrollments' as any)
      .update({ progress: progressPercentage })
      .eq('student_id', user?.id)
      .eq('course_id', id);

    toast({
      title: "¡Módulo completado!",
      description: "Has aprobado el quiz. Puedes continuar al siguiente módulo.",
    });

    // Refresh progress
    await fetchCourseData();
    setShowQuiz(false);

    // Move to next module if available
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const currentLesson = lessons[currentLessonIndex];
  const currentModule = modules[currentModuleIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Módulos */}
      <aside className="w-80 border-r bg-secondary/30 overflow-y-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Button>

          <h2 className="font-bold text-lg mb-2">{course.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {modules.filter(m => isModuleCompleted(m.id)).length} de {modules.length} módulos completados
          </p>

          <Progress 
            value={(modules.filter(m => isModuleCompleted(m.id)).length / modules.length) * 100} 
            className="mb-6"
          />

          <div className="space-y-2">
            {modules.map((module, index) => {
              const unlocked = isModuleUnlocked(index);
              const completed = isModuleCompleted(module.id);
              const isActive = index === currentModuleIndex;

              return (
                <button
                  key={module.id}
                  onClick={() => {
                    if (unlocked) {
                      setCurrentModuleIndex(index);
                    }
                  }}
                  disabled={!unlocked}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : unlocked
                      ? 'bg-background hover:bg-secondary'
                      : 'bg-muted cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : unlocked ? (
                        <BookOpen className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">
                        Módulo {index + 1}
                      </p>
                      <p className="text-sm opacity-90">{module.title}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{currentModule?.title}</h1>
            {!showQuiz && currentLesson && (
              <p className="text-muted-foreground">
                Lección {currentLessonIndex + 1} de {lessons.length}: {currentLesson.title}
              </p>
            )}
          </div>
        </header>

        {/* Contenido de la lección */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {showQuiz ? (
              <QuizView
                moduleId={currentModule.id}
                onComplete={handleQuizComplete}
              />
            ) : currentLesson ? (
              <Card className="p-6">
                {/* Video */}
                {currentLesson.content_type === 'video' && currentLesson.content_url && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                    <video
                      src={currentLesson.content_url}
                      controls
                      className="w-full h-full"
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                )}

                {/* PDF */}
                {currentLesson.content_type === 'pdf' && currentLesson.content_url && (
                  <div className="mb-6">
                    <div className="aspect-[4/3] border rounded-lg overflow-hidden">
                      <iframe
                        src={currentLesson.content_url}
                        className="w-full h-full"
                        title={currentLesson.title}
                      />
                    </div>
                  </div>
                )}

                {/* Texto */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {currentLesson.content_type === 'video' && <PlayCircle className="h-5 w-5 text-primary" />}
                    {currentLesson.content_type === 'pdf' && <FileText className="h-5 w-5 text-primary" />}
                    {currentLesson.content_type === 'text' && <BookOpen className="h-5 w-5 text-primary" />}
                    <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                  </div>

                  {currentLesson.description && (
                    <p className="text-muted-foreground mb-4">
                      {currentLesson.description}
                    </p>
                  )}

                  <Separator className="my-6" />

                  {currentLesson.content_text && (
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content_text }}
                    />
                  )}
                </div>

                <Separator className="my-6" />

                {/* Navegación */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentLessonIndex > 0) {
                        setCurrentLessonIndex(currentLessonIndex - 1);
                      } else if (currentModuleIndex > 0 && isModuleUnlocked(currentModuleIndex - 1)) {
                        setCurrentModuleIndex(currentModuleIndex - 1);
                      }
                    }}
                    disabled={currentLessonIndex === 0 && currentModuleIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <Badge variant="secondary">
                    Lección {currentLessonIndex + 1} de {lessons.length}
                  </Badge>

                  <Button onClick={markLessonComplete}>
                    {currentLessonIndex === lessons.length - 1 ? 'Ir al Quiz' : 'Siguiente'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <p className="text-muted-foreground text-center">
                  No hay lecciones disponibles para este módulo
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
