import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Wifi, Car, Shield, Star, Building2, Users, Calendar } from "lucide-react";
import BookingForm from '@/components/BookingForm';
import DirectPaymentButton from '@/components/DirectPaymentButton';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';

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
      fetchKostDetail();
      fetchRooms();
      fetchReviews();
    }
  }, [id]);

  const fetchKostDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('kosts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setKost(data);
    } catch (error) {
      console.error('Error fetching kost detail:', error);
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
          profiles:user_id (full_name)
        `)
        .eq('kost_id', id)
        .order('created_at', { ascending: false });

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
    return null;
  };

  const calculateAverageRating = (): string => {
    if (reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
    toast({
      title: "Booking Berhasil!",
      description: "Booking Anda telah berhasil dibuat.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Kost Tidak Ditemukan</CardTitle>
            <CardDescription>Kost yang Anda cari tidak tersedia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Halo, {user.email}</span>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">Profile</Button>
                  </Link>
                </div>
              ) : (
                <Link to="/auth">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kost Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      {kost.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {kost.address}, {kost.city}
                    </CardDescription>
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{averageRating}</span>
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

                {kost.facilities && kost.facilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Fasilitas</h3>
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

            {/* Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Kamar Tersedia
                </CardTitle>
                <CardDescription>
                  Pilih kamar yang sesuai dengan kebutuhan Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rooms.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada kamar tersedia</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold text-lg">Kamar {room.room_number}</h3>
                              <Badge variant={room.status === 'available' ? 'default' : 'secondary'}>
                                {room.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Lantai: {room.floor}</p>
                              {room.facilities && <p>Fasilitas: {room.facilities}</p>}
                              <p className="text-lg font-bold text-blue-600">
                                Rp {room.price?.toLocaleString('id-ID')}/bulan
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {user && room.status === 'available' ? (
                              <>
                                <Dialog open={showBookingForm && selectedRoom?.id === room.id} onOpenChange={(open) => {
                                  setShowBookingForm(open);
                                  if (!open) setSelectedRoom(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      onClick={() => setSelectedRoom(room)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Calendar className="w-4 h-4 mr-2" />
                                      Booking
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Booking Kamar {room.room_number}</DialogTitle>
                                    </DialogHeader>
                                    <BookingForm 
                                      room={room} 
                                      kost={kost} 
                                      onSuccess={handleBookingSuccess}
                                      onCancel={() => {
                                        setShowBookingForm(false);
                                        setSelectedRoom(null);
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <DirectPaymentButton room={room} kost={kost} />
                              </>
                            ) : !user ? (
                              <Link to="/auth">
                                <Button variant="outline">Login untuk Booking</Button>
                              </Link>
                            ) : (
                              <Button disabled>Tidak Tersedia</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Ulasan ({reviews.length})
                </CardTitle>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={parseFloat(averageRating)} />
                    <span className="text-lg font-semibold">{averageRating}</span>
                    <span className="text-gray-500">dari {reviews.length} ulasan</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada ulasan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard 
                        key={review.id} 
                        review={review}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Informasi Kost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {rooms.length > 0 ? (
                      `Rp ${Math.min(...rooms.map(r => r.price || 0)).toLocaleString('id-ID')} - ${Math.max(...rooms.map(r => r.price || 0)).toLocaleString('id-ID')}`
                    ) : (
                      'Harga belum tersedia'
                    )}
                  </div>
                  <p className="text-gray-600">per bulan</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Kamar:</span>
                    <span className="font-semibold">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tersedia:</span>
                    <span className="font-semibold text-green-600">
                      {rooms.filter(r => r.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{averageRating || 'Belum ada'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KostDetail;
