import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthModal } from "./components/AuthModal";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import ScheduleMentorship from "./pages/ScheduleMentorship";
import CourseDetail from "./pages/CourseDetail";
import CourseLearning from "./pages/CourseLearning";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthModal />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentor/:mentorId" element={<MentorProfile />} />
            <Route path="/schedule-mentorship/:mentorId" element={<ScheduleMentorship />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/learn" element={<CourseLearning />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
