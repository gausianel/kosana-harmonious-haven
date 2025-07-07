
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, Home, Users, DollarSign, User, LogOut, Settings, Plus } from "lucide-react";
import UserProfile from "@/components/UserProfile";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    totalRooms: 12,
    occupiedRooms: 8,
    monthlyRevenue: 15000000,
    pendingBookings: 3
  });

  useEffect(() => {
    if (!loading && (!user || !profile || profile.role !== 'owner')) {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'owner') {
    return null;
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
              <span className="ml-3 text-sm text-gray-500">Dashboard Pemilik</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Beranda
              </Button>
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Selamat Datang, {profile.full_name}!
            </h2>
            <p className="text-gray-600">
              Kelola properti kost Anda dengan mudah melalui dashboard ini
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover-scale animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.totalRooms}</div>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:100ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kamar Terisi</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.occupiedRooms}</div>
                <p className="text-xs text-gray-600">
                  dari {stats.totalRooms} kamar
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:200ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">
                  Rp {stats.monthlyRevenue.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:300ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booking Menunggu</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.pendingBookings}</div>
                <p className="text-xs text-gray-600">
                  perlu konfirmasi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-scale animate-fade-in [animation-delay:400ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Tambah Kamar Baru
                </CardTitle>
                <CardDescription>
                  Tambahkan kamar kost baru ke properti Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Tambah Kamar
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:500ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Kelola Penghuni
                </CardTitle>
                <CardDescription>
                  Lihat dan kelola data penghuni kost
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Penghuni
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:600ms]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Laporan Keuangan
                </CardTitle>
                <CardDescription>
                  Lihat detail pendapatan dan pengeluaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
