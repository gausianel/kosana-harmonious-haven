
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import KostCard from './KostCard';

interface Kost {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  images?: string[];
  contact_phone?: string;
  contact_email?: string;
  facilities?: string[];
  rooms?: Array<{
    id: number;
    price: number;
    status: string;
    image?: string;
  }>;
}

const KostList = () => {
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKosts();
  }, []);

  const fetchKosts = async () => {
    try {
      // First, fetch kosts
      const { data: kostsData, error: kostsError } = await supabase
        .from('kosts')
        .select('*')
        .order('created_at', { ascending: false });

      if (kostsError) {
        console.error('Error fetching kosts:', kostsError);
        setLoading(false);
        return;
      }

      // Then fetch rooms for each kost to get room images and pricing
      const kostsWithRooms = await Promise.all(
        (kostsData || []).map(async (kost) => {
          const { data: roomsData } = await supabase
            .from('rooms')
            .select('id, price, status, image')
            .eq('kost_id', kost.id)
            .eq('status', 'available');

          // Combine kost images with room images, prioritizing room images
          const roomImages = (roomsData || [])
            .filter(room => room.image)
            .map(room => room.image);
          
          const kostImages = kost.images || [];
          const allImages = [...roomImages, ...kostImages].filter(Boolean);

          return {
            ...kost,
            rooms: roomsData || [],
            images: allImages.length > 0 ? allImages : kostImages // Use combined images or fallback to kost images
          };
        })
      );

      setKosts(kostsWithRooms);
    } catch (error) {
      console.error('Error fetching kosts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat daftar kost...</p>
      </div>
    );
  }

  if (kosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">Belum ada kost yang tersedia</p>
        <p className="text-gray-500">Silakan coba lagi nanti atau hubungi admin</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {kosts.map((kost) => (
        <KostCard key={kost.id} kost={kost} />
      ))}
    </div>
  );
};

export default KostList;
