
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BookingFormProps {
  room: any;
  kost: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookingForm = ({ room, kost, onSuccess, onCancel }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    booking_notes: ''
  });

  const calculateTotalAmount = () => {
    if (!formData.start_date || !formData.end_date || !room.price) return 0;
    
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    return diffMonths * room.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Tanggal mulai dan selesai harus diisi",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      toast({
        title: "Error",
        description: "Total pembayaran tidak valid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          room_id: room.id,
          kost_id: kost.id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          total_amount: totalAmount,
          booking_notes: formData.booking_notes,
          status_payment: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Booking berhasil dibuat. Silakan lanjutkan ke pembayaran.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Gagal membuat booking",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotalAmount();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Booking Kamar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Tanggal Mulai</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Tanggal Selesai</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_notes">Catatan (Opsional)</Label>
            <Textarea
              id="booking_notes"
              value={formData.booking_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_notes: e.target.value }))}
              placeholder="Tambahkan catatan untuk booking Anda..."
              rows={3}
            />
          </div>

          {totalAmount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Total Pembayaran:</strong>
              </p>
              <p className="text-lg font-bold text-blue-600">
                Rp {totalAmount.toLocaleString('id-ID')}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memproses...
                </div>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Buat Booking
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
