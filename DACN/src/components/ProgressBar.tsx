interface ProgressProps {
  value: number
}

export function ProgressBar({ value }: ProgressProps) {
  return (
    <div className='w-full h-2 bg-[#FF5722]/10 rounded-full'>
      <div className='h-2 bg-[#FF5722] rounded-full transition-all duration-200' style={{ width: `${value}%` }} />
    </div>
  )
}
