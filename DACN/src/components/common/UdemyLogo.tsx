import { GraduationCap } from 'lucide-react'

export function UdemyLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className='p-1 bg-[#FF5722] rounded-lg'>
        <GraduationCap className='w-6 h-6 text-white' />
      </div>
      <span className='text-xl font-bold tracking-tight text-gray-900'>iDemu</span>
    </div>
  )
}
