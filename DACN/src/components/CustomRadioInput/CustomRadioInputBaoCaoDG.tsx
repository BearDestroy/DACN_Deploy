import { createURLBaoCaoDanhGia } from '@/utils/function'
import { Link, useLocation } from 'react-router-dom'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string
  soTrangHienTai: number
  soLuongMoiTrang: number
  tuKhoa: string
  idLoaiBaoCao: string | number
  ngayBatDau?: Date | null
  ngayKetThuc?: Date | null
}
export function CustomRadioInputBaoCaoDG({
  options,
  value,
  soTrangHienTai,
  soLuongMoiTrang,
  tuKhoa,
  idLoaiBaoCao,
  ngayBatDau,
  ngayKetThuc
}: RadioGroupProps) {
  const { pathname } = useLocation()
  return (
    <div className='flex gap-1 mt-2 mb-1 ml-3'>
      {options.map((option) => {
        const url = createURLBaoCaoDanhGia(
          pathname,
          soTrangHienTai,
          soLuongMoiTrang,
          option.value,
          tuKhoa,
          ngayBatDau,
          ngayKetThuc,
          idLoaiBaoCao
        )
        const isActive = value === option.value

        return (
          <Link
            key={option.value}
            to={url}
            className={`custom-radio flex items-center gap-2 cursor-pointer ${isActive ? 'active' : ''} text-sm font-medium`}
          >
            <span className='radio-mark w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center relative'>
              {isActive && <span className='absolute w-2 h-2 bg-white rounded-full'></span>}
            </span>
            <span className='text-gray-700'>{option.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
