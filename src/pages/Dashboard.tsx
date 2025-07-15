
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, DollarSign } from "lucide-react";
import KostManagement from "@/components/KostManagement";
import RoomManagement from "@/components/RoomManagement";
import OwnerProfilePopup from "@/components/OwnerProfilePopup";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kosts");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
                <p className="text-sm text-gray-600">Kelola properti kost Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <OwnerProfilePopup />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kosts" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Kost Saya
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Kamar
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kosts" className="space-y-6">
            <KostManagement />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <RoomManagement />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Booking</CardTitle>
                <CardDescription>
                  Kelola booking dan pembayaran dari penyewa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur booking sedang dalam pengembangan</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Anda akan dapat melihat dan mengelola semua booking dari sini
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analitik & Laporan</CardTitle>
                <CardDescription>
                  Lihat performa dan statistik properti kost Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur analitik sedang dalam pengembangan</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Anda akan dapat melihat laporan pendapatan, okupansi, dan metrik lainnya
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
