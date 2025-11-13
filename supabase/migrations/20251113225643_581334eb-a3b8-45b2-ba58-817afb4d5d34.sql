-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'student');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  experience TEXT,
  skills TEXT[],
  hourly_rate NUMERIC,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update courses table to add approval status
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pendiente' CHECK (approval_status IN ('pendiente', 'aprobado', 'rechazado'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of published courses"
ON public.course_modules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = course_modules.course_id
    AND (courses.status = 'Publicado' OR courses.mentor_id = auth.uid())
  )
);

CREATE POLICY "Mentors can manage their own course modules"
ON public.course_modules
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = course_modules.course_id
    AND courses.mentor_id = auth.uid()
  )
);

-- Create course lessons table
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'text')),
  content_url TEXT,
  content_text TEXT,
  duration INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published courses"
ON public.course_lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id
    AND (c.status = 'Publicado' OR c.mentor_id = auth.uid())
  )
);

CREATE POLICY "Mentors can manage lessons in their courses"
ON public.course_lessons
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = course_lessons.module_id
    AND c.mentor_id = auth.uid()
  )
);

-- Create module quizzes table
CREATE TABLE public.module_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.module_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view quizzes"
ON public.module_quizzes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    LEFT JOIN public.course_enrollments ce ON ce.course_id = c.id AND ce.student_id = auth.uid()
    WHERE cm.id = module_quizzes.module_id
    AND (c.status = 'Publicado' OR c.mentor_id = auth.uid() OR ce.student_id = auth.uid())
  )
);

CREATE POLICY "Mentors can manage quizzes in their courses"
ON public.module_quizzes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.course_modules cm
    JOIN public.courses c ON c.id = cm.course_id
    WHERE cm.id = module_quizzes.module_id
    AND c.mentor_id = auth.uid()
  )
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.module_quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view questions"
ON public.quiz_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.module_quizzes mq
    JOIN public.course_modules cm ON cm.id = mq.module_id
    JOIN public.courses c ON c.id = cm.course_id
    LEFT JOIN public.course_enrollments ce ON ce.course_id = c.id AND ce.student_id = auth.uid()
    WHERE mq.id = quiz_questions.quiz_id
    AND (c.mentor_id = auth.uid() OR ce.student_id = auth.uid())
  )
);

CREATE POLICY "Mentors can manage questions in their courses"
ON public.quiz_questions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.module_quizzes mq
    JOIN public.course_modules cm ON cm.id = mq.module_id
    JOIN public.courses c ON c.id = cm.course_id
    WHERE mq.id = quiz_questions.quiz_id
    AND c.mentor_id = auth.uid()
  )
);

-- Create student quiz answers table
CREATE TABLE public.student_quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.module_quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.student_quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own answers"
ON public.student_quiz_answers
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own answers"
ON public.student_quiz_answers
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Create student progress table
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (student_id, module_id)
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own progress"
ON public.student_progress
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own progress"
ON public.student_progress
FOR ALL
USING (auth.uid() = student_id);

-- Update RLS policies for courses to include approval status
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Anyone can view approved published courses"
ON public.courses
FOR SELECT
USING ((status = 'Publicado' AND approval_status = 'aprobado') OR mentor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_course_modules_updated_at
BEFORE UPDATE ON public.course_modules
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_course_lessons_updated_at
BEFORE UPDATE ON public.course_lessons
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_module_quizzes_updated_at
BEFORE UPDATE ON public.module_quizzes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_student_progress_updated_at
BEFORE UPDATE ON public.student_progress
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();