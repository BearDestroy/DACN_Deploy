import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { HoiDapResponse } from '@/@types/BaiHoc'

interface HoiDapItemProps {
  hoiDap: HoiDapResponse
  onViewDetail: (id: number) => void
}

export function HoiDapItem({ hoiDap, onViewDetail }: HoiDapItemProps) {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
    } catch {
      return dateString
    }
  }

  return (
    <div className='bg-orange-50/30 border border-orange-200 rounded-lg p-5 hover:border-orange-300 transition-colors'>
      <div className='flex gap-4'>
        <Avatar className='h-10 w-10 shrink-0'>
          <AvatarImage src={'1.55.203.158:5154' + hoiDap.hinhAnh || undefined} />
          <AvatarFallback className='bg-orange-600 text-white'>
            {hoiDap.hoTen?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <div className='flex-1'>
              <h3 className='font-semibold text-orange-800 text-base mb-1'>{hoiDap.tieuDeCauHoi}</h3>
              <div className='flex items-center gap-2 text-xs text-orange-600'>
                <span className='font-medium text-orange-700'>{hoiDap.hoTen}</span>
                <span>•</span>
                <span>{formatTimeAgo(hoiDap.thoiGianHoi)}</span>
              </div>
            </div>
          </div>

          <p className='text-orange-700 text-sm mb-3 whitespace-pre-wrap'>{hoiDap.noiDung}</p>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onViewDetail(hoiDap.idHoiDap)}
              className='text-orange-600 hover:text-orange-800 hover:bg-orange-100/50 h-8 px-3'
            >
              <MessageCircle className='w-4 h-4 mr-1' />
              {hoiDap.soLuongPhanHoi || 0} phản hồi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
