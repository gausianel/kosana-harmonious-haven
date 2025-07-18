
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import RoomForm from './RoomForm';

interface Room {
  id: number;
  room_number: string;
  floor: number;
  price: number;
  status: string;
  facilities: string;
  images: string[];
  kost_id: string;
  created_at: string;
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

  const statusOptions = [
    { value: 'available', label: 'Tersedia', color: 'bg-green-100 text-green-800' },
    { value: 'booked', label: 'Dibooking', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'occupied', label: 'Terisi', color: 'bg-red-100 text-red-800' },
    { value: 'maintenance', label: 'Perbaikan', color: 'bg-gray-100 text-gray-800' }
  ];

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
      
      // Transform the data to match our Room interface
      const transformedData = (data || []).map(room => ({
        ...room,
        images: room.images || [], // Ensure images is an array
      }));
      
      setRooms(transformedData);
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

  const handleRoomSubmit = async (roomData: any) => {
    setLoading(true);
    try {
      const finalRoomData = {
        ...roomData,
        kost_id: selectedKost
      };

      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(finalRoomData)
          .eq('id', editingRoom.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Kamar berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([finalRoomData]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Kamar berhasil ditambahkan"
        });
      }

      setIsDialogOpen(false);
      setEditingRoom(null);
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

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setEditingRoom(null);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kamar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Perbarui informasi kamar' : 'Tambahkan kamar baru ke properti kost Anda'}
              </DialogDescription>
            </DialogHeader>
            <RoomForm
              room={editingRoom}
              onSubmit={handleRoomSubmit}
              onCancel={() => setIsDialogOpen(false)}
              loading={loading}
            />
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
            <select 
              value={selectedKost} 
              onChange={(e) => setSelectedKost(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {kosts.map((kost) => (
                <option key={kost.id} value={kost.id}>
                  {kost.name} - {kost.city}
                </option>
              ))}
            </select>
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
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsDialogOpen(true);
                  }}
                >
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
                    <TableHead>Gambar</TableHead>
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
                        <select 
                          value={room.status} 
                          onChange={(e) => handleStatusChange(room.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">
                        {room.facilities || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          <span className="text-sm">{room.images?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(room)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
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
