import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { createURLNguoiDung } from '@/utils/function'

interface Props {
  soTrangHienTai: number
  soLuongMoiTrang: number
  tongSoLuong: number
  tuKhoa?: string
}

export default function FooterNguoiDung({ soTrangHienTai, soLuongMoiTrang, tongSoLuong, tuKhoa }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const tongSoTrang = Math.ceil(tongSoLuong / soLuongMoiTrang)

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

  return (
    <div className='flex items-center justify-between'>
      <Select
        value={soLuongMoiTrang.toString()}
        onValueChange={(v) => {
          const num = Number(v)
          navigate(createURLNguoiDung(location.pathname, 1, num, tuKhoa))
        }}
      >
        <SelectTrigger className='w-fit gap-2 data-[state=open]:shadow-[0_0_12px_rgba(251,146,60,0.8)] data-[state=open]:border-orange-400 transition-all duration-300'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[10, 25, 50, 100].map((num) => (
            <SelectItem
              key={num}
              value={num.toString()}
              className='hover:bg-orange-100 hover:text-orange-600 focus:bg-orange-100 focus:text-orange-600 cursor-pointer transition-colors duration-200'
            >
              Hiển thị {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='icon'
          disabled={soTrangHienTai <= 1}
          onClick={() => {
            if (soTrangHienTai > 1) {
              navigate(createURLNguoiDung(pathname, soTrangHienTai - 1, soLuongMoiTrang, tuKhoa))
            }
          }}
        >
          <ChevronLeft />
        </Button>

        {/* Page numbers */}
        {getPageNumbers(soTrangHienTai, tongSoTrang).map((p, idx) =>
          typeof p === 'number' ? (
            <Button
              key={idx}
              variant={soTrangHienTai === p ? 'default' : 'outline'}
              size='icon'
              onClick={() => navigate(createURLNguoiDung(pathname, p, soLuongMoiTrang, tuKhoa))}
              className={soTrangHienTai === p ? 'bg-orange-500 text-white' : ''}
            >
              {p}
            </Button>
          ) : (
            <span key={idx} className='px-2'>
              …
            </span>
          )
        )}

        <Button
          variant='outline'
          size='icon'
          disabled={soTrangHienTai >= tongSoTrang}
          onClick={() => {
            if (soTrangHienTai < tongSoTrang) {
              navigate(createURLNguoiDung(pathname, soTrangHienTai + 1, soLuongMoiTrang, tuKhoa))
            }
          }}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
