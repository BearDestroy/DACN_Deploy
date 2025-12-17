import { Clock, Book, PlayCircle, CheckCircle2, Map, Layers, MoreHorizontal, Route, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RatingStars } from './common/RatingStars'
import { formatDate, formatTime } from '@/utils/function'
import type { LoTrinhHoc, LoTrinhNguoiDung } from '@/@types/LoTrinhHoc'
import { useHoctap } from '@/hooks/useHocTap'
import { useNguoiDung } from '@/hooks/useNguoiDung'

interface LoTrinhHocExtended extends LoTrinhHoc {
  image?: string
  thumbnail?: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface LoTrinhHocCardProps {
  loTrinh: LoTrinhHocExtended
}

const DEFAULT_IMAGE = '/channel-default.jpg'
const API_BASE_URL = '1.55.203.158:5154'

export function LoTrinhHocCard({ loTrinh }: LoTrinhHocCardProps) {
  const [hienPopup, setHienPopup] = useState(false)
  const [viTriPopup, setViTriPopup] = useState<'left' | 'right'>('right')
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { currentUser } = useNguoiDung()
  const navigate = useNavigate()
  const { loTrinhHocDaGhiDanh, dangKyLoTrinhHocLoading, dangKyLoTrinhHoc } = useHoctap()

  const getImageUrl = (path: string | null | undefined) => {
    if (!path || path.trim() === '') return DEFAULT_IMAGE

    if (path.startsWith('http')) return path

    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${API_BASE_URL}${cleanPath}`
  }

  const rawImagePath =
    loTrinh.anhDaiDien || loTrinh.hinhDaiDien || loTrinh.hinhAnh || loTrinh.image || loTrinh.thumbnail

  const [imgSrc, setImgSrc] = useState(getImageUrl(rawImagePath))

  useEffect(() => {
    // Cập nhật lại nếu props thay đổi (do API load chậm hoặc re-render)
    const newPath = loTrinh.anhDaiDien || loTrinh.hinhDaiDien || loTrinh.hinhAnh || loTrinh.image || loTrinh.thumbnail

    setImgSrc(getImageUrl(newPath))
  }, [loTrinh])

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE)
    }
  }

  const daDangKy = useMemo(() => {
    if (!loTrinhHocDaGhiDanh) return false
    return loTrinhHocDaGhiDanh.some((lt: LoTrinhNguoiDung) => lt.idLoTrinhHoc === loTrinh.idLoTrinhHoc)
  }, [loTrinhHocDaGhiDanh, loTrinh.idLoTrinhHoc])

  const [daDangKyInternal, setDaDangKyInternal] = useState(daDangKy)

  useEffect(() => {
    setDaDangKyInternal(daDangKy)
  }, [daDangKy])

  const thongKe = useMemo(() => {
    const dsKhoaHoc = loTrinh.danhSachKhoaHoc || []
    const tongKhoaHoc = dsKhoaHoc.length

    const tongThoiLuongVal = dsKhoaHoc.reduce((acc, cur) => acc + (cur.thoiLuong || 0), 0)
    const tongThoiLuong = formatTime(tongThoiLuongVal)

    const tongBaiGiang = dsKhoaHoc.reduce((acc, cur) => acc + (cur.soLuongBaiHoc || 0), 0)
    const tongGiaTriDanhGia = dsKhoaHoc.reduce((acc, cur) => acc + (cur.danhGiaTrungBinh || 0), 0)
    const tongLuotDanhGia = dsKhoaHoc.reduce((acc, cur) => acc + (cur.tongSoDanhGia || 0), 0)

    const danhGiaTrungBinh = tongKhoaHoc > 0 ? Number((tongGiaTriDanhGia / tongKhoaHoc).toFixed(1)) : 0

    return { tongKhoaHoc, tongThoiLuong, tongBaiGiang, danhGiaTrungBinh, tongLuotDanhGia }
  }, [loTrinh.danhSachKhoaHoc])

  const xuLyDangKy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (daDangKyInternal) {
      navigate(`/khoa-hoc-cua-toi`)
      return
    }

    await dangKyLoTrinhHoc(loTrinh.idLoTrinhHoc)
    if (currentUser) {
      setDaDangKyInternal(true)
    }
  }

  const noiDungHocDuoc = useMemo(() => {
    return typeof loTrinh.noiDungHocDuoc === 'string'
      ? loTrinh.noiDungHocDuoc
          .split('.')
          .map((x) => x.trim())
          .filter((x) => x.length > 0)
      : []
  }, [loTrinh.noiDungHocDuoc])

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setHienPopup(true)
  }

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setHienPopup(false)
    }, 50)
  }

  useEffect(() => {
    if (hienPopup && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceOnRight = window.innerWidth - rect.right
      setTimeout(() => {
        setViTriPopup(spaceOnRight > 350 ? 'right' : 'left')
      })
    }
  }, [hienPopup])

  const handleXemChiTiet = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/thong-tin-lo-trinh-hoc/${loTrinh.idLoTrinhHoc}`)
  }

  return (
    <div
      ref={containerRef}
      className='relative group h-full'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className='h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 cursor-pointer bg-white'
        onClick={handleXemChiTiet}
      >
        <div className='relative overflow-hidden aspect-video bg-slate-100'>
          {/* Hình ảnh */}
          <img
            src={imgSrc}
            alt={loTrinh.tenLoTrinh}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            onError={handleImageError}
          />

          <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <Map className='w-12 h-12 text-white drop-shadow-lg' />
          </div>
          <Badge className='absolute bottom-2 right-2 bg-black/60 text-white hover:bg-black/70 backdrop-blur-sm text-[10px] px-2 py-0.5 border-none flex items-center gap-1'>
            <Layers className='w-3 h-3' />
            {thongKe.tongKhoaHoc} khóa học
          </Badge>
        </div>

        <CardContent className='p-4 flex flex-col gap-2 flex-1'>
          <h3 className='text-[15px] font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors'>
            {loTrinh.tenLoTrinh}
          </h3>

          <p className='text-[12px] text-slate-500 line-clamp-2 min-h-[2.25em]'>{loTrinh.moTa}</p>
          <div className='mt-auto flex items-center gap-1 mb-1 pt-2'>
            <RatingStars rating={thongKe.danhGiaTrungBinh} size='sm' />
            <span className='text-xs text-slate-400 ml-1'>({thongKe.tongLuotDanhGia})</span>
          </div>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100'>
            <div className='flex items-center gap-1'>
              <Clock className='h-3.5 w-3.5' />
              <span>{thongKe.tongThoiLuong}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Route className='h-3.5 w-3.5' />
              <span>{thongKe.tongKhoaHoc} khóa học</span>
            </div>
            <div className='flex items-center gap-1'>
              <Book className='h-3.5 w-3.5' />
              <span>{thongKe.tongBaiGiang} bài giảng</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phần Popup */}
      <div
        className={`
          hidden md:block absolute -top-2.5 z-50 w-[360px] 
          transition-all duration-200 ease-out
          ${hienPopup ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
          ${viTriPopup === 'right' ? 'left-[calc(100%+1rem)]' : 'right-[calc(100%+1rem)]'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className='shadow-2xl border-slate-200 bg-white overflow-hidden relative'>
          <div
            className={`absolute top-12 w-4 h-4 bg-white transform rotate-45 border-l border-b border-slate-200 ${
              viTriPopup === 'right' ? '-left-2' : '-right-2'
            }`}
          ></div>

          <CardContent className='p-5 space-y-4'>
            <div>
              <h3 className='text-lg font-bold text-slate-900 leading-tight mb-2'>{loTrinh.tenLoTrinh}</h3>
              <div className='flex items-center gap-2 text-xs'>
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-700 hover:bg-green-100 font-medium border-none'
                >
                  Cập nhật {formatDate(loTrinh.thoiGianChinhSua ?? new Date())}
                </Badge>
                <span className='text-slate-400'>|</span>
                <span className='font-medium text-orange-600'>{loTrinh.tenTrinhDo}</span>
              </div>
            </div>

            <div>
              <p className='text-xs font-bold text-slate-900 uppercase tracking-wider mb-2'>Bạn sẽ đạt được:</p>
              <ul className='space-y-2'>
                {noiDungHocDuoc.slice(0, 3).map((item, i) => (
                  <li key={i} className='flex items-start gap-2.5'>
                    <CheckCircle2 className='h-4 w-4 text-green-600 shrink-0 mt-0.5' />
                    <span className='text-[13px] text-slate-700 leading-snug line-clamp-2'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='bg-slate-50 rounded-md p-3'>
              <p className='text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex justify-between'>
                Khóa học trong lộ trình
                <span className='text-slate-500 font-normal normal-case'>({thongKe.tongKhoaHoc})</span>
              </p>
              <div className='space-y-2'>
                {(loTrinh.danhSachKhoaHoc || []).slice(0, 3).map((kh, index) => (
                  <div key={index} className='flex items-center gap-2 text-[13px] text-slate-700'>
                    <PlayCircle className='h-3 w-3 text-slate-400 shrink-0' />
                    <span className='line-clamp-1'>{kh.tenKhoaHoc}</span>
                  </div>
                ))}
                {(loTrinh.danhSachKhoaHoc || []).length > 3 && (
                  <div className='flex items-center gap-2 text-[12px] text-slate-500 italic pl-5'>
                    <MoreHorizontal className='h-3 w-3' />
                    <span>và {(loTrinh.danhSachKhoaHoc || []).length - 3} khóa học khác</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className='flex gap-3'>
              <Button
                onClick={xuLyDangKy}
                disabled={dangKyLoTrinhHocLoading}
                className={`flex-1 font-bold h-10 ${
                  daDangKyInternal
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {dangKyLoTrinhHocLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : daDangKyInternal ? (
                  'Vào học ngay'
                ) : (
                  'Đăng ký lộ trình'
                )}
              </Button>
              <Button
                onClick={handleXemChiTiet}
                variant='outline'
                className='flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold h-10'
              >
                Chi tiết
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
