import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  children?: ReactNode
}

export function SectionHeader({ title, subtitle, align = 'left', children }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : ''

  return (
    <div className={`mb-6 ${alignClass}`}>
      <h2 className='text-[24px]  font-bold text-[#FF5722] mb-2'>{title}</h2>
      {subtitle && <p className='text-[19px] font-bold text-[#FF5722]'>{subtitle}</p>}
      {children}
    </div>
  )
}
