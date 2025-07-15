
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Phone, Mail, Wifi, Car, Shield, Calendar, CreditCard, Home, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ImageCarousel from '@/components/ImageCarousel';
import BookingForm from '@/components/BookingForm';
import StarRating from '@/components/StarRating';

const KostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [kost, setKost] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchKostDetails();
      fetchRooms();
      fetchReviews();
    }
  }, [id]);

  const fetchKostDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('kosts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setKost(data);
    } catch (error) {
      console.error('Error fetching kost details:', error);
      toast({
        title: "Error",
        description: "Gagal memuat detail kost",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('kost_id', id)
        .eq('status', 'available')
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('kost_id', id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
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
    return <Home className="w-4 h-4" />;
  };

  const handleBookRoom = (room: any) => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melakukan booking",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
    toast({
      title: "Booking Berhasil!",
      description: "Booking Anda telah berhasil dibuat. Silakan lanjutkan pembayaran.",
    });
  };

  // Simulasi rating untuk setiap kamar (dalam implementasi nyata, ini akan diambil dari database)
  const getRoomRating = (roomId: number) => {
    // Simulasi rating antara 3.5 - 5.0
    const ratings = [4.2, 4.7, 3.8, 4.5, 4.1, 4.9, 3.9, 4.3, 4.6, 4.0];
    return ratings[roomId % ratings.length] || 4.0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kost tidak ditemukan</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kost Images */}
            {kost.images && kost.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <ImageCarousel images={kost.images} />
                </CardContent>
              </Card>
            )}

            {/* Kost Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">{kost.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <MapPin className="w-4 h-4" />
                      {kost.address}, {kost.city}
                    </CardDescription>
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-500">({reviews.length} ulasan)</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {kost.description && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                    <p className="text-gray-600">{kost.description}</p>
                  </div>
                )}

                {/* Contact Information */}
                {(kost.contact_phone || kost.contact_email) && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Kontak</h3>
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
                  </div>
                )}

                {/* Facilities */}
                {kost.facilities && kost.facilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Fasilitas Umum</h3>
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
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Kamar Tersedia
                </CardTitle>
                <CardDescription>
                  {rooms.length} kamar tersedia untuk disewa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rooms.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Tidak ada kamar yang tersedia saat ini</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-lg">Kamar {room.room_number}</h4>
                              <StarRating 
                                rating={getRoomRating(room.id)} 
                                size="sm"
                                className="bg-white px-2 py-1 rounded-full shadow-sm border"
                              />
                            </div>
                            <p className="text-gray-600">Lantai {room.floor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              Rp {room.price?.toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-500">per bulan</p>
                          </div>
                        </div>

                        {/* Room Images */}
                        {room.image && (
                          <div className="mb-3">
                            <img 
                              src={room.image} 
                              alt={`Kamar ${room.room_number}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {room.facilities && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Fasilitas:</p>
                            <p className="text-sm text-gray-600">{room.facilities}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleBookRoom(room)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Booking Sekarang
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Bayar Langsung
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Singkat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Kamar</span>
                  <span className="font-semibold">{rooms.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kamar Tersedia</span>
                  <span className="font-semibold text-green-600">{rooms.length}</span>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <StarRating rating={averageRating} size="sm" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0">
                      <StarRating rating={review.rating} size="sm" showNumber={false} className="mb-1" />
                      <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        {review.profiles?.full_name || 'Anonymous'}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Kamar {selectedRoom?.room_number}</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk melakukan booking kamar
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <BookingForm
              room={selectedRoom}
              kost={kost}
              onSuccess={handleBookingSuccess}
              onCancel={() => setShowBookingForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KostDetail;
