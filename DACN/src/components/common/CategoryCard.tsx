import { Link } from 'react-router-dom'

interface CategoryCardProps {
  name: string
  id: number
}

export function CategoryCard({ name, id }: CategoryCardProps) {
  return (
    <Link
      to={`/khoa-hoc/search?idDanhMuc=${encodeURIComponent(id)}`}
      className='bg-white p-4 rounded border border-[#D1D7E0] hover:border-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-200'
    >
      <p className='text-[16px] font-bold text-[#1C1D1F]'>{name}</p>
    </Link>
  )
}
