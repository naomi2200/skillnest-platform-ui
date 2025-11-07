import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { CourseCard } from "@/components/CourseCard";
import { MentorCard } from "@/components/MentorCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Code, Palette, TrendingUp, Briefcase, Camera, Music, GraduationCap, DollarSign } from "lucide-react";
import courseLaravel from "@/assets/course-laravel.jpg";
import courseVue from "@/assets/course-vue.jpg";
import courseDesign from "@/assets/course-design.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";
import courseReact from "@/assets/course-react.jpg";
import coursePython from "@/assets/course-python.jpg";

const categories = [
  { icon: Code, title: "Programación", courseCount: 234 },
  { icon: Palette, title: "Diseño", courseCount: 156 },
  { icon: TrendingUp, title: "Marketing", courseCount: 98 },
  { icon: Briefcase, title: "Negocios", courseCount: 145 },
  { icon: Camera, title: "Fotografía", courseCount: 67 },
  { icon: Music, title: "Música", courseCount: 43 },
];

const courses = [
  {
    id: "1",
    title: "Laravel Avanzado: De Cero a Experto",
    instructor: "Carlos Gómez",
    instructorAvatar: "CG",
    category: "Programación",
    rating: 4.8,
    students: 1234,
    price: 149,
    image: courseLaravel,
  },
  {
    id: "2",
    title: "Vue.js Completo: Desarrollo Frontend Moderno",
    instructor: "María López",
    instructorAvatar: "ML",
    category: "Programación",
    rating: 4.9,
    students: 987,
    price: 139,
    image: courseVue,
  },
  {
    id: "3",
    title: "Diseño UX/UI: Crea Interfaces Increíbles",
    instructor: "Ana García",
    instructorAvatar: "AG",
    category: "Diseño",
    rating: 4.7,
    students: 856,
    price: 129,
    image: courseDesign,
  },
  {
    id: "4",
    title: "Marketing Digital: Estrategias que Funcionan",
    instructor: "José Ramírez",
    instructorAvatar: "JR",
    category: "Marketing",
    rating: 4.8,
    students: 745,
    price: 119,
    image: courseMarketing,
  },
  {
    id: "5",
    title: "React Desde Cero: Componentes y Hooks",
    instructor: "Pedro Silva",
    instructorAvatar: "PS",
    category: "Programación",
    rating: 4.9,
    students: 2156,
    price: 159,
    image: courseReact,
  },
  {
    id: "6",
    title: "Python para Data Science y Machine Learning",
    instructor: "Laura Mendoza",
    instructorAvatar: "LM",
    category: "Programación",
    rating: 4.8,
    students: 1543,
    price: 169,
    image: coursePython,
  },
];

const mentors = [
  {
    name: "Carlos Gómez",
    title: "Senior Laravel Developer",
    avatar: "CG",
    rating: 4.9,
    sessions: 125,
    pricePerHour: 80,
    available: true,
  },
  {
    name: "María López",
    title: "Frontend Expert",
    avatar: "ML",
    rating: 4.8,
    sessions: 98,
    pricePerHour: 70,
    available: true,
  },
  {
    name: "Ana García",
    title: "UX/UI Designer",
    avatar: "AG",
    rating: 5.0,
    sessions: 156,
    pricePerHour: 90,
    available: false,
  },
  {
    name: "José Ramírez",
    title: "Marketing Strategist",
    avatar: "JR",
    rating: 4.7,
    sessions: 89,
    pricePerHour: 75,
    available: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Explora por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Cursos más populares</h2>
            <Button variant="outline">Ver todos</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Aprende de los mejores</h2>
            <Button variant="outline">Ver todos</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.name} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <GraduationCap className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">¿Quieres Aprender?</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Accede a cursos de calidad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Agenda mentorías personalizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Obtén certificados verificables
                  </li>
                </ul>
              </div>
              <Button size="lg" variant="secondary" className="w-full md:w-auto">
                Explorar cursos
              </Button>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <DollarSign className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">¿Quieres Enseñar?</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Crea y vende tus cursos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Ofrece mentorías 1 a 1
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Genera ingresos pasivos
                  </li>
                </ul>
              </div>
              <Button size="lg" variant="secondary" className="w-full md:w-auto">
                Comenzar a enseñar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
