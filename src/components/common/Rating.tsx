import Star from '../svg/Star';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function Rating({ rating, size = 23 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }).map((_, i) => {
        const variant = i < fullStars ? 'full' : i === fullStars && hasHalfStar ? 'half' : 'empty';
        return <Star key={i} variant={variant} size={size} />;
      })}
    </div>
  );
}
