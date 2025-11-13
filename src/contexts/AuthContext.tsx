import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'student' | 'mentor') => Promise<void>;
  logout: () => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  isAdmin: boolean;
  isMentor: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const userRoles = roles?.map(r => r.role) || [];

      const authUser = await supabase.auth.getUser();
      
      setUser({
        id: userId,
        email: authUser.data.user?.email || '',
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        roles: userRoles,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setAuthModalOpen(false);
      
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Email o contraseña incorrectos.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'mentor') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: role,
        });
      }

      setAuthModalOpen(false);
      
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente.",
      });

      // Redirect based on role
      if (role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate('/');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const isAdmin = user?.roles.includes('admin') || false;
  const isMentor = user?.roles.includes('mentor') || false;
  const isStudent = user?.roles.includes('student') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        isAdmin,
        isMentor,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
