
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

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
  const [newFacility, setNewFacility] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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
        <CardTitle>{existingKost ? 'Edit Data Kost' : 'Tambah Kost Baru'}</CardTitle>
        <CardDescription>
          {existingKost ? 'Perbarui informasi kost Anda' : 'Masukkan informasi kost yang akan Anda kelola'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kost *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Kost Mawar Indah"
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
                placeholder="Jakarta"
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
              placeholder="Jl. Mawar No. 123, RT 01/RW 02, Kelurahan ABC"
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
              placeholder="Kost nyaman dengan fasilitas lengkap, lokasi strategis..."
              rows={4}
            />
          </div>

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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email Kontak</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="kontak@kostmawar.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fasilitas Kost</Label>
            <div className="flex gap-2">
              <Input
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="Tambahkan fasilitas (WiFi, AC, dll)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
              />
              <Button type="button" onClick={addFacility} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {facility}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeFacility(facility)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (existingKost ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KostForm;
