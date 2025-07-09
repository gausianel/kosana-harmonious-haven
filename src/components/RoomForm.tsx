
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Camera, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    facilities: room?.facilities || '',
    image: room?.image || ''
  });
  const [imagePreview, setImagePreview] = useState(room?.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({
        ...prev,
        image: result
      }));
    };
    reader.readAsDataURL(file);

    toast({
      title: "Gambar berhasil dipilih",
      description: "Gambar akan diupload saat menyimpan data kamar",
    });
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
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

    // Prepare data for submission
    const roomData = {
      ...formData,
      price: Number(formData.price),
      floor: Number(formData.floor)
    };

    onSubmit(roomData);
  };

  const facilitiesList = formData.facilities.split(',').map(f => f.trim()).filter(f => f);

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
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="image">Foto Kamar</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview kamar"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Gambar dipilih
                  </Badge>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Klik untuk upload foto kamar</p>
                    <p className="text-sm text-gray-500">PNG, JPG hingga 5MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room_number">Nomor Kamar *</Label>
              <Input
                id="room_number"
                value={formData.room_number}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
                placeholder="Contoh: A1, B2, 101"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
            <Label htmlFor="facilities">Fasilitas Kamar</Label>
            <Textarea
              id="facilities"
              value={formData.facilities}
              onChange={(e) => handleInputChange('facilities', e.target.value)}
              placeholder="Contoh: AC, WiFi, Tempat Tidur, Lemari, Meja Belajar (pisahkan dengan koma)"
              rows={3}
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            />
            {facilitiesList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {facilitiesList.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {room ? 'Menyimpan...' : 'Menambah...'}
                </div>
              ) : (
                room ? 'Simpan Perubahan' : 'Tambah Kamar'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 transition-all duration-300"
              disabled={loading}
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
