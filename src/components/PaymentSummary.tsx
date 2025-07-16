
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Calendar, Home, User } from "lucide-react";

interface PaymentSummaryProps {
  room: any;
  kost: any;
  paymentType: 'booking' | 'direct';
  startDate: string;
  endDate: string;
  totalAmount: number;
  dpAmount?: number;
  dpPercentage?: number;
}

const PaymentSummary = ({
  room,
  kost,
  paymentType,
  startDate,
  endDate,
  totalAmount,
  dpAmount,
  dpPercentage
}: PaymentSummaryProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Ringkasan Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Kost & Room Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{kost.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Kamar {room.room_number}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Durasi Sewa</span>
          </div>
          <span className="font-medium">{calculateDuration()} bulan</span>
        </div>

        {/* Dates */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Mulai:</span>
            <span className="font-medium">{formatDate(startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Selesai:</span>
            <span className="font-medium">{formatDate(endDate)}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Harga per bulan:</span>
              <span>Rp {room.price?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Type Badge */}
          <div className="mt-3">
            <Badge 
              variant={paymentType === 'booking' ? 'secondary' : 'default'}
              className={paymentType === 'booking' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
            >
              {paymentType === 'booking' ? 'Booking dengan DP' : 'Bayar Langsung'}
            </Badge>
          </div>

          {/* DP Details */}
          {paymentType === 'booking' && dpAmount && dpPercentage && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">DP yang harus dibayar:</span>
                  <span className="font-semibold text-blue-600">
                    Rp {dpAmount.toLocaleString('id-ID')} ({dpPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sisa pembayaran:</span>
                  <span className="font-medium">
                    Rp {(totalAmount - dpAmount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
