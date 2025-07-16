
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Clock, CheckCircle } from "lucide-react";

interface PaymentOptionProps {
  type: 'booking' | 'direct';
  title: string;
  description: string;
  amount: number;
  dpAmount?: number;
  dpPercentage?: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const PaymentOption = ({
  type,
  title,
  description,
  amount,
  dpAmount,
  dpPercentage,
  isSelected,
  onSelect,
  disabled = false
}: PaymentOptionProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
          : 'hover:shadow-md hover:border-blue-200 bg-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              type === 'booking' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-green-100 text-green-600'
            }`}>
              {type === 'booking' ? <Calendar className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{title}</span>
          </CardTitle>
          {isSelected && (
            <Badge className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Dipilih
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
        
        <div className={`space-y-3 p-4 rounded-lg ${
          isSelected ? 'bg-white/70' : 'bg-gray-50'
        }`}>
          {type === 'booking' && dpAmount && dpPercentage ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">DP ({dpPercentage}%):</span>
                <span className="font-bold text-lg text-blue-600">
                  Rp {dpAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Total Keseluruhan:</span>
                <span className="text-lg font-bold text-gray-800">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <Clock className="w-3 h-3" />
                <span>Sisa pembayaran saat check-in</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">Bayar Langsung:</span>
              <span className="text-xl font-bold text-green-600">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>

        {type === 'direct' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
            <CheckCircle className="w-3 h-3" />
            <span>Langsung dapat akses setelah pembayaran</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentOption;
