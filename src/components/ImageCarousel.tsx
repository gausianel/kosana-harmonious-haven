
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fallback images if no images provided
  const defaultImages = [
    {
      url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      alt: "Kamar kost modern dengan tempat tidur nyaman"
    },
    {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop", 
      alt: "Kamar kost dengan meja belajar"
    },
    {
      url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      alt: "Ruang kost dengan area santai"
    },
    {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      alt: "Workspace dalam kamar kost"
    }
  ];

  // Convert provided images to the expected format
  const displayImages = images && images.length > 0 
    ? images.map((url, index) => ({
        url,
        alt: `Foto kost ${index + 1}`
      }))
    : defaultImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 6000); // Changed from 4000 to 6000 for moderate speed

    return () => clearInterval(timer);
  }, [displayImages.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out", // Removed scale and blur effects
            index === currentIndex 
              ? "opacity-100" // Changed from opacity-30 to opacity-100 and removed scale
              : "opacity-0"
          )}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/60 to-pink-900/80" />
        </div>
      ))}
      
      {/* Enhanced text overlay with better visibility */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-4">
          {/* Text with enhanced visibility */}
          <div className="relative px-6 py-3 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
            <p className="text-white text-lg font-medium text-center max-w-md leading-relaxed drop-shadow-lg">
              {displayImages[currentIndex].alt}
            </p>
            {/* Additional text outline effect */}
            <p className="absolute inset-0 px-6 py-3 text-lg font-medium text-center max-w-md leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 opacity-20 blur-sm">
              {displayImages[currentIndex].alt}
            </p>
          </div>
          
          {/* Dots indicator */}
          <div className="flex space-x-3">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 border-2",
                  index === currentIndex 
                    ? "bg-white border-white scale-125 shadow-lg" 
                    : "bg-white/30 border-white/50 hover:bg-white/60 hover:border-white/80"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
