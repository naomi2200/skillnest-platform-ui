import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock, Users, CheckCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Mock mentor data
const mentorData: any = {
  'carlos-gomez': {
    name: 'Carlos Gómez',
    avatar: 'CG',
    title: 'Senior Laravel Developer',
    bio: 'Desarrollador Full Stack con más de 10 años de experiencia. Especializado en Laravel, Vue.js y arquitecturas escalables. He trabajado con startups y empresas Fortune 500.',
    specialty: 'Backend Development, Laravel, PHP',
    rating: 4.9,
    totalReviews: 156,
    sessions: 125,
    pricePerHour: 80,
    available: true,
    courses: [
      { id: 1, title: 'Laravel Avanzado: De Cero a Experto', students: 1234, rating: 4.8 },
      { id: 2, title: 'API REST con Laravel', students: 856, rating: 4.7 },
    ],
    skills: ['Laravel', 'PHP', 'Vue.js', 'MySQL', 'Docker', 'AWS'],
    availability: [
      { day: 'Lunes', hours: '9:00 AM - 5:00 PM' },
      { day: 'Miércoles', hours: '2:00 PM - 8:00 PM' },
      { day: 'Viernes', hours: '10:00 AM - 4:00 PM' },
    ],
  },
};

export default function MentorProfile() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const mentor = mentorData[mentorId || ''] || mentorData['carlos-gomez'];

  const handleScheduleMentorship = () => {
    if (!isAuthenticated) {
      openAuthModal('signup');
      return;
    }
    navigate(`/schedule-mentorship/${mentorId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {mentor.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{mentor.name}</h1>
                <p className="text-xl text-muted-foreground mb-4">{mentor.title}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-semibold">{mentor.rating}</span>
                    <span className="text-muted-foreground">({mentor.totalReviews} reseñas)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>{mentor.sessions} sesiones completadas</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>${mentor.pricePerHour}/hora</span>
                  </div>
                </div>
                {mentor.available && (
                  <Badge variant="default" className="bg-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Disponible para mentorías
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agendar Mentoría</CardTitle>
              <CardDescription>Sesión personalizada 1 a 1</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Precio por hora</span>
                <span className="text-2xl font-bold">${mentor.pricePerHour}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleScheduleMentorship}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar sesión
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bio and Skills */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Acerca de mí</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especialidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{mentor.specialty}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cursos dictados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.courses.map((course: any) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} estudiantes
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentor.availability.map((slot: any) => (
                  <div key={slot.day} className="flex justify-between items-center">
                    <span className="font-medium">{slot.day}</span>
                    <span className="text-sm text-muted-foreground">{slot.hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
