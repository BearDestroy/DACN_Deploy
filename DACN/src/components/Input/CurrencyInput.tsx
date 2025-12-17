import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { formatPrice } from '@/utils/function'

interface PriceInputProps {
  value: string
  min?: number
  max?: number
  thousandSeparator?: ',' | '.'
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function CurrencyInput({
  value,
  min = 0,
  max = 10000000000000,
  thousandSeparator = ',',
  onChange,
  placeholder,
  className
}: PriceInputProps) {
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const num = parseInt(raw) || 0
    const clamped = Math.min(Math.max(num, min), max).toString()
    setInternalValue(clamped)
    onChange?.(clamped)
  }

  return (
    <Input
      type='text'
      value={formatPrice(internalValue, thousandSeparator)}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${className} focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        boxShadow: isFocused ? '0 0 8px rgba(255, 165, 0, 0.3)' : 'none',
        transition: 'box-shadow 0.2s ease-in-out'
      }}
    />
  )
}
