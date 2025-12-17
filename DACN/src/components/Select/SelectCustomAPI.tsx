import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover' // Kiểm tra lại đường dẫn import
import { Button } from '../ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command'
import { ChevronsUpDownIcon, Check } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createURLKhoaHoc, createURLLoTrinh } from '@/utils/function'

export interface SelectItemBase {
  id: number
}

interface SelectCustomProps<T extends SelectItemBase> {
  items: T[]
  selected: T | null
  setSelected: (item: T | null) => void
  loading?: boolean
  placeholder?: string
  labelField: keyof T
  khoaHocFilter: KhoaHocFilter | LoTrinhFilter
}

export function SelectCustomAPI<T extends SelectItemBase>({
  items,
  selected,
  setSelected,
  loading = false,
  placeholder = 'Chọn mục',
  labelField,
  khoaHocFilter
}: SelectCustomProps<T>) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const key = (labelField as string).slice(3)
  const idKey = 'id' + key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isKhoaHocFilter(f: any): f is KhoaHocFilter {
    return f && typeof f === 'object' && 'tenKhoaHoc' in f
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          // --- PHẦN THAY ĐỔI Ở ĐÂY ---
          className={`w-full justify-between rounded-md border px-3 py-2 transition-all duration-200 ${
            open
              ? 'border-orange-500 ring-4 ring-orange-100' // Khi MỞ: Border cam đậm + Ring (shadow) cam nhạt
              : 'border-gray-300 hover:border-orange-300' // Khi ĐÓNG: Border xám (hoặc màu mặc định)
          }`}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : selected ? String(selected[labelField]) : placeholder}
          <ChevronsUpDownIcon className='opacity-50 h-4 w-4' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-72 p-0'>
        <Command>
          <CommandInput placeholder='Tìm kiếm...' className='h-9' />

          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>

            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item[labelField])}
                  onSelect={() => {
                    setSelected(item)
                    setOpen(false)
                    if (isKhoaHocFilter(khoaHocFilter)) {
                      navigate(createURLKhoaHoc(location.pathname, { ...khoaHocFilter, [idKey]: item.id }))
                    } else {
                      navigate(createURLLoTrinh(location.pathname, { ...khoaHocFilter, [idKey]: item.id }))
                    }
                  }}
                  className={`cursor-pointer ${
                    selected?.id === item.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  {String(item[labelField])}
                  <Check
                    className={`ml-auto h-4 w-4 text-orange-500 ${selected?.id === item.id ? 'opacity-100' : 'opacity-0'}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
