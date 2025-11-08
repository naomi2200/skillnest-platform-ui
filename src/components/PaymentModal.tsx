import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  onSuccess: () => void;
}

export const PaymentModal = ({ open, onClose, amount, itemName, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "¡Pago exitoso!",
      description: `Has comprado ${itemName} por $${amount}`,
    });
    
    setLoading(false);
    onSuccess();
    onClose();
    resetForm();
  };

  const handleMobilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "¡Pago exitoso!",
      description: `Has comprado ${itemName} por $${amount}`,
    });
    
    setLoading(false);
    onSuccess();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
    setPhoneNumber('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Completar pago</DialogTitle>
          <DialogDescription>
            {itemName} - ${amount}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              Tarjeta
            </TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4 mr-2" />
              Yape/Plin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Número de tarjeta</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                <Input
                  id="card-name"
                  placeholder="NOMBRE APELLIDO"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Vencimiento</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : `Pagar $${amount}`}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="paypal">
            <div className="space-y-4 py-4">
              <div className="text-center text-muted-foreground">
                Serás redirigido a PayPal para completar el pago
              </div>
              <Button 
                className="w-full bg-[#0070ba] hover:bg-[#005ea6]" 
                onClick={() => {
                  toast({
                    title: "Redirigiendo a PayPal...",
                    description: "Esta es una demo. En producción se abrirá PayPal.",
                  });
                }}
              >
                Continuar con PayPal
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <form onSubmit={handleMobilePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">Número de celular</Label>
                <Input
                  id="phone-number"
                  placeholder="999 999 999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Instrucciones:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Abre tu app Yape o Plin</li>
                  <li>Envía ${amount} al número 999-888-777</li>
                  <li>Usa como concepto: {itemName}</li>
                  <li>Haz click en "Confirmar pago"</li>
                </ol>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pago'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
