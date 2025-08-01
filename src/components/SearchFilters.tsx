
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
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Search Bar - Enhanced */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Cari kost di area yang kamu inginkan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-base border-2 border-white/50 bg-white/95 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder:text-gray-600 shadow-lg rounded-xl"
          />
        </div>
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              placeholder="Lokasi (contoh: Jakarta, Bandung)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 text-base border-2 border-white/50 bg-white/95 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 pl-11 text-gray-800 placeholder:text-gray-600 shadow-lg rounded-xl"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSearch}
            size="default" 
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl rounded-xl font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Cari Kost
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-12 px-4 border-2 border-white/50 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-blue-400 transition-all duration-300 shadow-lg rounded-xl"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters - Enhanced */}
      {showAdvanced && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 space-y-4 animate-fade-in shadow-2xl border border-white/50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Filter Lanjutan</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 rounded-lg"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Rentang Harga</Label>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={5000000}
                  min={300000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span className="bg-blue-50 px-2 py-1 rounded-lg">Rp {priceRange[0].toLocaleString()}</span>
                  <span className="bg-blue-50 px-2 py-1 rounded-lg">Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Tipe Kamar</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="text-gray-800 h-10 bg-white border-gray-200 rounded-lg shadow-sm">
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
            <div className="space-y-3 md:col-span-2 lg:col-span-1">
              <Label className="text-gray-700 font-medium">Fasilitas</Label>
              <div className="flex flex-wrap gap-2">
                {availableFacilities.map((facility) => (
                  <Badge
                    key={facility}
                    variant={facilities.includes(facility) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform text-sm py-1 px-3 rounded-full"
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
            <div className="pt-4 border-t border-gray-200/50">
              <Label className="text-gray-700 font-medium text-sm">Filter Aktif:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {searchQuery && (
                  <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800">Pencarian: {searchQuery}</Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">Lokasi: {location}</Badge>
                )}
                {roomType && (
                  <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-800">Tipe: {roomType}</Badge>
                )}
                {facilities.map((facility) => (
                  <Badge key={facility} variant="secondary" className="text-sm bg-orange-100 text-orange-800">
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
