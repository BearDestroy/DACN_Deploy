import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { layKhoaHocTheoURL } from '@/apis/khoahoc'
import { showErrorToast } from '@/utils/toast'
import type { IGoiYResponse, KhoaHocChiTietHomePage } from '@/@types/KhoaHoc'

// Import components - Hãy đảm bảo đường dẫn đúng với dự án của bạn
import { KhoaHocCard } from './KhoaHocCard'
import { SectionHeader } from './common/SectionHeader'
import { ButtonCustom } from './common/ButtonCustom'

interface KhoaHocCollectionProps {
  columns?: number
  showButton?: boolean
  buttonHref?: string
  goiY: IGoiYResponse
}

// KHẮC PHỤC LỖI TAILWIND: Khai báo tường minh các class
const GRID_COLS_MAP: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6'
}

export function KhoaHocCollection({
  columns = 4,
  showButton = true,
  buttonHref = '/search',
  goiY
}: KhoaHocCollectionProps) {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHocChiTietHomePage[] | []>([])

  const { mutate: taiDanhSachKhoaHoc, isPending: dangTai } = useMutation({
    mutationFn: (apiUrl: string) => layKhoaHocTheoURL(apiUrl),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        setDanhSachKhoaHoc(res.data ?? [])
      } else {
        showErrorToast({ message: res.message || 'Tải danh sách thất bại' })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  useEffect(() => {
    if (goiY.url) {
      taiDanhSachKhoaHoc(goiY.url)
    }
  }, [goiY.url, taiDanhSachKhoaHoc])

  const gridClass = GRID_COLS_MAP[columns] || 'lg:grid-cols-4'

  return (
    <div className='max-w-[1340px] mx-auto px-6 py-4 w-full'>
      {(goiY.tieuDe || goiY.tieuDeCon) && <SectionHeader title={goiY.tieuDe} subtitle={goiY.tieuDeCon} />}

      {dangTai ? (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      ) : danhSachKhoaHoc.length === 0 ? (
        <p className='text-center text-slate-500 italic py-8'>Không có khóa học nào.</p>
      ) : (
        // Áp dụng gridClass đã map ở trên
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6 w-full`}>
          {danhSachKhoaHoc.map((khoaHoc) => (
            // Bọc thẻ div w-full để đảm bảo card bung hết cỡ trong cell của grid
            <div key={khoaHoc.idKhoaHoc} className='w-full min-w-0'>
              <KhoaHocCard thongTinKhoaHoc={khoaHoc} />
            </div>
          ))}
        </div>
      )}

      {showButton && !dangTai && danhSachKhoaHoc.length > 0 && (
        <div className='text-center mt-8'>
          <ButtonCustom variant='outline' size='lg' href={buttonHref}>
            Khám phá tất cả khóa học
          </ButtonCustom>
        </div>
      )}
    </div>
  )
}
