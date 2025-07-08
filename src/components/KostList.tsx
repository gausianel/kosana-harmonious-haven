
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import KostCard from './KostCard';
import { useNavigate } from 'react-router-dom';

interface Kost {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  facilities: string[];
  images: string[];
  contact_phone?: string;
  contact_email?: string;
}

interface KostWithRating extends Kost {
  averageRating: number;
  reviewCount: number;
}

const KostList = () => {
  const navigate = useNavigate();

  const { data: kosts, isLoading, error } = useQuery({
    queryKey: ['kosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kosts')
        .select(`
          *,
          reviews (
            rating
          )
        `);
      
      if (error) throw error;

      // Calculate average rating and review count for each kost
      const kostsWithRating: KostWithRating[] = data.map(kost => {
        const reviews = kost.reviews || [];
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
          : 0;
        
        return {
          ...kost,
          averageRating,
          reviewCount: reviews.length
        };
      });

      return kostsWithRating;
    }
  });

  const handleViewDetails = (kostId: string) => {
    navigate(`/kost/${kostId}`);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Terjadi kesalahan saat memuat data kost.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
      </div>
    );
  }

  if (!kosts || kosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Belum ada kost yang tersedia.</p>
        <p className="text-gray-500 mt-2">Kost baru akan segera hadir!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kosts.map((kost) => (
        <KostCard
          key={kost.id}
          kost={kost}
          averageRating={kost.averageRating}
          reviewCount={kost.reviewCount}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
};

export default KostList;
