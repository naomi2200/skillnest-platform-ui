import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorCard } from "@/components/MentorCard";

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
    title: "UX/UI Design Expert",
    avatar: "ML",
    rating: 4.8,
    sessions: 98,
    pricePerHour: 70,
    available: false,
  },
  {
    name: "José Ramírez",
    title: "Full Stack Developer",
    avatar: "JR",
    rating: 5.0,
    sessions: 156,
    pricePerHour: 90,
    available: true,
  },
  {
    name: "Ana García",
    title: "React Specialist",
    avatar: "AG",
    rating: 4.7,
    sessions: 87,
    pricePerHour: 75,
    available: true,
  },
];

export default function Mentors() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Encuentra tu <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Mentor Ideal</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Aprende de profesionales con experiencia real
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <MentorCard key={index} {...mentor} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
