
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Clock } from "lucide-react";

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
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:shadow-md hover:border-blue-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {type === 'booking' ? <Calendar className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            {title}
          </CardTitle>
          {isSelected && (
            <Badge variant="default" className="bg-blue-600">
              Dipilih
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        <div className="space-y-2">
          {type === 'booking' && dpAmount && dpPercentage ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DP ({dpPercentage}%):</span>
                <span className="font-semibold text-blue-600">
                  Rp {dpAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-lg font-bold text-gray-800">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bayar Langsung:</span>
              <span className="text-lg font-bold text-green-600">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>

        {type === 'booking' && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Sisa pembayaran dilakukan saat check-in
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentOption;
