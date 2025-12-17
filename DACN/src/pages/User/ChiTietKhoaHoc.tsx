import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Star,
  Clock,
  Signal,
  Users,
  CheckCircle2,
  Play,
  User,
  BookOpen,
  MoreHorizontal,
  Loader2,
  MonitorPlay,
  Flag // Icon báo cáo
} from 'lucide-react'
import { useHoctap } from '@/hooks/useHocTap'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useQuery } from '@tanstack/react-query'
import { layChiTietKhoaHocTrangChu } from '@/apis/khoahoc'
import { formatDate, formatTime } from '@/utils/function'
import { useState, useEffect, useMemo } from 'react'
import { ReviewModal } from '@/components/DanhGiaModal'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { showErrorToast, showInfoToast } from '@/utils/toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ReportModal } from '@/components/ReportModal'
import { AvatarImage } from '@radix-ui/react-avatar'

export function ChiTietKhoaHoc() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const { currentUser } = useNguoiDung()
  const { daDangKyKhoaHoc, dangKyKhoaHoc, dangKyKhoaHocLoading } = useHoctap()

  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const [reportOpen, setReportOpen] = useState(false)
  const [reportTargetId, setReportTargetId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<'REVIEW' | 'COURSE'>('REVIEW')

  const {
    data: course,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['courseDetail', id],
    queryFn: () => layChiTietKhoaHocTrangChu(Number(id)).then((res) => res.data),
    enabled: !!id
  })

  const daDangKy = useMemo(() => {
    if (!id) return false
    return daDangKyKhoaHoc(Number(id))
  }, [daDangKyKhoaHoc, id])

  const [daDangKyInternal, setDaDangKyInternal] = useState(daDangKy)
  useEffect(() => {
    setDaDangKyInternal(daDangKy)
  }, [daDangKy])

  const handleGoToGiangVien = (giangVienId?: number) => {
    if (!giangVienId) return
    navigate(`/giang-vien/${giangVienId}`)
  }

  const handleGoToCourse = () => {
    navigate(`/hoc-tap/${id}`)
  }

  const handleDangKy = async () => {
    if (!currentUser) {
      showErrorToast({ message: 'Vui lòng đăng nhập để đăng ký khóa học!' })
      navigate('/dang-nhap', { state: { from: location.pathname } })
      return
    }
    if (daDangKyInternal) {
      handleGoToCourse()
      return
    }
    if (id) {
      await dangKyKhoaHoc(Number(id))
      if (currentUser) {
        setDaDangKyInternal(true)
      }
    }
  }

  if (!id) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <h1 className='text-2xl text-black mb-4'>Không tìm thấy khóa học</h1>
        <Button onClick={() => navigate('/search')}>Quay lại trang tìm kiếm</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-10 h-10 animate-spin text-[#FF5722]' />
          <p className='text-sm text-gray-500 font-medium animate-pulse'>Đang tải dữ liệu khóa học...</p>
        </div>
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <h1 className='text-2xl text-black mb-4'>Lỗi khi tải khóa học</h1>
        <Button onClick={() => navigate('/search')}>Quay lại trang tìm kiếm</Button>
      </div>
    )
  }

  const noiDungHocDuoc = course?.noiDungHocDuoc
    ? course?.noiDungHocDuoc
        .split('.')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const totalLessons = course.soLuongBaiGiang ?? 0
  const totalDuration = course.soLuongGioHoc ?? 0
  const avgRating = (course.danhGia?.danhGiaTrungBinh ?? 0).toFixed(1)
  const totalReviews = course.danhGia?.soLuongDanhGia ?? 0
  const totalStudents = course.soLuongHocVien ?? 0
  const lastUpdate = formatDate(course.thoiGianCapNhat ?? course.thoiGianTao ?? new Date())

  return (
    <div className='bg-[#FF5722]/5 min-h-screen font-sans'>
      <div className='bg-[#FF5722] text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-12 opacity-10 pointer-events-none'>
          <MonitorPlay size={400} />
        </div>

        <div className='container mx-auto px-4 py-12 relative z-10'>
          <div className='grid lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2 space-y-6'>
              <div className='flex items-center gap-2'>
                <span className='bg-[#FF5722]/20 text-[#FF5722] px-3 py-1 rounded-full text-xs font-bold border border-[#FF5722]/30 uppercase tracking-wide text-white'>
                  Khóa học
                </span>
                <span className='text-white/60 text-sm'>Cập nhật {lastUpdate}</span>
              </div>

              <h1 className='text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white'>
                {course.tenKhoaHoc ?? 'Khóa học'}
              </h1>

              <p className='text-lg text-white/90 leading-relaxed max-w-2xl'>
                {course.moTaNgan ?? 'Chưa có mô tả ngắn.'}
              </p>

              <div className='flex flex-wrap items-center gap-6 text-sm pt-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-yellow-400'>{avgRating}</span>
                  <div className='flex flex-col'>
                    <div className='flex text-yellow-400'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.danhGia?.danhGiaTrungBinh ?? 0)
                              ? 'fill-current'
                              : 'fill-white/30 text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-xs text-white/60 underline cursor-pointer' onClick={() => setModalOpen(true)}>
                      ({totalReviews} đánh giá)
                    </span>
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
                    <div className='font-bold text-white'>{course.tenTrinhDo ?? 'Không rõ'}</div>
                    <div className='text-xs text-white/60'>Trình độ</div>
                  </div>
                </div>

                <div className='h-8 w-px bg-white/20 hidden sm:block'></div>

                <div
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={() => handleGoToGiangVien(course.giangVien?.idGiangVien)}
                >
                  <Avatar className='w-8 h-8 border border-gray-100 bg-white/20'>
                    <AvatarFallback className='text-sm bg-white/10 text-white/80'>GV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-bold text-white'>{course.giangVien?.tenGiangVien ?? 'Đang cập nhật'}</div>
                    <div className='text-xs text-white/60 underline'>Giảng viên</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden lg:block'></div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-10'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-10'>
            <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-sm'>
              <h2 className='text-xl font-bold mb-6 text-gray-900'>Bạn sẽ học được gì</h2>
              <div className='grid md:grid-cols-2 gap-x-8 gap-y-4'>
                {(noiDungHocDuoc ?? []).map((item, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-[#FF5722] mt-0.5 shrink-0' />
                    <span className='text-gray-700 text-sm leading-relaxed'>{item ?? ''}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nội dung khóa học (Chương học/Bài giảng) */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                  <BookOpen className='h-6 w-6 text-[#FF5722]' />
                  Nội dung khóa học
                </h2>
                <div className='text-sm text-gray-500 font-medium'>
                  {course.soLuongChuongHoc ?? 0} phần • {totalLessons} bài học • {formatTime(totalDuration)}
                </div>
              </div>

              <Accordion type='single' collapsible className='border rounded-xl bg-white shadow-sm'>
                {(course.chuongHoc ?? []).map((section, index) => (
                  <AccordionItem
                    key={index}
                    value={`section-${index}`}
                    className='border-b border-gray-100 last:border-0'
                  >
                    <AccordionTrigger className='px-5 py-3.5 hover:bg-[#FF5722]/10 hover:no-underline transition-all group/trigger'>
                      <div className='flex items-center justify-between w-full pr-4 text-left'>
                        <div className='flex items-center gap-3 w-full text-left'>
                          <div className='w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold group-hover/trigger:border-[#FF5722]/20 group-hover/trigger:bg-[#FF5722]/10 group-hover/trigger:text-[#FF5722] transition-colors shadow-sm'>
                            {index + 1}
                          </div>
                          <div className='flex-1 min-w-0 flex flex-col'>
                            <span className='text-base font-semibold text-gray-700 truncate group-hover/trigger:text-[#FF5722] transition-colors'>
                              {section.tenChuongHoc ?? 'Chương học'}
                            </span>
                            <span className='text-xs text-gray-500 font-medium'>
                              {(section.baiHoc ?? []).length} bài học
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-0 pb-0 bg-gray-50 shadow-inner border-t border-gray-100'>
                      <div className='flex flex-col'>
                        {(section.baiHoc ?? []).map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className='relative flex items-center justify-between px-5 py-2.5 pl-13 hover:bg-[#FF5722]/10 transition-colors group/lesson cursor-default'
                          >
                            <div className='absolute left-[1.9rem] top-0 bottom-0 w-px bg-gray-100 group-hover/lesson:bg-[#FF5722]/20'></div>
                            <div className='flex items-center gap-3 min-w-0 z-10'>
                              <Play className='h-3.5 w-3.5 text-gray-400 group-hover/lesson:text-[#FF5722] shrink-0' />
                              <span className='text-[13px] text-gray-600 group-hover/lesson:text-[#FF5722] font-medium truncate'>
                                {lesson.tenBaiHoc ?? 'Bài học'}
                              </span>
                            </div>
                            <span className='text-[10px] text-gray-400 font-mono ml-2 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>
                              {formatTime(lesson.thoiLuongBaiHoc ?? 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Mô tả chi tiết */}
            <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-sm'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>Mô tả chi tiết</h2>
              <p className='text-gray-700 leading-relaxed'>{course.noiDungKhoaHoc ?? 'Nội dung đang được cập nhật.'}</p>
            </div>

            {/* Thông tin Giảng viên */}
            <div
              className='bg-white border border-gray-200 rounded-xl p-8 shadow-sm cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => handleGoToGiangVien(course.giangVien?.idGiangVien)}
            >
              <h2 className='text-2xl font-bold mb-6 text-gray-900'>Giảng viên</h2>
              <div className='flex gap-6 items-center'>
                <div className='shrink-0'>
                  <div className='bg-[#FF5722]/10 rounded-full w-24 h-24 flex items-center justify-center border-4 border-white shadow-md'>
                    <User className='h-12 w-12 text-[#FF5722]' />
                  </div>
                </div>
                <div className='flex-1 space-y-1.5'>
                  <h3 className='text-xl font-semibold text-black hover:text-[#FF5722] transition-colors'>
                    {course.giangVien?.tenGiangVien ?? 'Đang cập nhật'}
                  </h3>
                  <p className='text-gray-600 font-medium'>
                    {course.giangVien?.chuyenMon ?? 'Chưa có thông tin chuyên môn.'}
                  </p>
                  <div className='flex flex-wrap gap-x-6 gap-y-2 items-center text-sm text-gray-700 pt-2'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-yellow-500 font-bold'>
                        {course.giangVien?.danhGiaTrungBinh?.toFixed(1) ?? 0}
                      </span>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(course.giangVien?.danhGiaTrungBinh ?? 0)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className='font-bold text-gray-900'>{course.giangVien?.soLuongHocVien ?? 0}</span> học viên
                    </div>
                    <div>
                      <span className='font-bold text-gray-900'>{course.giangVien?.soLuongKhoaHoc ?? 0}</span> Khóa học
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100'>
                <p className='text-gray-700 text-sm leading-relaxed'>
                  {course.giangVien?.gioiThieu ?? 'Chưa có thông tin giới thiệu.'}
                </p>
              </div>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-sm'>
              <h2 className='text-2xl font-bold mb-6 text-gray-900'>Đánh giá học viên</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4'>
                {(course.danhGia?.danhSachBinhLuan ?? []).slice(0, 4).map((danhGia) => (
                  <div key={danhGia.idDanhGia} className='border p-4 rounded-lg shadow-sm bg-gray-50 relative'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <Avatar className='w-9 h-9 border border-gray-100'>
                          <AvatarImage
                            src={'1.55.203.158:5154' + danhGia.anhDaiDien}
                            alt={danhGia.hoTen}
                            className='object-cover'
                          />
                          <AvatarFallback className='bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold'>
                            {danhGia.hoTen?.charAt(0).toUpperCase() ?? 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-semibold text-gray-800 text-sm'>{danhGia.hoTen}</span>
                      </div>

                      <div className='relative'>
                        <button
                          type='button'
                          className='p-1 rounded-full hover:bg-gray-200 transition-colors'
                          onClick={() => setMenuOpen(menuOpen === danhGia.idDanhGia ? null : danhGia.idDanhGia)}
                        >
                          <MoreHorizontal className='h-5 w-5 text-gray-500' />
                        </button>

                        {menuOpen === danhGia.idDanhGia && (
                          <div className='absolute right-0 top-8 mt-1 w-40 bg-white border rounded shadow-xl z-10 overflow-hidden'>
                            <button
                              className='w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 text-sm font-medium'
                              onClick={() => {
                                if (!currentUser) {
                                  navigate('/dang-nhap')
                                  return
                                }

                                setReportType('REVIEW')
                                setReportTargetId(danhGia.idDanhGia)
                                setReportOpen(true)
                                setMenuOpen(null)
                              }}
                            >
                              Báo cáo lạm dụng
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-1 mb-2'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < danhGia.soDiemDanhGia ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <p className='text-gray-700 text-sm leading-relaxed'>{danhGia.loiDanhGia}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                variant='outline'
                className='w-full mt-2 h-10 border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722]/10 hover:text-[#E64A19] font-semibold'
              >
                Xem tất cả đánh giá ({totalReviews})
              </Button>

              <div className='mt-6 pt-4 border-t border-gray-100 flex justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  className='
      text-red-500
      border-red-300
      hover:bg-red-500
      hover:text-white
      hover:border-red-500
      gap-2
      font-medium
      transition-all
      duration-200
    '
                  onClick={() => {
                    if (!currentUser) {
                      showInfoToast({ message: 'Vui lòng đăng nhập để báo cáo' })
                      setMenuOpen(null)
                      navigate('/dang-nhap')
                      return
                    }
                    setReportType('COURSE')
                    setReportTargetId(Number(id))
                    setReportOpen(true)
                  }}
                >
                  <Flag className='h-4 w-4' />
                  Báo cáo vi phạm khóa học này
                </Button>
              </div>
            </div>
            {modalOpen && <ReviewModal id={Number(id)} open={modalOpen} onClose={() => setModalOpen(false)} />}
          </div>

          <div className='lg:col-span-1'>
            <div className='sticky top-24 z-20'>
              <div className='bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col'>
                <div
                  className='relative aspect-video group cursor-pointer overflow-hidden'
                  onClick={() => navigate('/#')}
                >
                  <img
                    src={'1.55.203.158:5154' + course.hinhAnh || ''}
                    alt={course.tenKhoaHoc ?? 'Khóa học'}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all'>
                    <div className='bg-white/95 p-4 rounded-full shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform'>
                      <Play className='h-8 w-8 text-[#FF5722]' />
                    </div>
                  </div>
                </div>

                <div className='p-6 flex flex-col gap-5'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-gray-900 mb-1'>Miễn phí</div>
                    <p className='text-sm text-gray-500'>Truy cập trọn đời vào khóa học</p>
                  </div>
                  <Button
                    className={`w-full h-12 text-lg font-bold shadow-lg transition-all active:scale-95 ${
                      daDangKyInternal
                        ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[#FF5722]/20'
                        : 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[#FF5722]/20'
                    }`}
                    onClick={handleDangKy}
                    disabled={dangKyKhoaHocLoading}
                  >
                    {dangKyKhoaHocLoading ? (
                      <Loader2 className='w-6 h-6 animate-spin' />
                    ) : daDangKyInternal ? (
                      'Tiếp tục học'
                    ) : (
                      'Đăng ký học ngay'
                    )}
                  </Button>

                  <div className='space-y-4 pt-4 border-t border-dashed border-gray-200'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <BookOpen className='h-4 w-4 text-[#FF5722]' /> Số chương
                      </span>
                      <span className='font-semibold text-gray-900'>{course.soLuongChuongHoc ?? 0}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='flex items-center gap-3 text-gray-600'>
                        <MonitorPlay className='h-4 w-4 text-[#FF5722]' /> Tổng bài giảng
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
                      <span className='font-semibold text-gray-900'>{course.tenTrinhDo ?? 'Không rõ'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => {
          setReportOpen(false)
          setReportTargetId(null)
        }}
        targetId={reportTargetId}
        type={reportType}
      />
    </div>
  )
}
