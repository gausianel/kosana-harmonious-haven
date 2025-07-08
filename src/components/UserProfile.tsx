
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user || !profile) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Berhasil logout",
        description: "Anda telah keluar dari akun"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const handleProfileClick = () => {
    console.log('Navigating to profile page');
    navigate('/profile');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          {profile.role === 'owner' ? (
            <Building2 className="w-8 h-8 text-blue-600" />
          ) : (
            <User className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <CardTitle className="text-gray-800">{profile.full_name || 'Pengguna'}</CardTitle>
        <Badge variant={profile.role === 'owner' ? 'default' : 'secondary'}>
          {profile.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">
          <p>Email: {user.email}</p>
          {profile.phone && <p>Telepon: {profile.phone}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleProfileClick}
            className="w-full justify-start hover-scale"
          >
            <Settings className="w-4 h-4 mr-2" />
            Lihat Profil
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 hover-scale"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
