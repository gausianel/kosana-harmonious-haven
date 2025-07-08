
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Building2, Edit, Save, X, LogOut, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, loading, refreshProfile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });

  useEffect(() => {
    console.log('Profile page - user:', user, 'profile:', profile, 'loading:', loading);
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error",
          description: "Gagal memperbarui profil. Silakan coba lagi.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profil diperbarui",
          description: "Data profil Anda berhasil disimpan"
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui profil.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Berhasil logout",
        description: "Anda telah keluar dari akun"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Anda perlu login untuk mengakses halaman ini</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  // Show loading if profile is still being fetched
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data profil...</p>
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
              <Button
                variant="ghost"
                onClick={() => navigate(profile.role === 'owner' ? '/dashboard' : '/')}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KOSANA
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h2>
            <p className="text-gray-600 mb-8">Kelola informasi profil dan pengaturan akun Anda</p>
          </div>

          {/* Profile Information Card */}
          <Card className="shadow-lg animate-fade-in [animation-delay:200ms] mb-6">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile.role === 'owner' ? (
                  <Building2 className="w-10 h-10 text-blue-600" />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-800 mb-2">
                {profile.full_name || 'Pengguna'}
              </CardTitle>
              <Badge variant={profile.role === 'owner' ? 'default' : 'secondary'} className="mx-auto">
                {profile.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    type="text"
                    value={profile.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profil
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleSave}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: profile.full_name || '',
                          phone: profile.phone || ''
                        });
                      }}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="shadow-lg animate-fade-in [animation-delay:400ms]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Shield className="w-5 h-5" />
                Pengaturan Akun
              </CardTitle>
              <CardDescription>
                Kelola pengaturan keamanan dan akun Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Status Akun</p>
                  <p className="text-sm text-gray-600">Akun Anda aktif dan terverifikasi</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Aktif
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Bergabung Sejak</p>
                  <p className="text-sm text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-4">
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar dari Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
