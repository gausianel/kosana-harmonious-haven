
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Car, Shield, Users } from "lucide-react";

interface KostCardProps {
  kost: {
    id: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    facilities?: string[];
    images: string[];
    contact_phone?: string;
    contact_email?: string;
  };
  averageRating?: number;
  reviewCount?: number;
  onViewDetails: (kostId: string) => void;
}

const KostCard = ({ kost, averageRating = 0, reviewCount = 0, onViewDetails }: KostCardProps) => {
  const facilityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'parkir': Car,
    'keamanan': Shield,
    'komunitas': Users,
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        {kost.images && kost.images.length > 0 ? (
          <img 
            src={kost.images[0]} 
            alt={kost.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Foto tidak tersedia</span>
          </div>
        )}
        
        {averageRating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-600">({reviewCount})</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {kost.name}
        </CardTitle>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{kost.city}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-gray-600 line-clamp-2">
          {kost.description || "Kost nyaman dengan fasilitas lengkap untuk kehidupan sehari-hari."}
        </CardDescription>

        {kost.facilities && kost.facilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {kost.facilities.slice(0, 4).map((facility, index) => {
              const IconComponent = facilityIcons[facility.toLowerCase()] || Users;
              return (
                <Badge key={index} variant="secondary" className="text-xs">
                  <IconComponent className="w-3 h-3 mr-1" />
                  {facility}
                </Badge>
              );
            })}
            {kost.facilities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{kost.facilities.length - 4} lainnya
              </Badge>
            )}
          </div>
        )}

        <Button 
          onClick={() => onViewDetails(kost.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
};

export default KostCard;
