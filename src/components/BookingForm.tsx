
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PaymentOption from './PaymentOption';
import PaymentSummary from './PaymentSummary';

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
  const [step, setStep] = useState<'dates' | 'payment' | 'confirm'>('dates');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    booking_notes: '',
    payment_type: 'booking' as 'booking' | 'direct',
    dp_percentage: 30
  });

  const calculateTotalAmount = () => {
    if (!formData.start_date || !formData.end_date || !room.price) return 0;
    
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    return diffMonths * room.price;
  };

  const calculateDpAmount = () => {
    const total = calculateTotalAmount();
    return Math.round(total * (formData.dp_percentage / 100));
  };

  const handleSubmit = async () => {
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
      const dpAmount = formData.payment_type === 'booking' ? calculateDpAmount() : null;
      
      if (formData.payment_type === 'booking') {
        // Create booking with DP
        const { error } = await supabase
          .from('bookings')
          .insert([{
            user_id: user.id,
            room_id: room.id,
            kost_id: kost.id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            total_amount: totalAmount,
            dp_percentage: formData.dp_percentage,
            dp_amount: dpAmount,
            payment_type: 'booking',
            booking_notes: formData.booking_notes,
            status_payment: 'pending'
          }]);

        if (error) throw error;

        toast({
          title: "Booking Berhasil!",
          description: `Booking berhasil dibuat dengan DP sebesar Rp ${dpAmount?.toLocaleString('id-ID')}. Silakan lanjutkan ke pembayaran.`,
        });
      } else {
        // Create direct payment - using raw SQL query since types aren't updated yet
        const { error } = await supabase.rpc('create_direct_payment', {
          p_user_id: user.id,
          p_room_id: room.id,
          p_kost_id: kost.id,
          p_amount: totalAmount,
          p_payment_notes: formData.booking_notes
        });

        // If the RPC doesn't exist, fall back to raw insert
        if (error && error.message.includes('function')) {
          const { error: insertError } = await supabase
            .from('payments' as any)
            .insert([{
              user_id: user.id,
              room_id: room.id,
              kost_id: kost.id,
              amount: totalAmount,
              payment_type: 'direct',
              payment_notes: formData.booking_notes,
              status: 'pending'
            }]);

          if (insertError) throw insertError;
        } else if (error) {
          throw error;
        }

        toast({
          title: "Pembayaran Berhasil Dibuat!",
          description: `Pembayaran langsung sebesar Rp ${totalAmount.toLocaleString('id-ID')} berhasil dibuat. Silakan lanjutkan ke pembayaran.`,
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating booking/payment:', error);
      toast({
        title: "Error",
        description: "Gagal membuat booking atau pembayaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotalAmount();
  const dpAmount = calculateDpAmount();

  if (step === 'dates') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pilih Tanggal Sewa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  <strong>Total Biaya:</strong>
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setStep('payment')}
                className="flex-1"
                disabled={!formData.start_date || !formData.end_date || totalAmount <= 0}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Lanjut ke Pembayaran
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Batal
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pilih Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <PaymentOption
                type="booking"
                title="Booking dengan DP"
                description="Bayar DP terlebih dahulu, sisa pembayaran saat check-in"
                amount={totalAmount}
                dpAmount={dpAmount}
                dpPercentage={formData.dp_percentage}
                isSelected={formData.payment_type === 'booking'}
                onSelect={() => setFormData(prev => ({ ...prev, payment_type: 'booking' }))}
              />
              
              <PaymentOption
                type="direct"
                title="Bayar Langsung"
                description="Bayar penuh langsung tanpa DP"
                amount={totalAmount}
                isSelected={formData.payment_type === 'direct'}
                onSelect={() => setFormData(prev => ({ ...prev, payment_type: 'direct' }))}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setStep('dates')}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                className="flex-1"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Konfirmasi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <PaymentSummary
            room={room}
            kost={kost}
            paymentType={formData.payment_type}
            startDate={formData.start_date}
            endDate={formData.end_date}
            totalAmount={totalAmount}
            dpAmount={formData.payment_type === 'booking' ? dpAmount : undefined}
            dpPercentage={formData.payment_type === 'booking' ? formData.dp_percentage : undefined}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Konfirmasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Pastikan semua informasi sudah benar sebelum melanjutkan.
                </p>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Catatan:</strong> {formData.payment_type === 'booking' 
                      ? 'Setelah pembayaran DP, Anda dapat melakukan check-in dengan melunasi sisa pembayaran.'
                      : 'Setelah pembayaran penuh, Anda dapat langsung melakukan check-in.'
                    }
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep('payment')}
                    className="flex-1"
                    disabled={loading}
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        {formData.payment_type === 'booking' 
                          ? `Bayar DP Rp ${dpAmount.toLocaleString('id-ID')}`
                          : `Bayar Rp ${totalAmount.toLocaleString('id-ID')}`
                        }
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default BookingForm;
