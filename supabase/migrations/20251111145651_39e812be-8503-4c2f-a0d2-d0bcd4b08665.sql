-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  level TEXT CHECK (level IN ('Principiante', 'Intermedio', 'Avanzado')),
  category TEXT NOT NULL,
  duration INTEGER, -- Duration in hours
  image_url TEXT,
  status TEXT DEFAULT 'Borrador' CHECK (status IN ('Borrador', 'Publicado', 'Archivado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mentorships table
CREATE TABLE IF NOT EXISTS public.mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_per_hour DECIMAL(10,2) NOT NULL,
  specialty TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Create mentorship sessions table
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id UUID NOT NULL REFERENCES public.mentorships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- Duration in minutes
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Aceptado', 'Rechazado', 'Completado', 'Cancelado')),
  topic TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (status = 'Publicado' OR auth.uid() = mentor_id);

CREATE POLICY "Mentors can create their own courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can update their own courses" ON public.courses
  FOR UPDATE USING (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete their own courses" ON public.courses
  FOR DELETE USING (auth.uid() = mentor_id);

-- RLS Policies for mentorships
CREATE POLICY "Anyone can view available mentorships" ON public.mentorships
  FOR SELECT USING (available = true OR auth.uid() = mentor_id);

CREATE POLICY "Mentors can create their own mentorships" ON public.mentorships
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can update their own mentorships" ON public.mentorships
  FOR UPDATE USING (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete their own mentorships" ON public.mentorships
  FOR DELETE USING (auth.uid() = mentor_id);

-- RLS Policies for course enrollments
CREATE POLICY "Students can view their own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll in courses" ON public.course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments" ON public.course_enrollments
  FOR UPDATE USING (auth.uid() = student_id);

-- RLS Policies for mentorship sessions
CREATE POLICY "Users can view their own sessions" ON public.mentorship_sessions
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Students can create session requests" ON public.mentorship_sessions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Mentors can update sessions" ON public.mentorship_sessions
  FOR UPDATE USING (auth.uid() = mentor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_mentorships_updated_at
  BEFORE UPDATE ON public.mentorships
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();