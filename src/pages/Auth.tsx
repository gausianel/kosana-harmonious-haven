
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Building2, CheckCircle } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle role-based redirects after authentication
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'owner') {
        navigate('/dashboard');
        toast({
          title: "Selamat datang!",
          description: "Anda telah berhasil masuk ke dashboard pemilik kost.",
        });
      } else {
        navigate('/');
        toast({
          title: "Selamat datang!",
          description: "Anda telah berhasil masuk ke KOSANA.",
        });
      }
    }
  }, [user, profile, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error masuk",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          toast({
            title: "Error pendaftaran",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Pendaftaran berhasil!",
            description: "Silakan periksa email Anda untuk verifikasi. Setelah verifikasi, Anda akan diarahkan ke halaman yang sesuai.",
            duration: 7000,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            KOSANA
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Masuk ke akun Anda' : 'Daftar akun baru'}
          </p>
        </div>

        <Card className="shadow-lg animate-fade-in [animation-delay:200ms] hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLogin ? 'Masuk' : 'Daftar'}
              {!isLogin && <CheckCircle className="w-5 h-5 text-green-500" />}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Masukkan email dan password Anda'
                : 'Buat akun baru untuk mulai menggunakan KOSANA'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="animate-fade-in transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Daftar Sebagai</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={role === 'user' ? 'default' : 'outline'}
                        onClick={() => setRole('user')}
                        className="flex items-center justify-center gap-2 hover-scale transition-all duration-300"
                      >
                        <User className="w-4 h-4" />
                        Pencari Kost
                      </Button>
                      <Button
                        type="button"
                        variant={role === 'owner' ? 'default' : 'outline'}
                        onClick={() => setRole('owner')}
                        className="flex items-center justify-center gap-2 hover-scale transition-all duration-300"
                      >
                        <Building2 className="w-4 h-4" />
                        Pemilik Kost
                      </Button>
                    </div>
                    {role === 'owner' && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md animate-fade-in">
                        Sebagai pemilik kost, Anda akan diarahkan ke dashboard untuk mengelola properti.
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 hover-scale transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses...
                  </div>
                ) : (
                  isLogin ? 'Masuk' : 'Daftar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 hover-scale"
              >
                {isLogin 
                  ? 'Belum punya akun? Daftar di sini'
                  : 'Sudah punya akun? Masuk di sini'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
