
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Building2, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OwnerProfilePopup = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user || !profile) return null;

  const handleSignOut = async () => {
    try {
      console.log('OwnerProfilePopup: Starting logout process...');
      await signOut();
      console.log('OwnerProfilePopup: Sign out successful, navigating to home...');
      
      toast({
        title: "Berhasil logout",
        description: "Anda telah keluar dari dashboard"
      });
      
      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error('OwnerProfilePopup: Logout error:', error);
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="hidden sm:inline text-sm">{profile.full_name || 'Owner'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-gray-800">{profile.full_name || 'Owner'}</CardTitle>
            <Badge variant="default" className="w-fit mx-auto">
              Pemilik Kost
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
      </PopoverContent>
    </Popover>
  );
};

export default OwnerProfilePopup;
