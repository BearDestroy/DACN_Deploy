import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeader } from './common/SectionHeader'
import type { BaiHocGanNhatHinhAnh } from '@/@types/KhoaHoc'
import { CardBaiHocGanNhat } from './CardBaiHocGanNhat'
import { Button } from './ui/button'
interface BaiHocGanNhatCollectionProps {
  title?: string
  subtitle?: string
  baiHocList: BaiHocGanNhatHinhAnh[]
}

export function BaiHocGanNhatCollection({ title, subtitle, baiHocList }: BaiHocGanNhatCollectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (baiHocList.length === 0) {
    return (
      <div className='max-w-[1340px] mx-auto px-6 py-8 text-center'>
        <p className='text-slate-500 italic'>Chưa có bài học nào gần đây</p>
      </div>
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420
      const container = scrollContainerRef.current

      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className='max-w-[1340px] mx-auto px-6 py-12 relative group/slider'>
      {(title || subtitle) && <SectionHeader title={title ?? ''} subtitle={subtitle} />}

      <div className='relative mt-6'>
        <Button
          onClick={() => scroll('left')}
          className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 disabled:opacity-0'
        >
          <ChevronLeft className='w-6 h-6' />
        </Button>

        <div
          ref={scrollContainerRef}
          className='flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {baiHocList.map((bai) => (
            <div key={bai.id} className='snap-start'>
              <CardBaiHocGanNhat baiHoc={bai} />
            </div>
          ))}
        </div>
        <Button
          onClick={() => scroll('right')}
          className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300'
        >
          <ChevronRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  )
}
