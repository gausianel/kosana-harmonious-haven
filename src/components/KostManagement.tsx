
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Phone, Mail, Plus, Edit, Wifi, Car, Shield } from "lucide-react";
import KostForm from './KostForm';

const KostManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kosts, setKosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKost, setEditingKost] = useState<any>(null);

  const fetchKosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kosts')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKosts(data || []);
    } catch (error) {
      console.error('Error fetching kosts:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kost",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKosts();
  }, [user]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingKost(null);
    fetchKosts();
  };

  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase();
    if (facilityLower.includes('wifi') || facilityLower.includes('internet')) {
      return <Wifi className="w-4 h-4" />;
    }
    if (facilityLower.includes('parkir') || facilityLower.includes('motor') || facilityLower.includes('mobil')) {
      return <Car className="w-4 h-4" />;
    }
    if (facilityLower.includes('keamanan') || facilityLower.includes('security') || facilityLower.includes('cctv')) {
      return <Shield className="w-4 h-4" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kost Anda</h2>
          <p className="text-gray-600">Kelola informasi kost yang Anda miliki</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Kost Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Kost Baru</DialogTitle>
            </DialogHeader>
            <KostForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {kosts.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Anda belum memiliki data kost
            </CardTitle>
            <CardDescription className="text-gray-600 max-w-md mx-auto">
              Mulai dengan menambahkan informasi kost pertama Anda. Setelah itu, Anda dapat menambahkan kamar-kamar yang tersedia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Kost Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Kost Baru</DialogTitle>
                </DialogHeader>
                <KostForm onSuccess={handleFormSuccess} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {kosts.map((kost) => (
            <Card key={kost.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      {kost.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {kost.city}
                    </CardDescription>
                  </div>
                  <Dialog open={editingKost?.id === kost.id} onOpenChange={(open) => !open && setEditingKost(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingKost(kost)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Data Kost</DialogTitle>
                      </DialogHeader>
                      <KostForm existingKost={editingKost} onSuccess={handleFormSuccess} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Alamat:</strong> {kost.address}
                  </p>
                  {kost.description && (
                    <p className="text-sm text-gray-600">
                      <strong>Deskripsi:</strong> {kost.description}
                    </p>
                  )}
                </div>

                {(kost.contact_phone || kost.contact_email) && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {kost.contact_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {kost.contact_phone}
                      </div>
                    )}
                    {kost.contact_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {kost.contact_email}
                      </div>
                    )}
                  </div>
                )}

                {kost.facilities && kost.facilities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Fasilitas:</p>
                    <div className="flex flex-wrap gap-2">
                      {kost.facilities.map((facility: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {getFacilityIcon(facility)}
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Dibuat: {new Date(kost.created_at).toLocaleDateString('id-ID')}
                  {kost.updated_at !== kost.created_at && (
                    <span> • Diperbarui: {new Date(kost.updated_at).toLocaleDateString('id-ID')}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default KostManagement;
