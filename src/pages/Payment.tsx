
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchPaymentData();
  }, [user, id]);

  const fetchPaymentData = async () => {
    if (!id) return;

    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        toast({
          title: "Error",
          description: "ID pembayaran tidak valid",
          variant: "destructive"
        });
        return;
      }

      // Try to fetch booking first
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          kosts:kost_id (name, address),
          rooms:room_id (room_number, price)
        `)
        .eq('id', numericId)
        .single();

      if (bookingData && !bookingError) {
        setBooking(bookingData);
        setLoading(false);
        return;
      }

      // If no booking found, try to fetch payment
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select(`
          *,
          kosts:kost_id (name, address),
          rooms:room_id (room_number, price)
        `)
        .eq('id', id) // payments table uses UUID, so keep as string
        .single();

      if (paymentData && !paymentError) {
        setPayment(paymentData);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pembayaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    // Simulasi proses pembayaran
    toast({
      title: "Pembayaran Diproses",
      description: "Pembayaran Anda sedang diproses. Silakan tunggu...",
    });

    // Simulasi delay pembayaran
    setTimeout(() => {
      toast({
        title: "Pembayaran Berhasil!",
        description: "Pembayaran Anda telah berhasil diproses.",
      });
      
      // Redirect ke halaman sukses atau dashboard
      navigate('/');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const paymentData = booking || payment;
  const amount = booking ? booking.dp_amount || booking.total_amount : payment?.amount;
  const kostName = paymentData?.kosts?.name || 'Kost';
  const roomNumber = paymentData?.rooms?.room_number || '-';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Detail Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Kost:</span>
                  <span className="font-medium">{kostName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kamar:</span>
                  <span className="font-medium">{roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe Pembayaran:</span>
                  <span className="font-medium">
                    {booking ? (booking.payment_type === 'booking' ? 'DP Booking' : 'Bayar Penuh') : 'Pembayaran Langsung'}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total:</span>
                  <span>Rp {amount?.toLocaleString('id-ID') || '0'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Pilih Metode Pembayaran</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-medium">Transfer Bank</p>
                    <p className="text-sm text-gray-600">BCA, Mandiri, BNI</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium">E-Wallet</p>
                    <p className="text-sm text-gray-600">OVO, GoPay, DANA</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bayar Sekarang - Rp {amount?.toLocaleString('id-ID') || '0'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Dengan melakukan pembayaran, Anda menyetujui syarat dan ketentuan yang berlaku.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
