import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  reviewCount?: number
}

export function RatingStars({ rating, size = 'sm', showNumber = true, reviewCount }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const textSizes = {
    sm: 'text-[14px]',
    md: 'text-[16px]',
    lg: 'text-[19px]'
  }

  return (
    <div className='flex items-center gap-1'>
      {showNumber && <span className={`${textSizes[size]} font-bold text-[#1C1D1F]`}>{rating.toFixed(1)}</span>}
      <div className='flex'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) ? 'fill-[#FFC107] text-[#FFC107]' : 'fill-[#D1D7E0] text-[#D1D7E0]'
            }`}
          />
        ))}
      </div>
      {reviewCount && <span className='text-[12px] text-[#6A6C70]'>({reviewCount.toLocaleString()})</span>}
    </div>
  )
}
