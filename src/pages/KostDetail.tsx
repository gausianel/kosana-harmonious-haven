
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Star, Wifi, Car, Shield, Users } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

const KostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: kost, isLoading: kostLoading } = useQuery({
    queryKey: ['kost', id],
    queryFn: async () => {
      if (!id) throw new Error('Kost ID is required');
      
      const { data, error } = await supabase
        .from('kosts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('kost_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const facilityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'parkir': Car,
    'keamanan': Shield,
    'komunitas': Users,
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk memberikan ulasan",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReview(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          kost_id: id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Ulasan berhasil dikirim",
        description: "Terima kasih atas ulasan Anda!"
      });

      setComment('');
      setRating(5);
      refetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (kostLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!kost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-lg">Kost tidak ditemukan</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{kost.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{kost.address}, {kost.city}</span>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-sm">({reviews?.length} ulasan)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {kost.images && kost.images.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {kost.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${kost.name} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {kost.description || "Kost nyaman dengan fasilitas lengkap untuk kehidupan sehari-hari."}
                </p>
              </CardContent>
            </Card>

            {/* Facilities */}
            {kost.facilities && kost.facilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fasilitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {kost.facilities.map((facility, index) => {
                      const IconComponent = facilityIcons[facility.toLowerCase()] || Users;
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <IconComponent className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Ulasan & Rating</CardTitle>
                <CardDescription>
                  {reviews?.length > 0 
                    ? `${reviews.length} ulasan dari penghuni`
                    : "Belum ada ulasan"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Review Form */}
                {user && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Berikan Ulasan Anda</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setRating(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  i < rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Komentar (Opsional)</label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Ceritakan pengalaman Anda..."
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Belum ada ulasan untuk kost ini.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kost.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{kost.contact_phone}</span>
                  </div>
                )}
                {kost.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{kost.contact_email}</span>
                  </div>
                )}
                <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">
                  Hubungi Pemilik
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KostDetail;
