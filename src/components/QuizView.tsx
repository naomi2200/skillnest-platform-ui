import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface QuizViewProps {
  moduleId: string;
  onComplete: (passed: boolean) => void;
}

export function QuizView({ moduleId, onComplete }: QuizViewProps) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);

      // Fetch quiz for this module
      const { data: quizData } = await supabase
        .from('module_quizzes' as any)
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (!quizData) {
        return;
      }

      setQuiz(quizData);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('quiz_questions' as any)
        .select('*')
        .eq('quiz_id', (quizData as any).id)
        .order('order_index', { ascending: true });

      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    const passed = finalScore >= (quiz.passing_score || 70);

    // Save quiz result
    await supabase
      .from('student_quiz_answers' as any)
      .insert({
        student_id: user?.id,
        quiz_id: quiz.id,
        answers: selectedAnswers,
        score: finalScore,
        passed
      });

    // Call onComplete callback
    setTimeout(() => {
      onComplete(passed);
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Cargando quiz...</p>
      </Card>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          No hay quiz disponible para este módulo
        </p>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= (quiz.passing_score || 70);

    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            passed ? 'bg-success/10' : 'bg-destructive/10'
          }`}>
            {passed ? (
              <Trophy className="h-10 w-10 text-success" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? '¡Felicitaciones!' : 'Quiz no aprobado'}
            </h2>
            <p className="text-muted-foreground">
              {passed 
                ? 'Has aprobado el quiz y puedes continuar al siguiente módulo'
                : `Necesitas al menos ${quiz.passing_score}% para aprobar. Inténtalo de nuevo.`
              }
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Tu puntuación</span>
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          <Alert className={passed ? 'border-success' : 'border-destructive'}>
            <AlertDescription>
              Respondiste correctamente {Math.round((score / 100) * questions.length)} de {questions.length} preguntas
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-muted-foreground mb-4">
          Debes obtener al menos {quiz.passing_score}% para aprobar este módulo
        </p>
        <Progress 
          value={((currentQuestionIndex + 1) / questions.length) * 100} 
          className="h-2"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </p>
      </Card>

      {/* Current Question */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">{currentQuestion.question}</h3>

        <RadioGroup
          value={selectedAnswers[currentQuestion.id]?.toString()}
          onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
        >
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>

        <div className="flex gap-1">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : selectedAnswers[questions[index].id] !== undefined
                  ? 'bg-success/20 text-success'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Enviar Quiz
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={selectedAnswers[currentQuestion.id] === undefined}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
