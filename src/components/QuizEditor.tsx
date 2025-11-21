import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash } from "lucide-react";

interface QuizEditorProps {
  moduleId: string;
}

export function QuizEditor({ moduleId }: QuizEditorProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState("Examen del Módulo");
  const [passingScore, setPassingScore] = useState("70");

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      const { data: quizData } = await supabase
        .from('module_quizzes' as any)
        .select('*')
        .eq('module_id', moduleId)
        .maybeSingle();

      if (quizData) {
        setQuiz(quizData);
        setTitle((quizData as any).title);
        setPassingScore((quizData as any).passing_score?.toString() || "70");

        const { data: questionsData } = await supabase
          .from('quiz_questions' as any)
          .select('*')
          .eq('quiz_id', (quizData as any).id)
          .order('order_index', { ascending: true });

        setQuestions(questionsData || []);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const createQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from('module_quizzes' as any)
        .insert([{
          module_id: moduleId,
          title,
          passing_score: parseInt(passingScore)
        }])
        .select()
        .single();

      if (error) throw error;

      setQuiz(data);
      toast({
        title: "Examen creado",
        description: "Ahora puedes agregar preguntas"
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el examen",
        variant: "destructive"
      });
    }
  };

  const saveQuiz = async () => {
    if (!quiz) return;

    try {
      const { error } = await supabase
        .from('module_quizzes' as any)
        .update({
          title,
          passing_score: parseInt(passingScore)
        })
        .eq('id', quiz.id);

      if (error) throw error;

      toast({
        title: "Examen actualizado"
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el examen",
        variant: "destructive"
      });
    }
  };

  const addQuestion = async () => {
    if (!quiz) return;

    try {
      const { data, error } = await supabase
        .from('quiz_questions' as any)
        .insert([{
          quiz_id: quiz.id,
          question: "Nueva pregunta",
          options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
          correct_answer: 0,
          order_index: questions.length
        }])
        .select()
        .single();

      if (error) throw error;

      setQuestions([...questions, data]);
      toast({
        title: "Pregunta agregada"
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la pregunta",
        variant: "destructive"
      });
    }
  };

  const saveQuestion = async (questionId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('quiz_questions' as any)
        .update(updates)
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Pregunta guardada"
      });
      fetchQuiz();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la pregunta",
        variant: "destructive"
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions' as any)
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: "Pregunta eliminada"
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la pregunta",
        variant: "destructive"
      });
    }
  };

  if (!quiz) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Título del Examen</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Puntaje Mínimo para Aprobar (%)</Label>
            <Input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <Button onClick={createQuiz}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Examen
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Puntaje para Aprobar (%)</Label>
            <Input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <Button onClick={saveQuiz} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        <h4 className="font-semibold">Preguntas ({questions.length})</h4>
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            onSave={saveQuestion}
            onDelete={deleteQuestion}
          />
        ))}
        <Button onClick={addQuestion} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pregunta
        </Button>
      </div>
    </div>
  );
}

interface QuestionItemProps {
  question: any;
  index: number;
  onSave: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

function QuestionItem({ question, index, onSave, onDelete }: QuestionItemProps) {
  const [questionText, setQuestionText] = useState(question.question);
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer);

  const handleSave = () => {
    onSave(question.id, {
      question: questionText,
      options,
      correct_answer: correctAnswer
    });
  };

  const updateOption = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Pregunta {index + 1}</Label>
          <Button onClick={() => onDelete(question.id)} variant="ghost" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Escribe la pregunta..."
          rows={2}
        />

        <div className="space-y-2">
          <Label>Opciones</Label>
          {options.map((option, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={option}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Opción ${idx + 1}`}
              />
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={correctAnswer === idx}
                onChange={() => setCorrectAnswer(idx)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Guardar Pregunta
        </Button>
      </div>
    </Card>
  );
}
