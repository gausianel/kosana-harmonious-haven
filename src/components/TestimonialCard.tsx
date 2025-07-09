
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, Quote } from "lucide-react";
import { useState } from "react";

interface TestimonialProps {
  name: string;
  rating: number;
  comment: string;
  index: number;
}

const TestimonialCard = ({ name, rating, comment, index }: TestimonialProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in" 
      style={{animationDelay: `${index * 200}ms`}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
              <User className={`w-6 h-6 text-blue-600 transition-colors duration-300 ${isHovered ? 'text-purple-600' : ''}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                {name}
              </p>
              <p className="text-sm text-gray-500">Penghuni Kost</p>
            </div>
          </div>
          
          <Quote className={`w-6 h-6 text-gray-300 transition-all duration-500 ${isHovered ? 'text-blue-400 scale-125 rotate-12' : ''}`} />
        </div>

        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 transition-all duration-300 ${
                i < rating 
                  ? 'fill-yellow-400 text-yellow-400 animate-pulse' 
                  : 'text-gray-300'
              } ${isHovered && i < rating ? 'scale-125' : ''}`}
              style={{
                animationDelay: `${i * 100}ms`,
                transitionDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>

        <div className="relative">
          <p className={`text-gray-600 italic transition-all duration-500 ${isHovered ? 'text-gray-700 scale-105' : ''}`}>
            "{comment}"
          </p>
          <div className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 ${isHovered ? 'w-full' : 'w-0'}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
