import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface UdemyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  fullWidth?: boolean
}

export function ButtonCustom({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className = '',
  ...props
}: UdemyButtonProps) {
  const baseStyles = 'font-bold rounded transition-all duration-200 inline-flex items-center justify-center'

  const sizeStyles = {
    sm: 'h-10 px-4 text-[14px]',
    md: 'h-12 px-6 text-[16px]',
    lg: 'h-14 px-8 text-[16px]'
  }

  const variantStyles = {
    primary: 'bg-[#FF5722] text-white hover:bg-[#E64A19] hover:scale-105 hover:shadow-[0_8px_16px_rgba(255,87,34,0.3)]',

    secondary:
      'bg-white text-[#FF5722] border border-[#FF5722] hover:bg-[#FFCCBC] hover:text-[#E64A19] hover:scale-105', // Nền trắng, border cam, hover nền cam nhạt, chữ cam đậm

    outline: 'border border-[#FF5722] text-[#FF5722] bg-white hover:bg-[#FFCCBC] hover:text-[#E64A19]',

    text: 'text-[#FF5722] hover:text-[#E64A19] hover:bg-[#FFCCBC]'
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`

  if (href) {
    return (
      <Link to={href} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
