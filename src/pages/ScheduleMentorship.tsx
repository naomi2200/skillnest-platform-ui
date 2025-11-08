import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, Video } from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { toast } from '@/hooks/use-toast';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function ScheduleMentorship() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentOpen, setPaymentOpen] = useState(false);

  const mentorPrice = 80; // This would come from mentor data

  const handleSchedule = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Selección incompleta",
        description: "Por favor selecciona una fecha y hora.",
        variant: "destructive",
      });
      return;
    }
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "¡Mentoría agendada!",
      description: "Recibirás un email con los detalles de la sesión.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Agendar Mentoría</h1>
          <p className="text-muted-foreground mb-8">
            Selecciona la fecha y hora para tu sesión personalizada
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Selecciona una fecha</CardTitle>
                <CardDescription>Elige el día de tu preferencia</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Horarios disponibles</CardTitle>
                  <CardDescription>
                    {date ? date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selecciona una fecha'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la sesión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <span>Videollamada 1 a 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Duración: 1 hora</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total a pagar</span>
                      <span className="text-2xl font-bold">${mentorPrice}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleSchedule}
                      disabled={!date || !selectedTime}
                    >
                      Continuar al pago
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={mentorPrice}
        itemName="Mentoría 1 a 1"
        onSuccess={handlePaymentSuccess}
      />

      <Footer />
    </div>
  );
}
