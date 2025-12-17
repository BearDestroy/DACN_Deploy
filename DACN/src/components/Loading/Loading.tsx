import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50'>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-orange-600' />
      </div>
    </div>
  )
}
