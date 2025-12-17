import { createURLDM } from '@/utils/function'
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
}

export function CustomRadioGroup({ options, value, soTrangHienTai, soLuongMoiTrang, tuKhoa }: RadioGroupProps) {
  const { pathname } = useLocation()

  return (
    <div className='flex gap-4 mt-2'>
      {options.map((option) => {
        const url = createURLDM(pathname, soTrangHienTai, soLuongMoiTrang, option.value, tuKhoa)
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
