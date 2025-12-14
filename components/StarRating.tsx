import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5, 
  size = 16, 
  interactive = false,
  onRate 
}) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-200 text-gray-200'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRate && onRate(i + 1)}
        />
      ))}
    </div>
  );
};