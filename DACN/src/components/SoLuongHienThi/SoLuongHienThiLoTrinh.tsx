import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { createURLLoTrinh } from '@/utils/function'

interface Props {
  tongSoLuong: number
  loTrinhFilter: LoTrinhFilter
}

export default function FooterTableLoTrinh({ tongSoLuong, loTrinhFilter }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = loTrinhFilter.soTrang || 1
  const currentLimit = loTrinhFilter.soLuong || 10

  const tongSoTrang = Math.ceil(tongSoLuong / currentLimit)

  const handleNavigation = (newPage: number, newLimit?: number) => {
    navigate(
      createURLLoTrinh(location.pathname, {
        ...loTrinhFilter,
        soTrang: newPage,
        soLuong: newLimit || currentLimit
      })
    )
  }

  const getPageNumbers = (current: number, total: number) => {
    const delta = 3
    const range: (number | string)[] = []

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i)
      } else if (i === current - delta - 1 || i === current + delta + 1) {
        range.push('...')
      }
    }

    return range.filter((item, index, arr) => item !== '...' || arr[index - 1] !== '...')
  }

  if (tongSoLuong === 0) return null

  return (
    <div className='flex items-center justify-between pt-2 border-gray-100'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-500'>Hiển thị:</span>
        <Select
          value={currentLimit.toString()}
          onValueChange={(v) => {
            const num = Number(v)
            handleNavigation(1, num)
          }}
        >
          <SelectTrigger className='w-[140px] h-9 gap-2 data-[state=open]:border-orange-400 transition-all duration-300'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((num) => (
              <SelectItem key={num} value={num.toString()} className='cursor-pointer'>
                {num} / trang
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          disabled={currentPage <= 1}
          onClick={() => {
            if (currentPage > 1) {
              handleNavigation(currentPage - 1)
            }
          }}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {getPageNumbers(currentPage, tongSoTrang).map((p, idx) =>
          typeof p === 'number' ? (
            <Button
              key={idx}
              variant={currentPage === p ? 'default' : 'outline'}
              size='icon'
              className={`h-8 w-8 ${currentPage === p ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' : ''}`}
              onClick={() => handleNavigation(p)}
            >
              {p}
            </Button>
          ) : (
            <span key={idx} className='px-2 text-gray-400 text-sm'>
              ...
            </span>
          )
        )}

        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          disabled={currentPage >= tongSoTrang}
          onClick={() => {
            if (currentPage < tongSoTrang) {
              handleNavigation(currentPage + 1)
            }
          }}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
