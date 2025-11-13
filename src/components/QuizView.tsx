import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizViewProps {
  moduleId: string;
  onComplete: (passed: boolean) => void;
  onBack: () => void;
}

export function QuizView({ moduleId, onComplete, onBack }: QuizViewProps) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      const { data: quizData } = await supabase
        .from('module_quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (!quizData) {
        toast.error('No hay quiz disponible para este módulo');
        onBack();
        return;
      }

      setQuiz(quizData);

      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('order_index');

      setQuestions(questionsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error('Error al cargar el quiz');
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = async () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correct_answer
    ).length;

    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    const passed = calculatedScore >= (quiz.passing_score || 70);

    // Save quiz attempt
    await supabase.from('student_quiz_answers').insert({
      student_id: user?.id,
      quiz_id: quiz.id,
      score: calculatedScore,
      passed,
      answers: answers,
    });

    if (passed) {
      toast.success(`¡Aprobado! Puntaje: ${calculatedScore}%`);
    } else {
      toast.error(`No aprobado. Puntaje: ${calculatedScore}%. Necesitas ${quiz.passing_score}% para aprobar.`);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  const handleFinish = () => {
    const passed = score >= (quiz.passing_score || 70);
    onComplete(passed);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando quiz...</div>;
  }

  if (!quiz || questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">No hay preguntas disponibles para este quiz</p>
        <Button onClick={onBack}>Volver</Button>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (submitted) {
    const passed = score >= (quiz.passing_score || 70);
    
    return (
      <Card className="p-8 text-center">
        <div className="mb-6">
          {passed ? (
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold mb-2">
            {passed ? '¡Felicitaciones!' : 'Intenta de nuevo'}
          </h2>
          <p className="text-xl mb-4">Tu puntaje: {score}%</p>
          <p className="text-muted-foreground">
            {passed
              ? 'Has aprobado el quiz. Puedes continuar con el siguiente módulo.'
              : `Necesitas ${quiz.passing_score}% para aprobar. ¡Sigue estudiando!`}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold mb-3">Resultados:</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const correct = userAnswer === q.correct_answer;
              const options = q.options as string[];

              return (
                <Card key={q.id} className={`p-4 ${correct ? 'border-success' : 'border-destructive'}`}>
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle className="h-5 w-5 text-success mt-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">Pregunta {index + 1}: {q.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Tu respuesta: {options[userAnswer] || 'Sin respuesta'}
                      </p>
                      {!correct && (
                        <p className="text-sm text-success mt-1">
                          Respuesta correcta: {options[q.correct_answer]}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          {!passed && (
            <Button onClick={handleRetry} variant="outline">
              Reintentar Quiz
            </Button>
          )}
          <Button onClick={handleFinish} className="gradient-primary">
            {passed ? 'Continuar al Siguiente Módulo' : 'Volver al Curso'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <Button variant="ghost" onClick={onBack}>
            ← Volver
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
            <span>Puntaje mínimo: {quiz.passing_score}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
          >
            <div className="space-y-3">
              {(currentQuestion.options as string[]).map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            ← Anterior
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={answers[currentQuestion.id] === undefined}
            >
              Siguiente →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="gradient-primary"
            >
              Enviar Quiz
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
