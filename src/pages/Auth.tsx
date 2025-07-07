
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Building2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        } else {
          toast({
            title: "Berhasil masuk",
            description: "Selamat datang di KOSANA!"
          });
          navigate('/');
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
            title: "Pendaftaran berhasil",
            description: "Silakan periksa email Anda untuk verifikasi."
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
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KOSANA</h1>
          <p className="text-gray-600">
            {isLogin ? 'Masuk ke akun Anda' : 'Daftar akun baru'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isLogin ? 'Masuk' : 'Daftar'}</CardTitle>
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
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Daftar Sebagai</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={role === 'user' ? 'default' : 'outline'}
                        onClick={() => setRole('user')}
                        className="flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Pencari Kost
                      </Button>
                      <Button
                        type="button"
                        variant={role === 'owner' ? 'default' : 'outline'}
                        onClick={() => setRole('owner')}
                        className="flex items-center justify-center gap-2"
                      >
                        <Building2 className="w-4 h-4" />
                        Pemilik Kost
                      </Button>
                    </div>
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
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800"
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
