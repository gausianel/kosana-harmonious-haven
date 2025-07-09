
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';

interface Room {
  id: number;
  room_number: string;
  floor: number;
  price: number;
  status: string;
  facilities: string;
  image: string;
  kost_id: string;
}

interface Kost {
  id: string;
  name: string;
  address: string;
  city: string;
}

const RoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [selectedKost, setSelectedKost] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    room_number: '',
    floor: 1,
    price: 0,
    status: 'available',
    facilities: '',
    image: '',
    kost_id: ''
  });

  const statusOptions = [
    { value: 'available', label: 'Tersedia', color: 'bg-green-100 text-green-800' },
    { value: 'booked', label: 'Dibooking', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'occupied', label: 'Penuh', color: 'bg-red-100 text-red-800' },
    { value: 'maintenance', label: 'Perbaikan', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (user) {
      fetchKosts();
    }
  }, [user]);

  useEffect(() => {
    if (selectedKost) {
      fetchRooms();
    }
  }, [selectedKost]);

  const fetchKosts = async () => {
    try {
      const { data, error } = await supabase
        .from('kosts')
        .select('id, name, address, city')
        .eq('owner_id', user?.id);

      if (error) throw error;
      setKosts(data || []);
      if (data && data.length > 0) {
        setSelectedKost(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching kosts:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kost",
        variant: "destructive"
      });
    }
  };

  const fetchRooms = async () => {
    if (!selectedKost) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('kost_id', selectedKost)
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kamar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomData = {
        ...formData,
        kost_id: selectedKost,
        price: Number(formData.price),
        floor: Number(formData.floor)
      };

      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingRoom.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Kamar berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([roomData]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Kamar berhasil ditambahkan"
        });
      }

      setIsDialogOpen(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data kamar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      toast({
        title: "Berhasil",
        description: "Kamar berhasil dihapus"
      });
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus kamar",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ status: newStatus })
        .eq('id', roomId);

      if (error) throw error;
      toast({
        title: "Berhasil",
        description: "Status kamar berhasil diperbarui"
      });
      fetchRooms();
    } catch (error) {
      console.error('Error updating room status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status kamar",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      room_number: '',
      floor: 1,
      price: 0,
      status: 'available',
      facilities: '',
      image: '',
      kost_id: ''
    });
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number || '',
      floor: room.floor || 1,
      price: room.price || 0,
      status: room.status || 'available',
      facilities: room.facilities || '',
      image: room.image || '',
      kost_id: room.kost_id
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Kamar</h2>
          <p className="text-gray-600">Kelola kamar-kamar di properti kost Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingRoom(null);
                resetForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kamar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Perbarui informasi kamar' : 'Tambahkan kamar baru ke properti kost Anda'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="room_number">Nomor Kamar</Label>
                <Input
                  id="room_number"
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                  placeholder="Contoh: A01, B12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="floor">Lantai</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Harga per Bulan (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="facilities">Fasilitas</Label>
                <Textarea
                  id="facilities"
                  value={formData.facilities}
                  onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                  placeholder="AC, Wi-Fi, Kamar Mandi Dalam, dll"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : editingRoom ? 'Perbarui' : 'Tambah'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kost Selector */}
      {kosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilih Properti Kost</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedKost} onValueChange={setSelectedKost}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kost untuk dikelola" />
              </SelectTrigger>
              <SelectContent>
                {kosts.map((kost) => (
                  <SelectItem key={kost.id} value={kost.id}>
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      <span>{kost.name} - {kost.city}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Rooms Table */}
      {selectedKost && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kamar</CardTitle>
            <CardDescription>
              Total: {rooms.length} kamar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data kamar...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Belum ada kamar yang ditambahkan</p>
                <Button onClick={() => {
                  setEditingRoom(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kamar Pertama
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Kamar</TableHead>
                    <TableHead>Lantai</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fasilitas</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>Rp {room.price?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Select 
                          value={room.status} 
                          onValueChange={(value) => handleStatusChange(room.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>{getStatusBadge(room.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">
                        {room.facilities || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(room)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomManagement;
