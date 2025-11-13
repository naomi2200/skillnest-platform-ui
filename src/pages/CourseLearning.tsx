import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Lock, Play, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QuizView } from "@/components/QuizView";

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      setCourse(courseData);

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      setModules(modulesData || []);

      // Fetch progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user?.id)
        .eq('course_id', id);

      setProgress(progressData || []);

      // Set first unlocked module as current
      if (modulesData && modulesData.length > 0) {
        const firstUnlockedModule = modulesData[0];
        setCurrentModule(firstUnlockedModule);
        await fetchLessons(firstUnlockedModule.id);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Error al cargar el curso');
      setLoading(false);
    }
  };

  const fetchLessons = async (moduleId: string) => {
    const { data } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index');

    setLessons(data || []);
    if (data && data.length > 0) {
      setCurrentLesson(data[0]);
    }
    setShowQuiz(false);
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    const previousModule = modules[moduleIndex - 1];
    return progress.some(p => p.module_id === previousModule?.id && p.completed);
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.some(p => p.module_id === moduleId && p.completed);
  };

  const handleModuleClick = async (module: any, index: number) => {
    if (!isModuleUnlocked(index)) {
      toast.error('Debes completar el módulo anterior primero');
      return;
    }
    setCurrentModule(module);
    await fetchLessons(module.id);
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (passed) {
      // Mark module as completed
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user?.id,
          course_id: id,
          module_id: currentModule.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (!error) {
        toast.success('¡Módulo completado! Siguiente módulo desbloqueado.');
        await fetchCourseData();
        
        // Move to next module
        const currentIndex = modules.findIndex(m => m.id === currentModule.id);
        if (currentIndex < modules.length - 1) {
          const nextModule = modules[currentIndex + 1];
          setCurrentModule(nextModule);
          await fetchLessons(nextModule.id);
        }
      }
    } else {
      toast.error('Necesitas aprobar el quiz para continuar');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  const completedModules = progress.filter(p => p.completed).length;
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                ← Volver al Dashboard
              </Button>
              <h1 className="text-2xl font-bold mt-2">{course?.title}</h1>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <Progress value={progressPercentage} className="flex-1 max-w-xs" />
                  <span className="text-sm text-muted-foreground">
                    {completedModules} de {totalModules} módulos completados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <aside className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Contenido del Curso</h2>
              <div className="space-y-2">
                {modules.map((module, index) => {
                  const unlocked = isModuleUnlocked(index);
                  const completed = isModuleCompleted(module.id);
                  const isCurrent = currentModule?.id === module.id;

                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module, index)}
                      disabled={!unlocked}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isCurrent ? 'bg-primary text-primary-foreground' : ''
                      } ${!unlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : !unlocked ? (
                            <Lock className="h-5 w-5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2" />
                          )}
                          <div>
                            <p className="font-medium text-sm">Módulo {index + 1}</p>
                            <p className="text-xs opacity-80">{module.title}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showQuiz ? (
              <QuizView
                moduleId={currentModule?.id}
                onComplete={handleQuizComplete}
                onBack={() => setShowQuiz(false)}
              />
            ) : (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentModule?.title}</h2>
                  <p className="text-muted-foreground">{currentModule?.description}</p>
                </div>

                <Tabs defaultValue="lessons" className="w-full">
                  <TabsList>
                    <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz Final</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lessons" className="space-y-4 mt-4">
                    {lessons.length > 0 ? (
                      <>
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          {lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setCurrentLesson(lesson)}
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                currentLesson?.id === lesson.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {lesson.content_type === 'video' && <Play className="h-4 w-4" />}
                                {lesson.content_type === 'pdf' && <FileText className="h-4 w-4" />}
                                {lesson.content_type === 'text' && <FileText className="h-4 w-4" />}
                                <p className="font-medium text-sm">{lesson.title}</p>
                              </div>
                              <p className="text-xs opacity-80">
                                {lesson.duration ? `${lesson.duration} min` : 'Lectura'}
                              </p>
                            </button>
                          ))}
                        </div>

                        {currentLesson && (
                          <div className="border rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">{currentLesson.title}</h3>
                            
                            {currentLesson.content_type === 'video' && currentLesson.content_url && (
                              <div className="aspect-video bg-black rounded-lg mb-4">
                                <video
                                  src={currentLesson.content_url}
                                  controls
                                  className="w-full h-full rounded-lg"
                                />
                              </div>
                            )}

                            {currentLesson.content_type === 'pdf' && currentLesson.content_url && (
                              <div className="border rounded-lg p-4 mb-4">
                                <a
                                  href={currentLesson.content_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Abrir PDF →
                                </a>
                              </div>
                            )}

                            {currentLesson.content_text && (
                              <div className="prose max-w-none">
                                <p>{currentLesson.content_text}</p>
                              </div>
                            )}

                            {currentLesson.description && (
                              <p className="text-muted-foreground mt-4">{currentLesson.description}</p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay lecciones disponibles en este módulo
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-4">
                    <div className="border rounded-lg p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">Quiz del Módulo</h3>
                      <p className="text-muted-foreground mb-4">
                        Completa el quiz para desbloquear el siguiente módulo
                      </p>
                      <Button onClick={() => setShowQuiz(true)} className="gradient-primary">
                        Comenzar Quiz
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
