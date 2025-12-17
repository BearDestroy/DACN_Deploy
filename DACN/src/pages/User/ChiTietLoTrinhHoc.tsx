import { useParams, useNavigate, useLocation, type NavigateFunction } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import {
  Star,
  Clock,
  Signal,
  Users,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  LayoutList,
  MonitorPlay,
  GraduationCap,
  FileText,
  Video,
  ChevronDown,
  ListVideo,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { formatDate, formatTime } from '@/utils/function'
import { layChiTietLoTrinhHoc } from '@/apis/loTrinhHoc'
import type { IBaiHocResponse, IChuongHoc } from '@/apis/khoahoc'
import type { IKhoaHocChiTiet, LoTrinhNguoiDung } from '@/@types/LoTrinhHoc'
import { showErrorToast } from '@/utils/toast'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { useHoctap } from '@/hooks/useHocTap'

const CourseItem = ({
  course,
  index,
  navigate
}: {
  course: IKhoaHocChiTiet
  index: number
  navigate: NavigateFunction
}) => {
  return (
    <div className='group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-6'>
      {/* Header Khóa học */}
      <div className='p-5 flex flex-row items-start gap-5 bg-white'>
        <div
          className='w-24 h-24 sm:w-32 sm:h-32 aspect-square shrink-0 rounded-xl overflow-hidden relative cursor-pointer border border-gray-100 shadow-inner'
          onClick={() => navigate(`/thong-tin-khoa-hoc/${course.idKhoaHoc}`)}
        >
          <img
            src={'1.55.203.158:5154' + course.hinhAnh}
            alt={course.tenKhoaHoc}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center'>
            <PlayCircle className='text-white/90 w-10 h-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-md' />
          </div>
          <div className='absolute top-0 left-0 bg-[#FF5722] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm z-10'>
            #{index + 1}
          </div>
        </div>

        <div className='flex-1 flex flex-col min-w-0 h-full justify-between py-0.5'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-xs font-medium text-gray-500'>
                <span className='bg-[#FF5722]/10 text-[#FF5722] px-2 py-0.5 rounded-md border border-[#FF5722]/20 flex items-center gap-1'>
                  <ListVideo className='w-3 h-3' /> {course.tenTrinhDo || 'Cơ bản'}
                </span>
              </div>
              <div className='flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100'>
                <span className='text-xs font-bold text-yellow-700 pt-0.5'>
                  {course.danhGia?.danhGiaTrungBinh?.toFixed(1) || 5.0}
                </span>
                <Star className='w-3 h-3 fill-yellow-500 text-yellow-500 mb-0.5' />
              </div>
            </div>
            <h3
              className='text-base sm:text-lg font-bold text-gray-900 leading-tight hover:text-[#FF5722] cursor-pointer transition-colors line-clamp-2'
              onClick={() => navigate(`/thong-tin-khoa-hoc/${course.idKhoaHoc}`)}
              title={course.tenKhoaHoc}
            >
              {course.tenKhoaHoc}
            </h3>
            <div className='flex items-center gap-2'>
              <Avatar className='w-5 h-5 border border-gray-100'>
                <AvatarImage src={'1.55.203.158:5154' + course.giangVien?.hinhAnh} />
                <AvatarFallback className='text-[9px] bg-gray-100 text-gray-600'>GV</AvatarFallback>
              </Avatar>
              <span className='text-xs text-gray-600 font-medium truncate'>{course.giangVien?.tenGiangVien}</span>
            </div>
          </div>
          <div className='flex items-center gap-4 text-xs text-gray-500 font-medium mt-3 border-t border-dashed border-gray-100 pt-2'>
            <span className='flex items-center gap-1.5'>
              <BookOpen className='w-3.5 h-3.5 text-[#FF5722]' />
              {course.soLuongChuongHoc} chương
            </span>
            <span className='w-px h-3 bg-gray-300'></span>
            <span className='flex items-center gap-1.5'>
              <Clock className='w-3.5 h-3.5 text-[#FF5722]' />
              {formatTime(course.soLuongGioHoc)}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion Chương học */}
      <div className='bg-[#FF5722]/5 border-t border-gray-200'>
        <Accordion type='single' collapsible className='w-full'>
          {course.chuongHoc?.map((chuong: IChuongHoc, idx: number) => (
            <AccordionItem
              key={chuong.idChuongHoc || idx}
              value={`c-${chuong.idChuongHoc || idx}`}
              className='border-b border-gray-100 last:border-0'
            >
              <AccordionTrigger className='px-5 py-3.5 hover:bg-[#FF5722]/10 hover:no-underline transition-all group/trigger'>
                <div className='flex items-center gap-3 w-full text-left'>
                  <div className='w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-bold group-hover/trigger:border-[#FF5722]/20 group-hover/trigger:bg-[#FF5722]/10 group-hover/trigger:text-[#FF5722] transition-colors shadow-sm'>
                    {idx + 1}
                  </div>
                  <div className='flex-1 min-w-0 flex flex-col'>
                    <span className='text-sm font-semibold text-gray-700 truncate group-hover/trigger:text-[#FF5722] transition-colors'>
                      {chuong.tenChuongHoc}
                    </span>
                    <span className='text-[10px] text-gray-400 font-medium'>{chuong.baiHoc?.length || 0} bài học</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-0 pb-0 bg-white shadow-inner'>
                <div className='flex flex-col'>
                  {chuong.baiHoc?.map((bai: IBaiHocResponse, bIdx: number) => (
                    <div
                      key={bai.idBaiHoc || bIdx}
                      className='relative flex items-center justify-between px-5 py-2.5 pl-13 hover:bg-[#FF5722]/10 transition-colors group/lesson cursor-pointer'
                    >
                      <div className='absolute left-[1.9rem] top-0 bottom-0 w-px bg-gray-100 group-hover/lesson:bg-[#FF5722]/20'></div>

                      <div className='flex items-center gap-3 min-w-0 z-10'>
                        {bai.videoUrl ? (
                          <Video className='w-3.5 h-3.5 text-gray-400 group-hover/lesson:text-[#FF5722] shrink-0' />
                        ) : (
                          <FileText className='w-3.5 h-3.5 text-gray-400 group-hover/lesson:text-[#FF5722] shrink-0' />
                        )}
                        <span className='text-[13px] text-gray-600 group-hover/lesson:text-[#FF5722] font-medium truncate'>
                          {bai.tenBaiHoc}
                        </span>
                      </div>
                      <span className='text-[10px] text-gray-400 font-mono ml-2 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100'>
                        {formatTime(bai.thoiLuongBaiHoc)}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Footer xem chi tiết */}
      <div
        className='py-2.5 bg-gray-50 border-t border-gray-100 flex justify-center cursor-pointer hover:bg-[#FF5722]/10 transition-colors group active:bg-[#FF5722]/20'
        onClick={() => navigate(`/thong-tin-khoa-hoc/${course.idKhoaHoc}`)}
      >
        <div className='text-xs font-bold text-gray-500 group-hover:text-[#FF5722] flex items-center gap-1.5 uppercase tracking-wide transition-colors'>
          Chi tiết khóa học{' '}
          <ChevronDown className='w-3.5 h-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5' />
        </div>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---
export function ChiTietLoTrinh() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const { currentUser } = useNguoiDung()
  const { loTrinhHocDaGhiDanh, dangKyLoTrinhHocLoading, dangKyLoTrinhHoc } = useHoctap()

  const {
    data: loTrinhDataTraVe,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['loTrinhChiTiet', id],
    queryFn: () => layChiTietLoTrinhHoc(Number(id)),
    enabled: !!id
  })
  const loTrinhData = loTrinhDataTraVe?.data

  // 3. Tính toán trạng thái đăng ký
  const daDangKy = useMemo(() => {
    if (!loTrinhHocDaGhiDanh || !id) return false
    return loTrinhHocDaGhiDanh.some((lt: LoTrinhNguoiDung) => lt.idLoTrinhHoc === Number(id))
  }, [loTrinhHocDaGhiDanh, id])

  const [daDangKyInternal, setDaDangKyInternal] = useState(daDangKy)

  useEffect(() => {
    setDaDangKyInternal(daDangKy)
  }, [daDangKy])

  // 4. Handle Đăng ký
  const handleDangKy = async () => {
    if (!currentUser) {
      showErrorToast({ message: 'Vui lòng đăng nhập để đăng ký lộ trình!' })
      navigate('/dang-nhap', { state: { from: location.pathname } })
      return
    }
    if (daDangKyInternal) {
      navigate('/khoa-hoc-cua-toi')
      return
    }
    await dangKyLoTrinhHoc(Number(id))
    if (currentUser) {
      setDaDangKyInternal(true)
    }
  }
  if (!id) return null

  if (isLoading)
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-10 h-10 animate-spin text-orange-600' />
          <p className='text-sm text-gray-500 font-medium animate-pulse'>Đang tải dữ liệu lộ trình...</p>
        </div>
      </div>
    )

  if (isError || !loTrinhData)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center text-red-500 font-medium'>
          <p>Không thể tải dữ liệu lộ trình.</p>
          <Button variant='link' onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )

  // 6. Tính toán thống kê hiển thị
  const totalCourses = loTrinhData.danhSachKhoaHoc.length
  const totalLessons = loTrinhData.danhSachKhoaHoc.reduce((acc, curr) => acc + curr.soLuongBaiGiang, 0)
  const totalDuration = loTrinhData.danhSachKhoaHoc.reduce((acc, curr) => acc + curr.soLuongGioHoc, 0)
  const totalRating = loTrinhData.danhSachKhoaHoc.reduce((acc, curr) => acc + (curr.danhGia?.danhGiaTrungBinh || 0), 0)
  const avgRatingPath = totalCourses > 0 ? (totalRating / totalCourses).toFixed(1) : 0
  const totalReviews = loTrinhData.danhSachKhoaHoc.reduce((acc, curr) => acc + (curr.danhGia?.soLuongDanhGia || 0), 0)
  const totalStudents = loTrinhData.danhSachKhoaHoc.reduce((acc, curr) => acc + (curr.danhGia?.soLuongHocVien || 0), 0)

  const listNoiDung = loTrinhData.noiDungHocDuoc
    ? loTrinhData.noiDungHocDuoc
        .split(/[\n.]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div className='bg-[#FF5722]/5 min-h-screen font-sans'>
      {/* --- HERO SECTION --- */}
      <div className='bg-[#FF5722] text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-12 opacity-10 pointer-events-none'>
          <LayoutList size={400} />
        </div>

        <div className='container mx-auto px-4 py-12 relative z-10'>
          <div className='grid lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2 space-y-6'>
              <div className='flex items-center gap-2'>
                <span className='bg-[#FF5722]/20 text-[#FF5722] px-3 py-1 rounded-full text-xs font-bold border border-[#FF5722]/30 uppercase tracking-wide text-white'>
                  Lộ trình chuyên sâu
                </span>
                <span className='text-white/60 text-sm'>
                  Cập nhật {formatDate(loTrinhData.thoiGianCapNhat ?? new Date())}
                </span>
              </div>

              <h1 className='text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white'>
                {loTrinhData.tenLoTrinh}
              </h1>

              <p className='text-lg text-white/90 leading-relaxed max-w-2xl'>{loTrinhData.moTaNgan}</p>

              <div className='flex flex-wrap items-center gap-6 text-sm pt-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-yellow-400'>{avgRatingPath}</span>
                  <div className='flex flex-col'>
                    <div className='flex text-yellow-400'>
                      <Star className='w-4 h-4 fill-current' />
                      <Star className='w-4 h-4 fill-current' />
                      <Star className='w-4 h-4 fill-current' />
                      <Star className='w-4 h-4 fill-current' />
                      <Star className='w-4 h-4 fill-current' />
                    </div>
                    <span className='text-xs text-white/60 underline cursor-pointer'>({totalReviews} đánh giá)</span>
                  </div>
                </div>

                <div className='h-8 w-px bg-white/20 hidden sm:block'></div>

                <div className='flex items-center gap-2'>
                  <Users className='h-5 w-5 text-white/70' />
                  <div>
                    <div className='font-bold text-white'>{totalStudents.toLocaleString()}</div>
                    <div className='text-xs text-white/60'>Học viên</div>
                  </div>
                </div>

                <div className='h-8 w-px bg-white/20 hidden sm:block'></div>

                <div className='flex items-center gap-2'>
                  <Signal className='h-5 w-5 text-white/70' />
                  <div>
                    <div className='font-bold text-white'>{loTrinhData.tenTrinhDo}</div>
                    <div className='text-xs text-white/60'>Trình độ</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden lg:block'></div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className='container mx-auto px-4 py-10'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* LEFT COLUMN */}
          <div className='lg:col-span-2 space-y-10'>
            {/* Mục tiêu */}
            <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-sm'>
              <h2 className='text-xl font-bold mb-6 text-gray-900'>Mục tiêu lộ trình</h2>
              <div className='grid md:grid-cols-2 gap-x-8 gap-y-4'>
                {listNoiDung.map((item, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-[#FF5722] mt-0.5 shrink-0' />
                    <span className='text-gray-700 text-sm leading-relaxed'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách khóa học */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                  <MonitorPlay className='h-6 w-6 text-[#FF5722]' />
                  Nội dung lộ trình
                </h2>
                <div className='text-sm text-gray-500 font-medium'>
                  {totalCourses} khóa học • {totalLessons} bài giảng • {formatTime(totalDuration)}
                </div>
              </div>

              <div className='space-y-6'>
                {loTrinhData.danhSachKhoaHoc.map((course, index) => (
                  <CourseItem key={course.idKhoaHoc} course={course} index={index} navigate={navigate} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 z-20'>
              <div className='bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col'>
                {/* Thumbnail */}
                <div className='relative aspect-video group cursor-pointer overflow-hidden'>
                  <img
                    src={'1.55.203.158:5154' + loTrinhData.hinhAnh}
                    alt={loTrinhData.tenLoTrinh}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all'>
                    <div className='bg-white/95 p-4 rounded-full shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform'>
                      <GraduationCap className='h-8 w-8 text-[#FF5722]' />
                    </div>
                  </div>
                </div>

                <div className='p-6 flex flex-col gap-5'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-gray-900 mb-1'>Miễn phí</div>
                    <p className='text-sm text-gray-500'>Truy cập trọn đời vào lộ trình</p>
                  </div>

                  {/* Button Action */}
                  <Button
                    className={`w-full h-12 text-lg font-bold shadow-lg transition-all active:scale-95 ${
                      daDangKyInternal
                        ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[#FF5722]/20'
                        : 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[#FF5722]/20'
                    }`}
                    onClick={handleDangKy}
                    disabled={dangKyLoTrinhHocLoading}
                  >
                    {dangKyLoTrinhHocLoading ? (
                      <Loader2 className='w-6 h-6 animate-spin' />
                    ) : daDangKyInternal ? (
                      'Vào học ngay'
                    ) : (
                      'Đăng ký lộ trình ngay'
                    )}
                  </Button>

                  <div className='space-y-4 pt-4 border-t border-dashed border-gray-200'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <LayoutList className='h-4 w-4 text-[#FF5722]' /> Số khóa học
                      </span>
                      <span className='font-semibold text-gray-900'>{totalCourses}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <PlayCircle className='h-4 w-4 text-[#FF5722]' /> Tổng bài giảng
                      </span>
                      <span className='font-semibold text-gray-900'>{totalLessons}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <Clock className='h-4 w-4 text-[#FF5722]' /> Thời lượng
                      </span>
                      <span className='font-semibold text-gray-900'>{formatTime(totalDuration)}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <Signal className='h-4 w-4 text-[#FF5722]' /> Trình độ
                      </span>
                      <span className='font-semibold text-gray-900'>{loTrinhData.tenTrinhDo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
