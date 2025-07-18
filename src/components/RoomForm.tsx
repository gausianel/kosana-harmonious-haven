import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Camera, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import FacilityChecklist from './FacilityChecklist';

interface RoomFormProps {
  room?: any;
  onSubmit: (roomData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RoomForm = ({ room, onSubmit, onCancel, loading = false }: RoomFormProps) => {
  const [formData, setFormData] = useState({
    room_number: room?.room_number || '',
    floor: room?.floor || 1,
    price: room?.price || '',
    status: room?.status || 'available',
    facilities: room?.facilities ? room.facilities.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
    images: room?.images || []
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilitiesChange = (facilities: string[]) => {
    setFormData(prev => ({
      ...prev,
      facilities
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: `File ${file.name} bukan gambar`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `File ${file.name} terlalu besar (maksimal 5MB)`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Gambar berhasil dipilih",
        description: `${validFiles.length} gambar akan diupload saat menyimpan data kamar`,
      });
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((url: string) => url !== imageUrl)
    }));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Error",
            description: `Gagal upload ${file.name}`,
            variant: "destructive"
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('room-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat upload gambar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.room_number.trim()) {
      toast({
        title: "Error",
        description: "Nomor kamar harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast({
        title: "Error",
        description: "Harga sewa harus diisi dengan nilai yang valid",
        variant: "destructive"
      });
      return;
    }

    // Upload new images
    const newImageUrls = await uploadImages();
    
    // Combine existing images with new uploaded images
    const allImages = [...formData.images, ...newImageUrls];

    const roomData = {
      ...formData,
      price: Number(formData.price),
      floor: Number(formData.floor),
      facilities: formData.facilities.join(', '),
      images: allImages
    };

    onSubmit(roomData);
  };

  const totalImages = formData.images.length + imageFiles.length;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          {room ? 'Edit Kamar' : 'Tambah Kamar Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room_number">Nomor Kamar *</Label>
              <Input
                id="room_number"
                value={formData.room_number}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
                placeholder="Contoh: A1, B2, 101"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Lantai</Label>
              <Select value={formData.floor.toString()} onValueChange={(value) => handleInputChange('floor', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lantai" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(floor => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Lantai {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga Sewa per Bulan (Rp) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Contoh: 1500000"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Kamar</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="occupied">Terisi</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fasilitas Kamar</Label>
            <FacilityChecklist
              selectedFacilities={formData.facilities}
              onFacilitiesChange={handleFacilitiesChange}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="images">Foto Kamar ({totalImages}/10)</Label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600">Upload beberapa foto kamar sekaligus</p>
                <p className="text-sm text-gray-500">PNG, JPG hingga 5MB per file (Maksimal 10 foto)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
                disabled={totalImages >= 10}
              >
                {totalImages >= 10 ? 'Maksimal 10 Foto' : 'Pilih Gambar'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={totalImages >= 10}
              />
            </div>

            {/* Existing Images */}
            {formData.images.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Foto yang sudah ada:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Room ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                        onClick={() => removeExistingImage(imageUrl)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {imageFiles.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Foto baru yang akan diupload:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <Badge className="absolute bottom-1 left-1 bg-blue-500 text-xs">
                        <Check className="w-2 h-2 mr-1" />
                        Baru
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || uploading}
            >
              {loading || uploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {uploading ? 'Mengupload...' : room ? 'Menyimpan...' : 'Menambah...'}
                </div>
              ) : (
                room ? 'Simpan Perubahan' : 'Tambah Kamar'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading || uploading}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomForm;
