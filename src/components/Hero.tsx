import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Users, Star, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                Aprende de expertos o comparte tu{" "}
                <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  conocimiento
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Accede a más de 500 cursos y conecta con mentores profesionales
              </p>
            </div>

            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="¿Qué quieres aprender hoy?"
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="gradient-primary hover:opacity-90">
                Buscar
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-sm text-muted-foreground">cursos</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">10K</span>
                </div>
                <p className="text-sm text-muted-foreground">estudiantes</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">4.8/5</span>
                </div>
                <p className="text-sm text-muted-foreground">valoración</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <p className="text-sm text-muted-foreground">completados</p>
              </div>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img
                src={heroImage}
                alt="Estudiantes aprendiendo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
