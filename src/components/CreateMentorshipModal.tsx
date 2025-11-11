import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CreateMentorshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateMentorshipModal({ open, onOpenChange, onSuccess }: CreateMentorshipModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_hour: "",
    specialty: "",
    available: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para ofrecer mentoría");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("mentorships").insert({
        mentor_id: user.id,
        title: formData.title,
        description: formData.description,
        price_per_hour: parseFloat(formData.price_per_hour),
        specialty: formData.specialty,
        available: formData.available,
      });

      if (error) throw error;

      toast.success("Mentoría creada exitosamente");
      setFormData({
        title: "",
        description: "",
        price_per_hour: "",
        specialty: "",
        available: true,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al crear la mentoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ofrecer nueva mentoría</DialogTitle>
          <DialogDescription>
            Configura tu servicio de mentoría personalizada
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la mentoría *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Consultoría Laravel personalizada"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidad *</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="Ej: Backend Development, Laravel, PHP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe qué tipo de mentoría ofreces, temas que cubres, etc..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_hour">Precio por hora (S/) *</Label>
            <Input
              id="price_per_hour"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_per_hour}
              onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
              placeholder="80.00"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="available">Disponible para agendar</Label>
              <p className="text-sm text-muted-foreground">
                Los estudiantes podrán solicitar sesiones contigo
              </p>
            </div>
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear mentoría"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}