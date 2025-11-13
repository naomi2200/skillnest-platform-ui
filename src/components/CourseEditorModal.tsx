import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId?: string | null;
  onSuccess?: () => void;
}

export function CourseEditorModal({ open, onOpenChange, courseId, onSuccess }: CourseEditorModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Course basics
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Principiante");
  const [imageUrl, setImageUrl] = useState("");

  // Modules and lessons
  const [modules, setModules] = useState<any[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        description: "",
        lessons: [],
        quiz: { title: "", questions: [] }
      }
    ]);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const deleteModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({
      title: "",
      description: "",
      content_type: "text",
      content_url: "",
      content_text: "",
      duration: 0
    });
    setModules(updated);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value
    };
    setModules(updated);
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_: any, i: number) => i !== lessonIndex);
    setModules(updated);
  };

  const addQuizQuestion = (moduleIndex: number) => {
    const updated = [...modules];
    if (!updated[moduleIndex].quiz.questions) {
      updated[moduleIndex].quiz.questions = [];
    }
    updated[moduleIndex].quiz.questions.push({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0
    });
    setModules(updated);
  };

  const updateQuizQuestion = (moduleIndex: number, questionIndex: number, field: string, value: any) => {
    const updated = [...modules];
    updated[moduleIndex].quiz.questions[questionIndex] = {
      ...updated[moduleIndex].quiz.questions[questionIndex],
      [field]: value
    };
    setModules(updated);
  };

  const deleteQuizQuestion = (moduleIndex: number, questionIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].quiz.questions = updated[moduleIndex].quiz.questions.filter((_: any, i: number) => i !== questionIndex);
    setModules(updated);
  };

  const saveDraft = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Create or update course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .upsert({
          id: courseId || undefined,
          mentor_id: user.id,
          title,
          description,
          price: parseFloat(price) || 0,
          category,
          level,
          image_url: imageUrl || null,
          status: 'Borrador',
          approval_status: 'pendiente'
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Save modules
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        
        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .upsert({
            course_id: courseData.id,
            title: module.title,
            description: module.description,
            order_index: i
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Save lessons
        for (let j = 0; j < module.lessons.length; j++) {
          const lesson = module.lessons[j];
          
          await supabase.from('course_lessons').upsert({
            module_id: moduleData.id,
            title: lesson.title,
            description: lesson.description,
            content_type: lesson.content_type,
            content_url: lesson.content_url || null,
            content_text: lesson.content_text || null,
            duration: lesson.duration || null,
            order_index: j
          });
        }

        // Save quiz
        if (module.quiz.questions && module.quiz.questions.length > 0) {
          const { data: quizData } = await supabase
            .from('module_quizzes')
            .upsert({
              module_id: moduleData.id,
              title: module.quiz.title || `Quiz del Módulo ${i + 1}`,
              passing_score: 70
            })
            .select()
            .single();

          if (quizData) {
            for (let k = 0; k < module.quiz.questions.length; k++) {
              const question = module.quiz.questions[k];
              
              await supabase.from('quiz_questions').upsert({
                quiz_id: quizData.id,
                question: question.question,
                options: question.options,
                correct_answer: question.correct_answer,
                order_index: k
              });
            }
          }
        }
      }

      toast.success("Borrador guardado exitosamente");
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error(error.message || "Error al guardar el borrador");
    } finally {
      setLoading(false);
    }
  };

  const publishCourse = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await saveDraft();

      const { error } = await supabase
        .from('courses')
        .update({
          status: 'Publicado',
          approval_status: 'pendiente'
        })
        .eq('id', courseId || undefined);

      if (error) throw error;

      toast.success("Curso enviado para aprobación");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al publicar el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor de Curso</DialogTitle>
          <DialogDescription>
            Crea y edita tu curso paso a paso
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step.toString()} onValueChange={(v) => setStep(parseInt(v))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">Información Básica</TabsTrigger>
            <TabsTrigger value="2">Módulos y Lecciones</TabsTrigger>
            <TabsTrigger value="3">Publicar</TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Título del curso *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Laravel Avanzado: De Cero a Experto"
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe lo que aprenderán los estudiantes..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría *</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ej: Programación, Diseño"
                  />
                </div>

                <div>
                  <Label>Nivel</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Principiante">Principiante</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precio (S/) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <Label>URL de imagen</Label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Siguiente: Agregar Módulos →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="2" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Módulos del Curso</h3>
              <Button onClick={addModule} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar Módulo
              </Button>
            </div>

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge>Módulo {moduleIndex + 1}</Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={currentModuleIndex === moduleIndex ? "default" : "outline"}
                          onClick={() => setCurrentModuleIndex(currentModuleIndex === moduleIndex ? null : moduleIndex)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteModule(moduleIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Input
                      placeholder="Título del módulo"
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    />

                    <Textarea
                      placeholder="Descripción del módulo"
                      value={module.description}
                      onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      rows={2}
                    />

                    {currentModuleIndex === moduleIndex && (
                      <div className="border-t pt-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Lecciones</Label>
                          <Button onClick={() => addLesson(moduleIndex)} size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar Lección
                          </Button>
                        </div>

                        {module.lessons.map((lesson: any, lessonIndex: number) => (
                          <Card key={lessonIndex} className="p-3 bg-accent/50">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-sm">Lección {lessonIndex + 1}</Label>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              <Input
                                placeholder="Título de la lección"
                                value={lesson.title}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                className="text-sm"
                              />

                              <Select
                                value={lesson.content_type}
                                onValueChange={(v) => updateLesson(moduleIndex, lessonIndex, 'content_type', v)}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="text">Texto</SelectItem>
                                </SelectContent>
                              </Select>

                              {(lesson.content_type === 'video' || lesson.content_type === 'pdf') && (
                                <Input
                                  placeholder="URL del recurso"
                                  value={lesson.content_url}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content_url', e.target.value)}
                                  className="text-sm"
                                />
                              )}

                              {lesson.content_type === 'text' && (
                                <Textarea
                                  placeholder="Contenido de texto"
                                  value={lesson.content_text}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content_text', e.target.value)}
                                  rows={3}
                                  className="text-sm"
                                />
                              )}
                            </div>
                          </Card>
                        ))}

                        <div className="border-t pt-3 space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Quiz del Módulo</Label>
                            <Button onClick={() => addQuizQuestion(moduleIndex)} size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              Agregar Pregunta
                            </Button>
                          </div>

                          {module.quiz?.questions?.map((question: any, qIndex: number) => (
                            <Card key={qIndex} className="p-3 bg-muted/50">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-sm">Pregunta {qIndex + 1}</Label>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteQuizQuestion(moduleIndex, qIndex)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Input
                                  placeholder="Pregunta"
                                  value={question.question}
                                  onChange={(e) => updateQuizQuestion(moduleIndex, qIndex, 'question', e.target.value)}
                                  className="text-sm"
                                />

                                {question.options.map((opt: string, optIndex: number) => (
                                  <div key={optIndex} className="flex gap-2 items-center">
                                    <Input
                                      placeholder={`Opción ${optIndex + 1}`}
                                      value={opt}
                                      onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[optIndex] = e.target.value;
                                        updateQuizQuestion(moduleIndex, qIndex, 'options', newOptions);
                                      }}
                                      className="text-sm flex-1"
                                    />
                                    <input
                                      type="radio"
                                      name={`correct-${moduleIndex}-${qIndex}`}
                                      checked={question.correct_answer === optIndex}
                                      onChange={() => updateQuizQuestion(moduleIndex, qIndex, 'correct_answer', optIndex)}
                                      title="Marcar como correcta"
                                    />
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                ← Anterior
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Siguiente: Publicar →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="3" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resumen del Curso</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Título:</strong> {title || 'Sin título'}</p>
                <p><strong>Categoría:</strong> {category || 'Sin categoría'}</p>
                <p><strong>Precio:</strong> S/ {price || '0'}</p>
                <p><strong>Módulos:</strong> {modules.length}</p>
                <p><strong>Lecciones totales:</strong> {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}</p>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                ← Anterior
              </Button>
              <Button onClick={saveDraft} variant="outline" className="flex-1" disabled={loading}>
                <Save className="h-4 w-4 mr-1" />
                Guardar Borrador
              </Button>
              <Button onClick={publishCourse} className="flex-1 gradient-primary" disabled={loading}>
                Publicar Curso
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Al publicar, tu curso será enviado para aprobación por el administrador
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
