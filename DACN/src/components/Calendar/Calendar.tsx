/* eslint-disable prefer-const */
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isBefore,
  isAfter,
  setMonth,
  setYear
} from 'date-fns'
import { vi } from 'date-fns/locale'

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date | null
  maxDate?: Date | null
  onSubmit: (date: Date | null) => void
}

export function DatePicker({ value, onChange, minDate, maxDate, onSubmit }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())
  const [view, setView] = useState<'date' | 'month' | 'year' | 'century'>('date')
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(value ? format(value, 'dd-MM-yyyy', { locale: vi }) : '')
  const [yearPageStart, setYearPageStart] = useState(currentMonth.getFullYear() - 5)
  const today = new Date()
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectedDate(value || null)
      setInputValue(value ? format(value, 'dd-MM-yyyy', { locale: vi }) : '')
    }, 0)

    return () => clearTimeout(timeout)
  }, [value])

  // --- HANDLE CLICK ---
  const handleDateClick = (date: Date) => {
    if ((minDate && isBefore(date, minDate)) || (maxDate && isAfter(date, maxDate))) return
    setSelectedDate(date)
    setCurrentMonth(date)
    setInputValue(format(date, 'dd-MM-yyyy', { locale: vi }))
    onChange?.(date)
    onSubmit?.(date)
    setOpen(false)
    setView('date')
  }

  const handleMonthClick = (month: number) => {
    const newDate = setMonth(currentMonth, month)
    setCurrentMonth(newDate)
    setView('date')
  }

  const handleYearClick = (year: number) => {
    const newDate = setYear(currentMonth, year)
    setCurrentMonth(newDate)
    setView('month')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    let day = val.slice(0, 2)
    let month = val.slice(2, 4)
    let year = val.slice(4, 8)

    if (month && parseInt(month) > 12) month = '12'

    if (day) {
      const dayNum = parseInt(day)
      const monthNum = month ? parseInt(month) : undefined
      const yearNum = year.length === 4 ? parseInt(year) : undefined
      let maxDays = 31
      if (monthNum && yearNum) maxDays = new Date(yearNum, monthNum, 0).getDate()
      if (dayNum > maxDays) day = maxDays.toString().padStart(2, '0')
    }

    let newVal = day
    if (month) newVal += '-' + month
    if (year) newVal += '-' + year
    if (newVal.length > 10) newVal = newVal.slice(0, 10)
    setInputValue(newVal)

    if (newVal.length === 10) {
      const parsed = parse(newVal, 'dd-MM-yyyy', new Date(), { locale: vi })
      if (isValid(parsed) && (!minDate || !isBefore(parsed, minDate)) && (!maxDate || !isAfter(parsed, maxDate))) {
        setSelectedDate(parsed)
        setCurrentMonth(parsed)
        onChange?.(parsed)
      } else {
        const today = new Date()
        setSelectedDate(today)
        setCurrentMonth(today)
        setInputValue(format(today, 'dd-MM-yyyy', { locale: vi }))
        onChange?.(today)
      }
    } else {
      setSelectedDate(null)
      onChange?.(null)
    }
  }

  // --- RENDER COMPONENTS ---
  const renderHeader = () => (
    <div className='flex justify-between items-center mb-2'>
      <Button variant='ghost' size='sm' onClick={() => setCurrentMonth(addDays(currentMonth, -30))}>
        {'<'}
      </Button>
      <div className='flex items-center gap-2 px-1 py-1'>
        <span
          className='cursor-pointer font-medium border-b-2 border-gray-400 hover:border-orange-500 transition-colors bg-gray-100 px-2 py-1 rounded'
          onClick={() => setView('month')}
        >
          {`Tháng ${format(currentMonth, 'M', { locale: vi })}`}
        </span>
        <span
          className='cursor-pointer font-medium border-b-2 border-gray-400 hover:border-orange-500 transition-colors bg-gray-100 px-2 py-1 rounded'
          onClick={() => setView('century')}
        >
          {`Năm ${currentMonth.getFullYear()}`}
        </span>
      </div>
      <Button variant='ghost' size='sm' onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>
        {'>'}
      </Button>
    </div>
  )

  const renderDays = () => {
    const startMonth = startOfMonth(currentMonth)
    const endMonth = endOfMonth(currentMonth)
    const startDate = startOfWeek(startMonth, { weekStartsOn: 0 })
    const endDate = endOfWeek(endMonth, { weekStartsOn: 0 })
    const rows = []
    let currentDay = startDate
    while (currentDay <= endDate) {
      const weekDays = []
      for (let i = 0; i < 7; i++) {
        const dayToRender = currentDay
        const isDisabled = !!((minDate && isBefore(dayToRender, minDate)) || (maxDate && isAfter(dayToRender, maxDate)))
        const isActive = selectedDate ? isSameDay(dayToRender, selectedDate) : false
        weekDays.push(
          <Button
            key={dayToRender.toString()}
            variant={isActive ? 'default' : 'ghost'}
            size='sm'
            disabled={isDisabled}
            className={`w-8 h-8 p-0 rounded ${
              isActive
                ? 'bg-orange-500 text-white'
                : isSameDay(dayToRender, today)
                  ? 'bg-orange-100 text-orange-700'
                  : ''
            }`}
            onClick={() => handleDateClick(dayToRender)}
          >
            {dayToRender.getDate()}
          </Button>
        )
        currentDay = addDays(currentDay, 1)
      }
      rows.push(
        <div key={currentDay.toString()} className='grid grid-cols-7 gap-1 mb-1'>
          {weekDays}
        </div>
      )
    }
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return (
      <div>
        <div className='grid grid-cols-7 gap-1 mb-2 text-center font-medium'>
          {weekdays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        {rows}
      </div>
    )
  }

  const renderMonthPicker = () => (
    <div className='grid grid-cols-3 gap-2'>
      {Array.from({ length: 12 }, (_, i) => (
        <Button key={i} variant='ghost' onClick={() => handleMonthClick(i)}>
          {`Tháng ${i + 1}`}
        </Button>
      ))}
    </div>
  )

  const renderYearPicker = () => {
    const years = Array.from({ length: 12 }, (_, i) => yearPageStart + i)
    return (
      <div>
        <div className='flex justify-between mb-2'>
          <Button size='sm' variant='ghost' onClick={() => setYearPageStart(yearPageStart - 12)}>
            {'<'}
          </Button>
          <span className='font-medium'>
            {yearPageStart} - {yearPageStart + 11}
          </span>
          <Button size='sm' variant='ghost' onClick={() => setYearPageStart(yearPageStart + 12)}>
            {'>'}
          </Button>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          {years.map((year) => (
            <Button key={year} variant='ghost' onClick={() => handleYearClick(year)}>
              {year}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderCenturyPicker = () => {
    const startCentury = Math.floor(currentMonth.getFullYear() / 100) * 100 - 100
    const centuries = Array.from({ length: 12 }, (_, i) => startCentury + i * 100)
    return (
      <div className='grid grid-cols-3 gap-2'>
        {centuries.map((century) => (
          <Button
            key={century}
            variant='ghost'
            onClick={() => {
              setYearPageStart(century)
              setView('year')
            }}
          >
            {century} - {century + 99}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setView('date')
      }}
    >
      <PopoverTrigger asChild>
        <div className='relative w-full'>
          <input
            type='text'
            className={`w-full border rounded pl-2 pr-10 py-1 focus:outline-none focus:border-orange-500 focus:shadow-md ${open ? 'border-orange-500 shadow-md' : ''}`}
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setOpen(true)}
            placeholder='dd-MM-yyyy'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const parsed = parse(inputValue, 'dd-MM-yyyy', new Date())
                if (isValid(parsed)) onSubmit?.(parsed)
              }
            }}
          />
          <button
            type='button'
            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400'
            onClick={() => setOpen(true)}
          >
            <Calendar size={16} />
          </button>
        </div>
      </PopoverTrigger>

      <PopoverContent className='w-80 p-4'>
        {view === 'date' && (
          <>
            {renderHeader()}
            {renderDays()}
          </>
        )}
        {view === 'month' && renderMonthPicker()}
        {view === 'year' && renderYearPicker()}
        {view === 'century' && renderCenturyPicker()}
      </PopoverContent>
    </Popover>
  )
}
