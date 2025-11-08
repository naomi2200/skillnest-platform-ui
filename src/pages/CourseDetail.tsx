import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, Clock, Globe, Check } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import courseLaravel from "@/assets/course-laravel.jpg";

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const coursePrice = 149;
  const courseName = "Laravel Avanzado: De Cero a Experto";

  const handleEnroll = () => {
    if (!isAuthenticated) {
      openAuthModal('signup');
      return;
    }
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "¡Compra exitosa!",
      description: "Ahora tienes acceso al curso. ¡Comienza a aprender!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <div className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge className="mb-4">Programación</Badge>
              <h1 className="text-4xl font-bold mb-4">
                Laravel Avanzado: De Cero a Experto
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Domina Laravel y construye aplicaciones web profesionales desde cero
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-medium">4.8</span>
                  <span className="text-muted-foreground">(1,234 valoraciones)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>3,456 estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>12 horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>Español</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <img 
                src={courseLaravel} 
                alt="Laravel Course" 
                className="w-full rounded-lg shadow-hover"
              />

              <Tabs defaultValue="learn" className="w-full">
                <TabsList>
                  <TabsTrigger value="learn">Lo que aprenderás</TabsTrigger>
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="learn" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Dominar Eloquent ORM y relaciones complejas",
                      "Crear APIs RESTful profesionales",
                      "Implementar autenticación con Sanctum",
                      "Manejar migraciones y seeders",
                      "Optimización de consultas SQL",
                      "Deploy en producción",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="content">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Sección 1: Introducción</h3>
                      <p className="text-sm text-muted-foreground">5 lecciones · 45min</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Sección 2: Eloquent ORM</h3>
                      <p className="text-sm text-muted-foreground">8 lecciones · 2h 15min</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements">
                  <ul className="space-y-2">
                    <li>• Conocimientos básicos de PHP</li>
                    <li>• Laptop con al menos 4GB RAM</li>
                    <li>• Ganas de aprender</li>
                  </ul>
                </TabsContent>
              </Tabs>

              {/* Instructor */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Instructor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    C
                  </div>
                  <div>
                    <h4 className="font-semibold">Carlos Gómez</h4>
                    <p className="text-sm text-muted-foreground">Senior Laravel Developer</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm">4.9 (235 cursos)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 shadow-hover sticky top-4 space-y-4">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold">S/ 149</span>
                    <span className="text-xl text-muted-foreground line-through">S/ 199</span>
                  </div>
                  <Badge variant="outline" className="mb-4">-25% de descuento</Badge>
                </div>

                <Button 
                  className="w-full gradient-primary hover:opacity-90" 
                  size="lg"
                  onClick={handleEnroll}
                >
                  Comprar curso
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Garantía de devolución de 30 días
                </p>

                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold">Este curso incluye:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      12 horas de video on-demand
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      24 recursos descargables
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      Acceso de por vida
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      Certificado de finalización
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={coursePrice}
        itemName={courseName}
        onSuccess={handlePaymentSuccess}
      />

      <Footer />
    </div>
  );
}
