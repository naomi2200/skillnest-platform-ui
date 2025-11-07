import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Grid3x3, List } from "lucide-react";
import courseReact from "@/assets/course-react.jpg";
import courseLaravel from "@/assets/course-laravel.jpg";
import courseVue from "@/assets/course-vue.jpg";
import courseDesign from "@/assets/course-design.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";
import coursePython from "@/assets/course-python.jpg";

const allCourses = [
  {
    id: "1",
    title: "React desde Cero: Hooks, Context y más",
    instructor: "Ana García",
    instructorAvatar: "AG",
    category: "Programación",
    rating: 4.9,
    students: 2341,
    price: 149,
    image: courseReact,
  },
  {
    id: "2",
    title: "Laravel Avanzado: APIs y Microservicios",
    instructor: "Carlos Gómez",
    instructorAvatar: "CG",
    category: "Programación",
    rating: 4.8,
    students: 1234,
    price: 179,
    image: courseLaravel,
  },
  {
    id: "3",
    title: "Vue.js 3: Composición API Completa",
    instructor: "María López",
    instructorAvatar: "ML",
    category: "Programación",
    rating: 4.7,
    students: 987,
    price: 159,
    image: courseVue,
  },
  {
    id: "4",
    title: "Diseño UX/UI: De Principiante a Pro",
    instructor: "José Ramírez",
    instructorAvatar: "JR",
    category: "Diseño",
    rating: 4.9,
    students: 1567,
    price: 139,
    image: courseDesign,
  },
  {
    id: "5",
    title: "Marketing Digital: Estrategias 2024",
    instructor: "Laura Martínez",
    instructorAvatar: "LM",
    category: "Marketing",
    rating: 4.6,
    students: 2134,
    price: 129,
    image: courseMarketing,
  },
  {
    id: "6",
    title: "Python para Data Science",
    instructor: "Pedro Sánchez",
    instructorAvatar: "PS",
    category: "Programación",
    rating: 4.8,
    students: 1789,
    price: 169,
    image: coursePython,
  },
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-4">Filtros</h2>
              <Button variant="ghost" size="sm" className="mb-4">
                Limpiar todo
              </Button>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Búsqueda</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Categoría</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="prog" />
                  <label htmlFor="prog" className="text-sm cursor-pointer">
                    Programación (234)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="design" />
                  <label htmlFor="design" className="text-sm cursor-pointer">
                    Diseño (156)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" />
                  <label htmlFor="marketing" className="text-sm cursor-pointer">
                    Marketing (98)
                  </label>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Precio</Label>
              <RadioGroup defaultValue="all">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="font-normal cursor-pointer">Todos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="font-normal cursor-pointer">Gratis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="font-normal cursor-pointer">&lt; S/ 100</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid" id="mid" />
                  <Label htmlFor="mid" className="font-normal cursor-pointer">S/ 100 - 200</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Nivel</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="beginner" />
                  <label htmlFor="beginner" className="text-sm cursor-pointer">
                    Principiante
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="intermediate" />
                  <label htmlFor="intermediate" className="text-sm cursor-pointer">
                    Intermedio
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="advanced" />
                  <label htmlFor="advanced" className="text-sm cursor-pointer">
                    Avanzado
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full gradient-primary hover:opacity-90">
              Aplicar filtros
            </Button>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">120 cursos encontrados</h1>
              <div className="flex items-center gap-4">
                <select className="border rounded-md px-3 py-2 text-sm">
                  <option>Relevancia</option>
                  <option>Más populares</option>
                  <option>Mejor valorados</option>
                  <option>Precio: menor a mayor</option>
                  <option>Precio: mayor a menor</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {allCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 pt-8">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">10</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
