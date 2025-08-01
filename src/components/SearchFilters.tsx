
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  filters?: {
    city: string;
    minPrice: string;
    maxPrice: string;
    facilities: string[];
  };
  onFiltersChange?: (filters: any) => void;
}

const SearchFilters = ({ onSearch, filters, onFiltersChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([500000, 3000000]);
  const [roomType, setRoomType] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableFacilities = [
    "WiFi", "AC", "Kamar Mandi Dalam", "Parkir", "Dapur", "Laundry", "Security", "CCTV"
  ];

  const toggleFacility = (facility: string) => {
    setFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      location,
      priceRange,
      roomType,
      facilities
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setPriceRange([500000, 3000000]);
    setRoomType("");
    setFacilities([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar - Compact */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Cari kost di area yang kamu inginkan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 text-base border-2 border-white/30 bg-white/90 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder:text-gray-600"
          />
        </div>
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Lokasi (contoh: Jakarta, Bandung)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 text-base border-2 border-white/30 bg-white/90 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 pl-10 text-gray-800 placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSearch}
            size="default" 
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Search className="w-4 h-4 mr-2" />
            Cari Kost
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-11 px-3 border-2 border-white/30 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters - Compact */}
      {showAdvanced && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-3 animate-fade-in shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-800">Filter Lanjutan</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Rentang Harga</Label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={5000000}
                  min={300000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Rp {priceRange[0].toLocaleString()}</span>
                  <span>Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Tipe Kamar</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="text-gray-800 h-9">
                  <SelectValue placeholder="Pilih tipe kamar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Facilities */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label className="text-gray-700 font-medium text-sm">Fasilitas</Label>
              <div className="flex flex-wrap gap-1">
                {availableFacilities.map((facility) => (
                  <Badge
                    key={facility}
                    variant={facilities.includes(facility) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform text-xs"
                    onClick={() => toggleFacility(facility)}
                  >
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(facilities.length > 0 || roomType || searchQuery || location) && (
            <div className="pt-2 border-t border-white/30">
              <Label className="text-gray-700 font-medium text-sm">Filter Aktif:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">Pencarian: {searchQuery}</Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="text-xs">Lokasi: {location}</Badge>
                )}
                {roomType && (
                  <Badge variant="secondary" className="text-xs">Tipe: {roomType}</Badge>
                )}
                {facilities.map((facility) => (
                  <Badge key={facility} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
