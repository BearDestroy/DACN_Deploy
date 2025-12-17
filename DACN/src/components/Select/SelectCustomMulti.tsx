'use client'

import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ChevronsUpDownIcon, Check, X } from 'lucide-react'

interface MultiSelectPopoverProps<T extends { id: number }> {
  items: T[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  labelField: keyof T
  placeholder?: string
  loading?: boolean
  errors?: boolean
}

export function SelectCustomMulti<T extends { id: number }>(props: MultiSelectPopoverProps<T>) {
  const { items, selectedIds, onChange, labelField, placeholder = 'Chọn mục', loading = false, errors = false } = props

  const [open, setOpen] = useState(false)

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`w-full justify-start rounded-md border px-3 py-2 flex items-center relative z-10 h-auto min-h-10 transition-all ${
            open
              ? 'border-orange-500 ring-4 ring-orange-100' // Style khi ĐANG MỞ (Border cam đậm, Ring cam nhạt)
              : errors
                ? 'border-red-600' // Style khi LỖI
                : 'border-gray-300' // Style mặc định
          }`}
          style={{
            maxHeight: 135,
            overflowY: 'auto'
          }}
        >
          {selectedIds.length === 0 && !loading && (
            <span className='text-gray-500 pointer-events-none font-normal'>{placeholder}</span>
          )}

          <div className='flex-1 flex flex-wrap gap-2 relative z-10'>
            {loading
              ? 'Đang tải...'
              : selectedIds.map((id) => {
                  const item = items.find((i) => i.id === id)
                  return (
                    <span
                      key={id}
                      className='bg-orange-100 text-orange-600 px-2 py-1 rounded-md flex items-center gap-1 text-sm relative z-10'
                    >
                      <span className='leading-none'>{String(item?.[labelField])}</span>
                      <div
                        role='button'
                        className='cursor-pointer hover:text-orange-800 flex items-center justify-center rounded-full p-0.5 transition-colors'
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSelect(id)
                        }}
                      >
                        <X className='h-3 w-3' />
                      </div>
                    </span>
                  )
                })}
          </div>

          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-(--radix-popover-trigger-width) p-0' align='start'>
        <Command>
          <CommandInput placeholder='Tìm kiếm…' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item[labelField])}
                  onSelect={() => toggleSelect(item.id)}
                  className={`cursor-pointer ${
                    selectedIds.includes(item.id) ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'
                  }`}
                >
                  {String(item[labelField])}
                  <Check
                    className={`ml-auto h-4 w-4 text-orange-500 ${selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0'}`}
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
