
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Wifi, Car, Shield, Star, User, LogIn } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import SearchFilters from "@/components/SearchFilters";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // TODO: Implement search functionality
  };

  const features = [
    { icon: Wifi, title: "WiFi Gratis", description: "Internet cepat 24/7" },
    { icon: Car, title: "Parkir Aman", description: "Area parkir terjaga" },
    { icon: Shield, title: "Keamanan", description: "CCTV & security" },
    { icon: Users, title: "Komunitas", description: "Lingkungan ramah" }
  ];

  const testimonials = [
    {
      name: "Sarah",
      rating: 5,
      comment: "Kost yang nyaman dan bersih, fasilitas lengkap!"
    },
    {
      name: "Andi",
      rating: 5,
      comment: "Pelayanan ramah, lokasi strategis dekat kampus."
    },
    {
      name: "Maya",
      rating: 4,
      comment: "Harga terjangkau dengan kualitas terbaik."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KOSANA
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Profil</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <UserProfile />
                  </PopoverContent>
                </Popover>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Gallery */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <ImageCarousel />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-scale-in">
              KOSANA
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in [animation-delay:200ms]">
              Temukan Kost Impianmu dengan Mudah
            </p>
            <p className="text-lg text-white/80 mb-12 animate-fade-in [animation-delay:400ms]">
              Platform terpercaya untuk mencari dan menyewa kost terbaik di seluruh Indonesia
            </p>
          </div>

          {/* Enhanced Search Form */}
          <div className="animate-fade-in [animation-delay:600ms]">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih KOSANA?
            </h2>
            <p className="text-xl text-gray-600">
              Fasilitas terbaik untuk kenyamanan hunian Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover-scale animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Kata Mereka Tentang KOSANA
            </h2>
            <p className="text-xl text-gray-600">
              Testimoni dari penghuni kost yang puas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold text-gray-800">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Siap Menemukan Kost Impianmu?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Bergabunglah dengan ribuan penghuni yang telah merasakan kenyamanan bersama KOSANA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg hover-scale"
            >
              Mulai Cari Kost
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg hover-scale"
            >
              Daftar Sebagai Pemilik
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
