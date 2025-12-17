import { useState } from 'react'
import { Star } from 'lucide-react'

interface ChonSaoDanhGiaProps {
  rating: number
  onChange: (val: number) => void
  size?: number
}

export function ChonSaoDanhGia({ rating, onChange, size = 20 }: ChonSaoDanhGiaProps) {
  const [hover, setHover] = useState<number>(0)

  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={`cursor-pointer transition-colors ${i <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  )
}
