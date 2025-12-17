import { useParams } from 'react-router-dom'
import { Users, PlayCircle, Star, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { KhoaHocChiTietHomePage } from '@/@types/KhoaHoc'
import { layThongTinGiangVien } from '@/apis/giangvien'
import { SectionHeader } from '@/components/common/SectionHeader'
import { KhoaHocCard } from '@/components/KhoaHocCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface giangVienChiTiet {
  id: string | undefined
  ten: string
  anhDaiDien: string
  gioiThieu: string
  danhGia: number
  tongHocVien: number
  tongKhoaHoc: number
  tongDanhGiaSo: number
  chuyenMon: string
  kinhNghiem: string
  hocVan: string
  khoaHoc: KhoaHocChiTietHomePage[]
}

export function ChiTietGiangVien() {
  const { giangVienId } = useParams<{ giangVienId: string }>()

  const {
    data: giangVien,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['chiTietGiangVien', giangVienId],
    queryFn: () => layThongTinGiangVien(Number(giangVienId!)).then((res) => res.data),
    enabled: !!giangVienId
  })

  // Loading spinner
  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-white'>
        <Loader2 className='h-10 w-10 animate-spin text-[#FF5722]' />
        <span className='mt-4 text-sm text-[#FF5722]/60'>Đang tải thông tin...</span>
      </div>
    )
  }

  if (isError || !giangVien) return <p className='text-center py-10'>Không tìm thấy thông tin giảng viên</p>

  const khoaHocCuaGiangVien: KhoaHocChiTietHomePage[] = giangVien.khoaHoc

  return (
    <div className='bg-white min-h-screen'>
      {/* Header */}
      <div className='bg-[#FF5722] text-white py-12'>
        <div className='max-w-[1340px] mx-auto px-6'>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            <Avatar className='w-32 h-32 border-4 border-white shadow-lg'>
              <AvatarImage
                src={'1.55.203.158:5154' + giangVien.anhDaiDien}
                alt={giangVien.ten}
                className='object-cover'
              />
              <AvatarFallback className='bg-[#FF5722]/10 text-white text-3xl font-bold'>
                {giangVien.ten?.trim().charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1'>
              <h1 className='text-[32px] text-white font-bold mb-4'>{giangVien.ten}</h1>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-6'>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <Star className='h-5 w-5 fill-[#FFC107] text-[#FFC107]' />
                    <span className='text-[16px] font-bold'>{giangVien.danhGia.toFixed(1)}</span>
                  </div>
                  <p className='text-[12px] text-white/80'>Đánh giá giảng viên</p>
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <Users className='h-5 w-5 text-white' />
                    <span className='text-[16px] font-bold'>{giangVien.tongHocVien.toLocaleString()}</span>
                  </div>
                  <p className='text-[12px] text-white/80'>Học viên</p>
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <PlayCircle className='h-5 w-5 text-white' />
                    <span className='text-[16px] font-bold'>{giangVien.tongKhoaHoc}</span>
                  </div>
                  <p className='text-[12px] text-white/80'>Khóa học</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1340px] mx-auto px-6 py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div>
              <h2 className='text-[24px] font-bold text-[#FF5722] mb-4'>Về tôi</h2>
              <p className='text-[16px] text-[#1C1D1F] leading-relaxed whitespace-pre-line'>{giangVien.gioiThieu}</p>
            </div>

            <div>
              <h2 className='text-[24px] font-bold text-[#FF5722] mb-4'>Lĩnh vực chuyên môn</h2>

              <Badge
                variant='outline'
                className='
      border-[#FF5722]
      text-[#FF5722]
      hover:bg-[#FF5722]/10
    '
              >
                {giangVien.chuyenMon}
              </Badge>
            </div>

            <div>
              <SectionHeader title={`Khóa học của ${giangVien.ten}`} />
              <div className='grid sm:grid-cols-2 gap-4'>
                {khoaHocCuaGiangVien.map((khoaHoc) => (
                  <KhoaHocCard key={khoaHoc.idKhoaHoc} thongTinKhoaHoc={khoaHoc} />
                ))}
              </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='bg-[#FF5722]/5 border border-[#FF5722]/20 rounded p-6 sticky top-24'>
              <h3 className='text-[19px] font-bold text-[#FF5722] mb-4'>Học vấn & kinh nghiệm</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-[12px] text-[#FF5722]/70 uppercase font-bold mb-1'>Kinh nghiệm</p>
                  <p className='text-[14px] text-[#1C1D1F]'>{giangVien.kinhNghiem ?? ''}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#FF5722]/70 uppercase font-bold mb-1'>Học vấn</p>
                  <p className='text-[14px] text-[#1C1D1F]'>{giangVien.hocVan ?? ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
