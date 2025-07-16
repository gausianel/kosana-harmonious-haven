
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, ArrowRight, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PaymentOption from './PaymentOption';

interface DirectPaymentButtonProps {
  room: any;
  kost: any;
}

const DirectPaymentButton = ({ room, kost }: DirectPaymentButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'dates' | 'info' | 'payment' | 'confirm'>('dates');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    payment_notes: '',
    payment_type: 'direct' as 'direct'
  });

  const basePrice = room.price || 0;

  const calculateTotalAmount = () => {
    if (!formData.start_date || !formData.end_date || !basePrice) return 0;
    
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    return diffMonths * basePrice;
  };

  const calculateMonthsDuration = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  };

  const amount = calculateTotalAmount();

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

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Harga kamar tidak valid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          room_id: room.id,
          kost_id: kost.id,
          amount: amount,
          payment_type: 'direct',
          payment_notes: formData.payment_notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Pembayaran Berhasil Dibuat!",
        description: `Pembayaran langsung sebesar Rp ${amount.toLocaleString('id-ID')} berhasil dibuat.`,
      });

      // Navigate to payment page
      navigate(`/payment/${data.id}`);
      setOpen(false);
    } catch (error) {
      console.error('Error creating direct payment:', error);
      toast({
        title: "Error",
        description: "Gagal membuat pembayaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'dates') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            size="lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Bayar Sekarang
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Pilih Tanggal Sewa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Tanggal Mulai</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
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
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {formData.start_date && formData.end_date && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Ringkasan Biaya</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <span className="font-medium">{calculateMonthsDuration()} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga per bulan:</span>
                    <span className="font-medium">Rp {basePrice.toLocaleString('id-ID')}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Bayar:</span>
                    <span>Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep('info')}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!formData.start_date || !formData.end_date || amount <= 0}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Lanjut ke Detail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'info') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Detail Pembayaran
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Ringkasan Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Kost:</span>
                  <span className="font-medium">{kost.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kamar:</span>
                  <span className="font-medium">{room.room_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Mulai:</span>
                  <span className="font-medium">{new Date(formData.start_date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Selesai:</span>
                  <span className="font-medium">{new Date(formData.end_date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi:</span>
                  <span className="font-medium">{calculateMonthsDuration()} bulan</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga per bulan:</span>
                  <span className="font-medium">Rp {basePrice.toLocaleString('id-ID')}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-green-600">
                  <span>Total Bayar:</span>
                  <span>Rp {amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_notes">Catatan Pembayaran (Opsional)</Label>
              <Textarea
                id="payment_notes"
                value={formData.payment_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_notes: e.target.value }))}
                placeholder="Tambahkan catatan untuk pembayaran Anda..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('dates')}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={() => setStep('payment')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Lanjut ke Pembayaran
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'payment') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Konfirmasi Metode Pembayaran
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <PaymentOption
              type="direct"
              title="Pembayaran Langsung"
              description={`Bayar penuh untuk ${calculateMonthsDuration()} bulan sewa`}
              amount={amount}
              isSelected={true}
              onSelect={() => {}}
              disabled={true}
            />

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('info')}
                className="flex-1"
                disabled={loading}
              >
                Kembali
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
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
                    Bayar Sekarang
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default DirectPaymentButton;
