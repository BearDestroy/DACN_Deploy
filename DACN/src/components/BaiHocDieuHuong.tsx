import { CheckCircle2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LessonNavigationProps {
  onPrev: () => void
  onNext: () => void
  onComplete: () => void
  canPrev: boolean
  canNext: boolean
  isCompleted: boolean
  className?: string
}

export function LessonNavigation({
  onPrev,
  onNext,
  onComplete,
  canPrev,
  canNext,
  isCompleted,
  className
}: LessonNavigationProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-4 mt-2 px-2',
        className
      )}
    >
      <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <Button
            variant='outline'
            onClick={onPrev}
            disabled={!canPrev}
            className={cn(
              'flex-1 sm:flex-none border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all',
              'dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <ChevronLeft className='w-4 h-4 mr-1' /> Trước
          </Button>

          <Button
            variant='outline'
            onClick={onNext}
            disabled={!canNext}
            className={cn(
              'flex-1 sm:flex-none border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all',
              'dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Tiếp <ChevronRight className='w-4 h-4 ml-1' />
          </Button>
        </div>

        <div className='w-full sm:w-auto'>
          <Button
            onClick={onComplete}
            size='default'
            className={cn(
              'w-full sm:w-auto font-medium shadow-sm transition-all duration-300 min-w-[180px]',
              isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' // Style khi đã hoàn thành (Xanh lá nhẹ)
                : 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[#FF5722]/20 hover:shadow-[#FF5722]/40' // Style khi chưa hoàn thành (Cam đậm)
            )}
          >
            {isCompleted ? (
              <>
                <Check className='w-4 h-4 mr-2' strokeWidth={3} />
                Đã học xong
              </>
            ) : (
              <>
                <CheckCircle2 className='w-4 h-4 mr-2' />
                Đánh dấu hoàn thành
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
