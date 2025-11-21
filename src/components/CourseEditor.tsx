import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleEditor } from "./ModuleEditor";
import { Plus, Save, Send } from "lucide-react";

interface CourseEditorProps {
  courseId?: string;
  onSave?: () => void;
}

export function CourseEditor({ courseId, onSave }: CourseEditorProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data: courseData } = await supabase
        .from('courses' as any)
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseData) {
        setTitle((courseData as any).title);
        setDescription((courseData as any).description || "");
        setCategory((courseData as any).category);
        setPrice((courseData as any).price?.toString() || "");
        setDuration((courseData as any).duration?.toString() || "");
        setLevel((courseData as any).level || "");
        setImageUrl((courseData as any).image_url || "");
      }

      const { data: modulesData } = await supabase
        .from('course_modules' as any)
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      setModules(modulesData || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async (status: 'Borrador' | 'Publicado') => {
    if (!title || !category || !price) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa título, categoría y precio",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);

      const courseData = {
        title,
        description,
        category,
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : null,
        level,
        image_url: imageUrl,
        mentor_id: user?.id,
        status,
        approval_status: status === 'Publicado' ? 'pendiente' : 'aprobado'
      };

      let savedCourseId = courseId;

      if (courseId) {
        const { error } = await supabase
          .from('courses' as any)
          .update(courseData)
          .eq('id', courseId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('courses' as any)
          .insert([courseData])
          .select()
          .single();

        if (error) throw error;
        savedCourseId = (data as any).id;
      }

      toast({
        title: status === 'Publicado' ? "Curso enviado" : "Borrador guardado",
        description: status === 'Publicado' 
          ? "Tu curso ha sido enviado para aprobación" 
          : "Los cambios han sido guardados"
      });

      if (onSave) {
        onSave();
      } else {
        navigate('/mentor-dashboard');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el curso",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    if (!courseId) {
      toast({
        title: "Guarda el curso primero",
        description: "Debes guardar el curso antes de agregar módulos",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_modules' as any)
        .insert([{
          course_id: courseId,
          title: "Nuevo Módulo",
          order_index: modules.length
        }])
        .select()
        .single();

      if (error) throw error;

      setModules([...modules, data]);
      toast({
        title: "Módulo agregado",
        description: "Ahora puedes agregar lecciones"
      });
    } catch (error) {
      console.error('Error adding module:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el módulo",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Información del Curso</TabsTrigger>
          <TabsTrigger value="content">Contenido y Módulos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Curso *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Introducción a React"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe de qué trata tu curso..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programación">Programación</SelectItem>
                      <SelectItem value="Diseño">Diseño</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Negocios">Negocios</SelectItem>
                      <SelectItem value="Datos">Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Nivel</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duración (horas)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => saveCourse('Borrador')}
                variant="outline"
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button
                onClick={() => saveCourse('Publicado')}
                disabled={saving}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar para Aprobación
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {!courseId ? (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                Guarda el curso primero para poder agregar módulos y lecciones
              </p>
            </Card>
          ) : (
            <>
              {modules.map((module) => (
                <ModuleEditor
                  key={module.id}
                  moduleId={module.id}
                  courseId={courseId}
                  onUpdate={fetchCourse}
                />
              ))}

              <Button onClick={addModule} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Módulo
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
