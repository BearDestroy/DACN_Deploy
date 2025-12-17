import type { IKhoaHocChiTiet } from '@/apis/khoahoc'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, BarChart3, CheckCircle2, GraduationCap, Star, User, BookOpen } from 'lucide-react'

interface OverviewTabProps {
  khoaHoc: IKhoaHocChiTiet | null
}

export function TongQuanTab({ khoaHoc }: OverviewTabProps) {
  if (!khoaHoc)
    return (
      <div className='flex flex-col items-center justify-center py-12 text-orange-600/70'>
        <BookOpen className='w-12 h-12 mb-3 opacity-20 text-orange-300' />
        <p>Chưa có thông tin khóa học.</p>
      </div>
    )

  const noiDungHocDuoc = khoaHoc.noiDungHocDuoc
    ? khoaHoc.noiDungHocDuoc.split('.').filter((item) => item.trim().length > 0)
    : []

  return (
    <div className='max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 pb-10 bg-orange-50 p-6 rounded-xl'>
      <div className='space-y-3'>
        <h2 className='text-2xl md:text-3xl font-bold text-orange-800 leading-tight tracking-tight'>
          {khoaHoc.tenKhoaHoc}
        </h2>
        <p className='text-orange-700 text-base md:text-lg leading-relaxed border-l-4 border-orange-400 pl-5 py-1'>
          {khoaHoc.moTaNgan}
        </p>
      </div>

      <div className='flex flex-wrap gap-6 md:gap-10 py-6 border-y border-orange-300/40'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-orange-100 rounded-xl border border-orange-300 text-orange-600 shadow-sm'>
            <Clock className='w-5 h-5' />
          </div>
          <div>
            <p className='text-[11px] text-orange-400 font-semibold uppercase tracking-wide mb-0.5'>Thời lượng</p>
            <p className='font-bold text-orange-800 text-base'>{khoaHoc.soLuongGioHoc} giờ</p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-orange-100 rounded-xl border border-orange-300 text-orange-600 shadow-sm'>
            <Users className='w-5 h-5' />
          </div>
          <div>
            <p className='text-[11px] text-orange-400 font-semibold uppercase tracking-wide mb-0.5'>Học viên</p>
            <p className='font-bold text-orange-800 text-base'>{khoaHoc.soLuongHocVien}</p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-orange-100 rounded-xl border border-orange-300 text-orange-600 shadow-sm'>
            <BarChart3 className='w-5 h-5' />
          </div>
          <div>
            <p className='text-[11px] text-orange-400 font-semibold uppercase tracking-wide mb-0.5'>Trình độ</p>
            <p className='font-bold text-orange-800 text-base'>{khoaHoc.tenTrinhDo}</p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-orange-800 flex items-center gap-3'>
          <div className='p-1.5 rounded-lg bg-orange-200'>
            <GraduationCap className='w-5 h-5 text-orange-600' />
          </div>
          Bạn sẽ học được gì?
        </h3>

        <div className='rounded-2xl bg-orange-100 border border-orange-300 p-6 shadow-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
            {noiDungHocDuoc.length > 0 ? (
              noiDungHocDuoc.map((item, idx) => (
                <div key={idx} className='flex items-start gap-3 group'>
                  <div className='mt-1 shrink-0 p-0.5'>
                    <CheckCircle2 className='w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors' />
                  </div>
                  <span className='mt-1 text-orange-800 text-sm leading-relaxed group-hover:text-orange-600 transition-colors'>
                    {item.trim()}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-orange-400 italic col-span-2'>Nội dung đang cập nhật...</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Thông tin giảng viên */}
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-orange-800 flex items-center gap-3'>
          <div className='p-1.5 rounded-lg bg-orange-200'>
            <User className='w-5 h-5 text-orange-600' />
          </div>
          Giảng viên hướng dẫn
        </h3>

        <div className='relative overflow-hidden rounded-2xl bg-orange-100 border border-orange-300 p-6 shadow-2xl'>
          <div className='absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-200/50 rounded-full blur-3xl pointer-events-none'></div>

          <div className='relative z-10 flex flex-col md:flex-row gap-6 items-start'>
            <div className='shrink-0'>
              <Avatar className='h-20 w-20 border-4 border-orange-300 shadow-xl ring-2 ring-orange-200'>
                <AvatarImage src={'1.55.203.158:5154' + khoaHoc.giangVien?.hinhAnh || undefined} />
                <AvatarFallback className='bg-orange-600 text-xl font-bold text-white'>
                  {khoaHoc.giangVien?.tenGiangVien?.charAt(0).toUpperCase() || 'GV'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className='flex-1 space-y-3'>
              <div>
                <div className='flex flex-wrap items-center gap-3 mb-1'>
                  <h4 className='text-xl font-bold text-orange-800 tracking-tight'>
                    {khoaHoc.giangVien?.tenGiangVien}
                  </h4>
                  <Badge
                    variant='secondary'
                    className='bg-orange-200 text-orange-600 border-orange-300 px-2.5 py-0.5 text-xs hover:bg-orange-300'
                  >
                    Giảng viên
                  </Badge>
                </div>
                <p className='text-orange-600 font-medium text-base'>{khoaHoc.giangVien?.chuyenMon}</p>
              </div>

              <div className='flex items-center gap-4 text-sm text-orange-600/70'>
                {khoaHoc.giangVien.soLuongHocVien && (
                  <div className='flex items-center gap-2 bg-orange-200 px-3 py-1.5 rounded-lg border border-orange-300'>
                    <Users className='w-4 h-4 text-orange-600' />
                    <span className='font-medium text-xs'>{khoaHoc.giangVien.soLuongHocVien} Học viên</span>
                  </div>
                )}
                {khoaHoc.giangVien.danhGiaTrungBinh && (
                  <div className='flex items-center gap-2 bg-orange-200 px-3 py-1.5 rounded-lg border border-orange-300'>
                    <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
                    <span className='font-bold text-orange-800 text-xs'>{khoaHoc.giangVien.danhGiaTrungBinh}</span>
                  </div>
                )}
              </div>

              {khoaHoc.giangVien.gioiThieu && (
                <p className='text-orange-700 text-sm leading-relaxed pt-3 border-t border-orange-300'>
                  {khoaHoc.giangVien.gioiThieu}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
