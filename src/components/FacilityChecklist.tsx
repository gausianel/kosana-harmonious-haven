
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FacilityChecklistProps {
  selectedFacilities: string[];
  onFacilitiesChange: (facilities: string[]) => void;
}

const standardFacilities = [
  'AC',
  'WiFi',
  'Kamar Mandi Dalam',
  'Kamar Mandi Luar',
  'Dapur Bersama',
  'Kasur',
  'Lemari',
  'Meja Belajar',
  'Kursi',
  'Parkir Motor',
  'Parkir Mobil',
  'Laundry',
  'CCTV',
  'Security 24 Jam',
  'Balkon',
  'Jendela',
  'Stop Kontak',
  'Lampu Meja'
];

const FacilityChecklist = ({ selectedFacilities, onFacilitiesChange }: FacilityChecklistProps) => {
  const handleFacilityToggle = (facility: string, checked: boolean) => {
    if (checked) {
      onFacilitiesChange([...selectedFacilities, facility]);
    } else {
      onFacilitiesChange(selectedFacilities.filter(f => f !== facility));
    }
  };

  const removeFacility = (facility: string) => {
    onFacilitiesChange(selectedFacilities.filter(f => f !== facility));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {standardFacilities.map((facility) => (
          <div key={facility} className="flex items-center space-x-2">
            <Checkbox
              id={facility}
              checked={selectedFacilities.includes(facility)}
              onCheckedChange={(checked) => handleFacilityToggle(facility, !!checked)}
            />
            <Label
              htmlFor={facility}
              className="text-sm font-normal cursor-pointer"
            >
              {facility}
            </Label>
          </div>
        ))}
      </div>

      {selectedFacilities.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Fasilitas Terpilih:
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedFacilities.map((facility, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {facility}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeFacility(facility)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityChecklist;
