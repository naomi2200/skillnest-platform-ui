import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LessonEditor } from "./LessonEditor";
import { QuizEditor } from "./QuizEditor";
import { Plus, Save, Trash } from "lucide-react";

interface ModuleEditorProps {
  moduleId: string;
  courseId: string;
  onUpdate: () => void;
}

export function ModuleEditor({ moduleId, courseId, onUpdate }: ModuleEditorProps) {
  const [module, setModule] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const { data: moduleData } = await supabase
        .from('course_modules' as any)
        .select('*')
        .eq('id', moduleId)
        .single();

      if (moduleData) {
        setModule(moduleData);
        setTitle((moduleData as any).title);
        setDescription((moduleData as any).description || "");
      }

      const { data: lessonsData } = await supabase
        .from('course_lessons' as any)
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveModule = async () => {
    try {
      const { error } = await supabase
        .from('course_modules' as any)
        .update({
          title,
          description
        })
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Módulo actualizado",
        description: "Los cambios han sido guardados"
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el módulo",
        variant: "destructive"
      });
    }
  };

  const deleteModule = async () => {
    if (!confirm('¿Estás seguro de eliminar este módulo y todo su contenido?')) return;

    try {
      const { error } = await supabase
        .from('course_modules' as any)
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Módulo eliminado",
        description: "El módulo ha sido eliminado"
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el módulo",
        variant: "destructive"
      });
    }
  };

  const addLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('course_lessons' as any)
        .insert([{
          module_id: moduleId,
          title: "Nueva Lección",
          content_type: "text",
          order_index: lessons.length
        }])
        .select()
        .single();

      if (error) throw error;

      setLessons([...lessons, data]);
      toast({
        title: "Lección agregada",
        description: "Ahora puedes editar el contenido"
      });
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la lección",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <Card className="p-6"><p className="text-muted-foreground">Cargando...</p></Card>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Módulo</h3>
          <Button onClick={deleteModule} variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>

        <div>
          <Label>Título del Módulo</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Introducción a JavaScript"
          />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué aprenderán en este módulo?"
            rows={2}
          />
        </div>

        <Button onClick={saveModule} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Guardar Módulo
        </Button>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="lessons">
            <AccordionTrigger>
              Lecciones ({lessons.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {lessons.map((lesson) => (
                <LessonEditor
                  key={lesson.id}
                  lessonId={lesson.id}
                  moduleId={moduleId}
                  onUpdate={fetchModule}
                />
              ))}
              <Button onClick={addLesson} variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Lección
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="quiz">
            <AccordionTrigger>
              Examen del Módulo
            </AccordionTrigger>
            <AccordionContent>
              <QuizEditor moduleId={moduleId} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}
