import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Trash, Upload } from "lucide-react";

interface LessonEditorProps {
  lessonId: string;
  moduleId: string;
  onUpdate: () => void;
}

export function LessonEditor({ lessonId, moduleId, onUpdate }: LessonEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("text");
  const [contentUrl, setContentUrl] = useState("");
  const [contentText, setContentText] = useState("");
  const [duration, setDuration] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const { data } = await supabase
        .from('course_lessons' as any)
        .select('*')
        .eq('id', lessonId)
        .single();

      if (data) {
        setTitle((data as any).title);
        setDescription((data as any).description || "");
        setContentType((data as any).content_type);
        setContentUrl((data as any).content_url || "");
        setContentText((data as any).content_text || "");
        setDuration((data as any).duration?.toString() || "");
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    }
  };

  const saveLesson = async () => {
    try {
      const { error } = await supabase
        .from('course_lessons' as any)
        .update({
          title,
          description,
          content_type: contentType,
          content_url: contentUrl,
          content_text: contentText,
          duration: duration ? parseInt(duration) : null
        })
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Lección guardada",
        description: "Los cambios han sido guardados"
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la lección",
        variant: "destructive"
      });
    }
  };

  const deleteLesson = async () => {
    if (!confirm('¿Eliminar esta lección?')) return;

    try {
      const { error } = await supabase
        .from('course_lessons' as any)
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Lección eliminada"
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la lección",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const bucket = contentType === 'video' ? 'course-videos' : 'course-resources';
      const filePath = `${moduleId}/${lessonId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setContentUrl(publicUrl);
      toast({
        title: "Archivo subido",
        description: "El archivo ha sido subido exitosamente"
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la lección"
          className="flex-1 mr-2"
        />
        <Button onClick={deleteLesson} variant="ghost" size="sm">
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción breve"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Tipo de Contenido</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Duración (min)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="10"
          />
        </div>
      </div>

      {contentType !== 'text' && (
        <div>
          <Label>Archivo</Label>
          <div className="flex gap-2">
            <Input
              type="file"
              onChange={handleFileUpload}
              accept={contentType === 'video' ? 'video/*' : 'application/pdf'}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {contentUrl && (
            <p className="text-xs text-muted-foreground mt-1">
              URL: {contentUrl}
            </p>
          )}
        </div>
      )}

      {contentType === 'text' && (
        <div>
          <Label>Contenido</Label>
          <Textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Escribe el contenido de la lección..."
            rows={5}
          />
        </div>
      )}

      <Button onClick={saveLesson} size="sm" className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Guardar Lección
      </Button>
    </Card>
  );
}
