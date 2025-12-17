import { Clock, Book, PlayCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RatingStars } from './common/RatingStars'
import type { KhoaHocChiTietHomePage, KhoaHocNguoiDung } from '@/@types/KhoaHoc'
import { formatDate, formatTime } from '@/utils/function'
import { useHoctap } from '@/hooks/useHocTap'
import { useNguoiDung } from '@/hooks/useNguoiDung'

interface ThongTinKhoaHocProps {
  thongTinKhoaHoc: KhoaHocChiTietHomePage | KhoaHocNguoiDung
}

export function KhoaHocCard({ thongTinKhoaHoc: khoaHoc }: ThongTinKhoaHocProps) {
  const [hienPopup, setHienPopup] = useState(false)
  const [viTriPopup, setViTriPopup] = useState<'trai' | 'phai'>('phai')
  const theKhoaHocRef = useRef<HTMLDivElement>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dieuHuong = useNavigate()
  const { khoaHocDaGhiDanh, dangKyKhoaHocLoading, dangKyKhoaHoc } = useHoctap()
  const { currentUser } = useNguoiDung()
  const daDangKy = khoaHocDaGhiDanh.map((kh) => kh.idKhoaHoc).includes(khoaHoc.idKhoaHoc)
  const [daDangKyNoiBo, setDaDangKyNoiBo] = useState(daDangKy)

  const noiDungHocDuocArray =
    typeof khoaHoc.noiDungHocDuoc === 'string'
      ? khoaHoc.noiDungHocDuoc
          .split('.')
          .map((x) => x.trim())
          .filter((x) => x.length > 0)
      : []

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
    if (hienPopup && theKhoaHocRef.current) {
      const rect = theKhoaHocRef.current.getBoundingClientRect()
      const khoangTrongBenPhai = window.innerWidth - rect.right
      setTimeout(() => {
        setViTriPopup(khoangTrongBenPhai > 350 ? 'phai' : 'trai')
      })
    }
  }, [hienPopup])

  const xuLyXemChiTiet = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dieuHuong(`/thong-tin-khoa-hoc/${khoaHoc.idKhoaHoc}`)
  }

  const xuLyDangKy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (daDangKyNoiBo) {
      dieuHuong(`/hoc-tap/${khoaHoc.idKhoaHoc}`)
      return
    }

    dangKyKhoaHoc(khoaHoc.idKhoaHoc)
    if (currentUser) {
      setDaDangKyNoiBo(true)
    }
  }

  return (
    <div
      ref={theKhoaHocRef}
      className='relative group h-full'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className='h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 cursor-pointer bg-white'
        onClick={xuLyXemChiTiet}
      >
        <div className='relative overflow-hidden aspect-video'>
          <img
            src={'1.55.203.158:5154' + khoaHoc.hinhDaiDien || 'https://via.placeholder.com/800x450'}
            alt={khoaHoc.tenKhoaHoc}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <PlayCircle className='w-12 h-12 text-white drop-shadow-lg' />
          </div>
          <Badge className='absolute top-2 right-2 bg-white/90 text-slate-900 backdrop-blur-sm hover:bg-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide border-none'>
            {khoaHoc.tenTrinhDo}
          </Badge>
        </div>

        <CardContent className='p-4 flex flex-col gap-2 flex-1'>
          <h3 className='text-[15px] font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-[#FF7E36] transition-colors'>
            {khoaHoc.tenKhoaHoc}
          </h3>
          <p className='text-[12px] text-slate-500 line-clamp-1'>{khoaHoc.tenGiangVien}</p>

          <div className='flex items-center gap-1 mb-1'>
            <RatingStars rating={Number(khoaHoc.danhGiaTrungBinh)} size='sm' />
            <span className='text-xs text-slate-400 ml-1'>({khoaHoc.tongSoDanhGia})</span>
          </div>

          <div className='mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500 font-medium'>
            <div className='flex items-center gap-1'>
              <Clock className='h-3.5 w-3.5' />
              <span>{formatTime(khoaHoc.thoiLuong)}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Book className='h-3.5 w-3.5' />
              <span>{khoaHoc.soLuongBaiHoc} bài</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className={`
          hidden md:block absolute -top-2.5 z-50 w-[360px] 
          transition-all duration-200 ease-out
          ${hienPopup ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
          ${viTriPopup === 'phai' ? 'left-[calc(100%+1rem)]' : 'right-[calc(100%+1rem)]'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className='shadow-2xl border-slate-200 bg-white overflow-hidden relative'>
          <div
            className={`absolute top-12 w-4 h-4 bg-white transform rotate-45 border-l border-b border-slate-200 ${
              viTriPopup === 'phai' ? '-left-2' : '-right-2'
            }`}
          ></div>

          <CardContent className='p-5 space-y-4'>
            <div>
              <h3 className='text-lg font-bold text-slate-900 leading-tight mb-2'>{khoaHoc.tenKhoaHoc}</h3>
              <div className='flex items-center gap-2 text-xs'>
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-700 hover:bg-green-100 font-medium border-none'
                >
                  Cập nhật {formatDate(khoaHoc.thoiGianCapNhat ?? '')}
                </Badge>
                <span className='text-slate-400'>|</span>
                <span className='text-slate-500'>{khoaHoc.tenTrinhDo}</span>
              </div>
            </div>

            <p className='text-xs text-slate-600 leading-relaxed'>
              {khoaHoc.moTaNgan || 'Một khóa học tuyệt vời giúp bạn nâng cao kỹ năng.'}
            </p>

            <div>
              <p className='text-xs font-bold text-slate-900 uppercase tracking-wider mb-2'>Bạn sẽ học được:</p>
              <ul className='space-y-2'>
                {noiDungHocDuocArray.slice(0, 3).map((mucTieu, i) => (
                  <li key={i} className='flex items-start gap-2.5'>
                    <CheckCircle2 className='h-4 w-4 text-green-600 shrink-0 mt-0.5' />
                    <span className='text-[13px] text-slate-700 leading-snug'>{mucTieu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className='flex gap-3'>
              <Button onClick={xuLyXemChiTiet} className='flex-1 bg-[#FF7E36] hover:bg-[#E06927] text-white font-bold'>
                Xem chi tiết
              </Button>

              <Button
                onClick={xuLyDangKy}
                disabled={dangKyKhoaHocLoading}
                className='flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold disabled:opacity-70'
              >
                {dangKyKhoaHocLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : daDangKyNoiBo ? (
                  'Học ngay'
                ) : (
                  'Đăng ký ngay'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
