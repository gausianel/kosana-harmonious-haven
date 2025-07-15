
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import KostFacilityChecklist from './KostFacilityChecklist';

interface KostFormProps {
  onSuccess?: () => void;
  existingKost?: any;
}

const KostForm = ({ onSuccess, existingKost }: KostFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: existingKost?.name || '',
    description: existingKost?.description || '',
    address: existingKost?.address || '',
    city: existingKost?.city || '',
    contact_phone: existingKost?.contact_phone || '',
    contact_email: existingKost?.contact_email || '',
    facilities: existingKost?.facilities || []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilitiesChange = (facilities: string[]) => {
    setFormData(prev => ({
      ...prev,
      facilities
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validasi form
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama kost harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Error", 
        description: "Alamat harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Error",
        description: "Kota harus diisi", 
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const kostData = {
        ...formData,
        owner_id: user.id
      };

      let result;
      if (existingKost) {
        result = await supabase
          .from('kosts')
          .update(kostData)
          .eq('id', existingKost.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('kosts')
          .insert([kostData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Berhasil!",
        description: `Data kost berhasil ${existingKost ? 'diperbarui' : 'ditambahkan'}`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error saving kost:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data kost",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {existingKost ? (
            <>
              <span className="text-orange-600">✏️</span>
              Edit Data Kost
            </>
          ) : (
            <>
              <span className="text-green-600">➕</span>
              Tambah Kost Baru
            </>
          )}
        </CardTitle>
        <CardDescription>
          {existingKost 
            ? 'Perbarui informasi kost yang sudah ada. Semua field bisa diubah sesuai kebutuhan.' 
            : 'Tambahkan kost baru ke dalam sistem. Isi informasi dasar terlebih dahulu, gambar bisa ditambahkan nanti.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kost *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kost Mawar Indah"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Contoh: Jl. Mawar No. 123, RT 01/RW 02, Kelurahan ABC, Kecamatan XYZ"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Kost</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsikan kost Anda: lokasi strategis, suasana nyaman, dekat dengan kampus/kantor, dll."
                rows={4}
              />
              <p className="text-sm text-gray-500">Opsional - Deskripsi yang menarik akan membantu menarik calon penyewa</p>
            </div>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informasi Kontak</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Nomor Telepon</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="08123456789"
                />
                <p className="text-sm text-gray-500">Opsional - Untuk dihubungi calon penyewa</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Kontak</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="kontak@kostanda.com"
                />
                <p className="text-sm text-gray-500">Opsional - Email alternatif untuk kontak</p>
              </div>
            </div>
          </div>

          {/* Fasilitas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Fasilitas Kost</h3>
            <p className="text-sm text-gray-600">Pilih fasilitas yang tersedia di kost Anda</p>
            <KostFacilityChecklist
              selectedFacilities={formData.facilities}
              onFacilitiesChange={handleFacilitiesChange}
            />
          </div>

          {/* Info Tambahan */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gambar kost bisa ditambahkan nanti setelah data tersimpan</li>
              <li>• Informasi yang lengkap akan menarik lebih banyak calon penyewa</li>
              <li>• Pastikan nomor kontak aktif untuk memudahkan komunikasi</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </div>
              ) : (
                existingKost ? 'Perbarui Data' : 'Simpan Kost'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KostForm;
