import { createURLKhoaHoc } from '@/utils/function'
import { Link, useLocation } from 'react-router-dom'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  options: RadioOption[]
  khoaHocFilter: KhoaHocFilter
}

export function CustomRadioGroupKhoaHocBanChay({ options, khoaHocFilter }: RadioGroupProps) {
  const { pathname } = useLocation()

  return (
    <div className='flex gap-3'>
      {options.map((option) => {
        const url = createURLKhoaHoc(pathname, {
          ...khoaHocFilter,
          banChay: Number(option.value)
        })
        const isActive = String(khoaHocFilter.banChay) === option.value

        return (
          <Link
            key={option.value}
            to={url}
            className={`custom-radio flex items-center cursor-pointer ${isActive ? 'active' : ''} text-xs font-medium`}
          >
            <span className='radio-mark w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center relative'>
              {isActive && <span className='absolute w-2 h-2 bg-white rounded-full'></span>}
            </span>
            <span className='text-gray-700'>{option.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
