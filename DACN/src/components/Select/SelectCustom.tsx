import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Button } from '../ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command'
import { ChevronsUpDownIcon, Check } from 'lucide-react'

interface SelectCustomSingleProps<T> {
  items: T[]
  selected: T | null
  onChange: (item: T | null) => void
  labelField: keyof T
  placeholder?: string
  loading?: boolean
  errors?: boolean
  disabled?: boolean
}

export function SelectCustomSingle<T extends { id: number }>({
  items,
  selected,
  onChange,
  labelField,
  placeholder = 'Chọn mục',
  loading = false,
  errors = false,
  disabled = false
}: SelectCustomSingleProps<T>) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter items dựa trên search query
  const filteredItems = items.filter((item) =>
    String(item[labelField]).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={`rounded-md transition-shadow duration-200
          ${open ? 'border-orange-500 ring-1 ring-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]' : ''}
          ${errors ? 'border-red-600' : 'border-gray-300'}
          focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 focus-within:shadow-[0_0_8px_rgba(249,115,22,0.3)]`}
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between rounded-md border px-3 py-2'
            disabled={loading || disabled}
          >
            <span className='truncate max-w-[85%] block'>
              {loading ? 'Đang tải...' : selected ? String(selected[labelField]) : placeholder}
            </span>
            <ChevronsUpDownIcon className='opacity-50 flex-shrink-0' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-60 p-0'>
          <Command shouldFilter={false}>
            {' '}
            <CommandInput placeholder='Tìm kiếm…' className='h-9' value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              {filteredItems.length === 0 && <CommandEmpty>Không tìm thấy.</CommandEmpty>}

              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`id-${item.id}`}
                    keywords={[String(item[labelField])]}
                    onSelect={() => {
                      onChange(item)
                      setOpen(false)
                      setSearchQuery('')
                    }}
                    className={`cursor-pointer flex items-center gap-2 
                      ${selected?.id === item.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'}`}
                  >
                    <span className='truncate max-w-[85%] block'>{String(item[labelField])}</span>

                    <Check
                      className={`ml-auto text-orange-500 
                        ${selected?.id === item.id ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  )
}
