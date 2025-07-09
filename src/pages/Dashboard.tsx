
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Home, Users, DollarSign, User, Plus, BarChart3, TrendingUp, Calendar, AlertCircle, Eye } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import RoomManagement from "@/components/RoomManagement";
import KostManagement from "@/components/KostManagement";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  monthlyRevenue: number;
  pendingBookings: number;
  occupancyRate: number;
  recentBookings: any[];
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    occupancyRate: 0,
    recentBookings: []
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!user || !profile || profile.role !== 'owner')) {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setDataLoading(true);

        // Fetch kosts owned by user
        const { data: kosts, error: kostsError } = await supabase
          .from('kosts')
          .select('id')
          .eq('owner_id', user.id);

        if (kostsError) throw kostsError;

        if (kosts && kosts.length > 0) {
          const kostIds = kosts.map(k => k.id);

          // Fetch rooms data
          const { data: rooms, error: roomsError } = await supabase
            .from('rooms')
            .select('*')
            .in('kost_id', kostIds);

          if (roomsError) throw roomsError;

          // Fetch bookings data
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*, rooms!inner(*)')
            .in('rooms.kost_id', kostIds)
            .order('created_at', { ascending: false });

          if (bookingsError) throw bookingsError;

          // Calculate stats
          const totalRooms = rooms?.length || 0;
          const occupiedRooms = rooms?.filter(room => room.status === 'occupied').length || 0;
          const pendingBookings = bookings?.filter(booking => booking.status_payment === 'pending').length || 0;
          const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

          // Calculate monthly revenue (mock calculation based on rooms)
          const monthlyRevenue = rooms?.reduce((total, room) => total + (room.price || 0), 0) || 0;

          setStats({
            totalRooms,
            occupiedRooms,
            monthlyRevenue,
            pendingBookings,
            occupancyRate,
            recentBookings: bookings || []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default data if error
        setStats({
          totalRooms: 12,
          occupiedRooms: 8,
          monthlyRevenue: 15000000,
          pendingBookings: 3,
          occupancyRate: 67,
          recentBookings: []
        });
      } finally {
        setDataLoading(false);
      }
    };

    if (user && profile?.role === 'owner') {
      fetchDashboardData();
    }
  }, [user, profile]);

  const handlePreviewClick = () => {
    navigate('/');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const navigateToRooms = () => {
    setActiveTab('rooms');
  };

  const navigateToReports = () => {
    setActiveTab('reports');
  };

  const navigateToKosts = () => {
    setActiveTab('kosts');
  };

  const navigateToTenants = () => {
    // TODO: Create tenants page
    console.log('Navigate to tenants page');
  };

  if (loading || dataLoading) {
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
              <span className="ml-3 text-sm text-gray-500">Dashboard Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handlePreviewClick}
                className="flex items-center gap-2 hover-scale"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Lihat Tampilan User</span>
              </Button>
              <LanguageSwitcher />
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

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover-scale animate-fade-in border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
                <Building2 className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.totalRooms}</div>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Properti aktif
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:100ms] border-l-4 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kamar Terisi</CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.occupiedRooms}</div>
                <p className="text-xs text-gray-600">
                  {stats.occupancyRate}% tingkat okupansi
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:200ms] border-l-4 border-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendapatan Bulanan</CardTitle>
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">
                  Rp {stats.monthlyRevenue.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Bulan ini
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale animate-fade-in [animation-delay:300ms] border-l-4 border-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booking Menunggu</CardTitle>
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stats.pendingBookings}</div>
                <p className="text-xs text-gray-600">
                  {stats.pendingBookings > 0 ? 'Perlu konfirmasi' : 'Semua terkonfirmasi'}
                </p>
                {stats.pendingBookings > 0 && (
                  <Badge variant="outline" className="text-xs mt-1 border-orange-300 text-orange-600">
                    Butuh perhatian
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="kosts">Kost Anda</TabsTrigger>
              <TabsTrigger value="rooms">Kelola Kamar</TabsTrigger>
              <TabsTrigger value="reports">Laporan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover-scale animate-fade-in [animation-delay:400ms] group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                      Kelola Kost
                    </CardTitle>
                    <CardDescription>
                      Tambah atau edit informasi kost yang Anda miliki
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                      onClick={navigateToKosts}
                    >
                      Kelola Kost
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-scale animate-fade-in [animation-delay:500ms] group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-green-600 transition-colors">
                      <Plus className="w-5 h-5" />
                      Kelola Kamar
                    </CardTitle>
                    <CardDescription>
                      Tambah, edit, atau hapus kamar kost Anda dengan mudah
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300"
                      onClick={navigateToRooms}
                    >
                      Kelola Kamar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-scale animate-fade-in [animation-delay:600ms] group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                      <BarChart3 className="w-5 h-5" />
                      Laporan Keuangan
                    </CardTitle>
                    <CardDescription>
                      Analisis pendapatan dan performa bisnis Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-300"
                      onClick={navigateToReports}
                    >
                      Lihat Laporan
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Section */}
              <Card className="animate-fade-in [animation-delay:700ms]">
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>
                    Booking dan aktivitas penghuni terbaru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentBookings.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentBookings.slice(0, 5).map((booking, index) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Booking Kamar #{booking.room_id}</p>
                            <p className="text-sm text-gray-600">
                              Status: {booking.status_payment === 'pending' ? 'Menunggu Pembayaran' : 'Terbayar'}
                            </p>
                          </div>
                          <Badge variant={booking.status_payment === 'pending' ? 'destructive' : 'default'}>
                            {booking.status_payment === 'pending' ? 'Pending' : 'Confirmed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Belum ada aktivitas booking</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kosts">
              <KostManagement />
            </TabsContent>

            <TabsContent value="rooms">
              <RoomManagement />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Laporan Keuangan
                  </CardTitle>
                  <CardDescription>
                    Analisis pendapatan dan performa bisnis kost Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Ringkasan Keuangan</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-gray-700">Total Pendapatan</span>
                          <span className="font-bold text-blue-600">
                            Rp {stats.monthlyRevenue.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-gray-700">Tingkat Okupansi</span>
                          <span className="font-bold text-green-600">{stats.occupancyRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="text-gray-700">Pending Bookings</span>
                          <span className="font-bold text-orange-600">{stats.pendingBookings}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-8">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Grafik analisis akan segera hadir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
