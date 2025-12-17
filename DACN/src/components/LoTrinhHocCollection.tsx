import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'

import { showErrorToast } from '@/utils/toast'
import { LoTrinhHocCard } from './LoTrinhHocCard'
import { layLoTrinhHocTheoURL } from '@/apis/loTrinhHoc'
import { Loader2 } from 'lucide-react'
import type { LoTrinhHoc } from '@/@types/LoTrinhHoc'
import type { IGoiYResponse } from '@/@types/KhoaHoc'

function SectionHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title && !subtitle) return null
  return (
    <div className='mb-6'>
      {title && <h2 className='text-2xl font-bold text-slate-800'>{title}</h2>}
      {subtitle && <p className='text-slate-500 mt-1'>{subtitle}</p>}
    </div>
  )
}

interface LoTrinhHocCollectionProps {
  goiY: IGoiYResponse
  columns?: number
}

export function LoTrinhHocCollection({ goiY, columns = 3 }: LoTrinhHocCollectionProps) {
  const [danhSachLoTrinh, setDanhSachLoTrinh] = useState<LoTrinhHoc[] | []>([])
  const cauHinhCot = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4'
  }

  const { mutate: taiLoTrinh, isPending: dangTai } = useMutation({
    mutationFn: (apiUrl: string) => layLoTrinhHocTheoURL(apiUrl),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        setDanhSachLoTrinh(res.data ?? [])
      } else {
        console.error('Lỗi tải lộ trình:', res.message)
      }
    },
    onError: () => {
      showErrorToast({ message: 'Không thể tải danh sách lộ trình' })
    }
  })

  useEffect(() => {
    if (goiY?.url) {
      taiLoTrinh(goiY.url)
    }
  }, [goiY.url, taiLoTrinh])

  if (!dangTai && danhSachLoTrinh.length === 0) return null

  return (
    <section className='max-w-[1340px] mx-auto px-4 md:px-6'>
      {(goiY.tieuDe || goiY.tieuDeCon) && <SectionHeader title={goiY.tieuDe} subtitle={goiY.tieuDeCon} />}

      <div className='min-h-[200px]'>
        {dangTai ? (
          <div className='flex flex-col justify-center items-center py-16 gap-3'>
            <Loader2 className='w-10 h-10 text-orange-600 animate-spin' />
            <p className='text-sm text-slate-500'>Đang tải lộ trình...</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${cauHinhCot[columns as keyof typeof cauHinhCot] || 'lg:grid-cols-3'} gap-6`}
          >
            {danhSachLoTrinh.map((loTrinh) => (
              <LoTrinhHocCard key={loTrinh.idLoTrinhHoc} loTrinh={loTrinh} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
