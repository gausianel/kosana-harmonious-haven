
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Building2, Search, Heart, Shield, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserProfile from "@/components/UserProfile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import KostList from "@/components/KostList";
import SearchFilters from "@/components/SearchFilters";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    facilities: [] as string[]
  });

  const handleSearch = (searchFilters: any) => {
    console.log('Search filters:', searchFilters);
    // Update search term and filters based on the search
    if (searchFilters.query) {
      setSearchTerm(searchFilters.query);
    }
    if (searchFilters.location) {
      setFilters(prev => ({ ...prev, city: searchFilters.location }));
    }
    if (searchFilters.facilities) {
      setFilters(prev => ({ ...prev, facilities: searchFilters.facilities }));
    }
  };

  // Sample testimonials data
  const testimonials = [
    {
      name: "Sarah Putri",
      rating: 5,
      comment: "Sangat mudah mencari kost di KostHub! Prosesnya cepat dan aman. Kost yang saya dapat sesuai dengan yang ada di foto dan deskripsi."
    },
    {
      name: "Ahmad Rizki",
      rating: 5,
      comment: "Platform terbaik untuk cari kost! Fitur filternya lengkap dan membantu banget buat nemuin kost yang sesuai budget dan kebutuhan."
    },
    {
      name: "Maya Sari",
      rating: 4,
      comment: "Pelayanan customer service nya responsif. Ketika ada masalah dengan booking, langsung dibantu sampai selesai. Recommended!"
    },
    {
      name: "Budi Santoso",
      rating: 5,
      comment: "Kualitas kost yang terdaftar di KostHub bagus-bagus. Sudah 2 tahun pakai platform ini dan selalu puas dengan pilihan kostnya."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">KostHub</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <UserProfile />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Link to="/auth">
                  <Button>
                    Masuk / Daftar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Moving Background */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Moving Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-indigo-100/70 z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
              alt="Kamar Kost Modern" 
              className="w-full h-full object-cover animate-[pan_20s_ease-in-out_infinite] opacity-60"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
              alt="Interior Kost Nyaman" 
              className="w-full h-full object-cover animate-[pan_25s_ease-in-out_infinite_reverse] opacity-50"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
              alt="Kamar Kost Minimalis" 
              className="w-full h-full object-cover animate-[pan_30s_ease-in-out_infinite] opacity-45"
            />
          </div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Temukan <span className="text-blue-600">Kost Impian</span> Anda
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform terpercaya untuk mencari kost nyaman, aman, dan terjangkau di seluruh Indonesia
          </p>
        </div>
      </section>

      {/* Search Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SearchFilters 
            onSearch={handleSearch}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </section>

      {/* Kost List */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Kost Terbaru</h3>
          </div>
          
          <KostList searchTerm={searchTerm} filters={filters} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Apa Kata Pengguna Kami?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pengalaman nyata dari para pengguna yang telah menemukan kost impian mereka
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                rating={testimonial.rating}
                comment={testimonial.comment}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih KostHub?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan platform terbaik untuk mencari dan mengelola kost
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Terpercaya & Aman</h4>
              <p className="text-gray-600">Semua kost telah diverifikasi dan terjamin keamanannya</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fasilitas Lengkap</h4>
              <p className="text-gray-600">Kost dengan fasilitas modern dan lengkap</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Pelayanan Prima</h4>
              <p className="text-gray-600">Dukungan 24/7 untuk kepuasan Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold">KostHub</h3>
              </div>
              <p className="text-gray-400">
                Platform terpercaya untuk mencari kost impian Anda
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Cari Kost</li>
                <li>Daftar Kost</li>
                <li>Verifikasi</li>
                <li>Bantuan</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tentang Kami</li>
                <li>Karir</li>
                <li>Blog</li>
                <li>Kontak</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>FAQ</li>
                <li>Syarat & Ketentuan</li>
                <li>Kebijakan Privasi</li>
                <li>Bantuan</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KostHub. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
