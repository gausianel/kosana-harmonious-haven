
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const RoomImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const roomImages = [
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % roomImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [roomImages.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {roomImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentIndex 
              ? "opacity-30 scale-100" 
              : "opacity-0 scale-105"
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
      
      {/* Dots indicator with room info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-white/80 text-sm text-center px-4">
            {roomImages[currentIndex].alt}
          </p>
          <div className="flex space-x-2">
            {roomImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomImageCarousel;
