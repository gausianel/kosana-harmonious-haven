
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    {
      url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      alt: "Modern boarding house room"
    },
    {
      url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop", 
      alt: "Cozy study area"
    },
    {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      alt: "Comfortable workspace"
    },
    {
      url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      alt: "Living room area"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
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
      
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
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
  );
};

export default ImageCarousel;
