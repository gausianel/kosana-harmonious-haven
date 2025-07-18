
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface RoomImageGalleryProps {
  images: string[];
  roomNumber?: string;
}

const RoomImageGallery = ({ images, roomNumber }: RoomImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Belum ada foto</p>
      </div>
    );
  }

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const mainImage = images[0];
  const otherImages = images.slice(1, 4); // Show up to 3 additional images

  return (
    <>
      <div className="space-y-2">
        {/* Main Image */}
        <div 
          className="relative cursor-pointer group"
          onClick={() => openGallery(0)}
        >
          <img
            src={mainImage}
            alt={`Kamar ${roomNumber || ''} - Foto utama`}
            className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
          />
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
              +{images.length - 1} foto
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {otherImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {otherImages.map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer group"
                onClick={() => openGallery(index + 1)}
              >
                <img
                  src={image}
                  alt={`Kamar ${roomNumber || ''} - Foto ${index + 2}`}
                  className="w-full h-16 object-cover rounded group-hover:opacity-90 transition-opacity"
                />
                {index === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-sm font-medium">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Gallery Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Foto Kamar {roomNumber} ({currentIndex + 1}/{images.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main Image */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
              <img
                src={images[currentIndex]}
                alt={`Kamar ${roomNumber} - Foto ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
                        index === currentIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoomImageGallery;
