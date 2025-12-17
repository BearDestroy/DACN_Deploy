import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Star, MoreHorizontal, Search } from 'lucide-react'
import { layDanhGiaKhoaHoc } from '@/apis/khoahoc'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Import ReportModal vừa tạo (đảm bảo đúng đường dẫn file)
import { ReportModal } from './ReportModal'
import { showInfoToast } from '@/utils/toast'
import { useNguoiDung } from '@/hooks/useNguoiDung'

interface Props {
  id: number
  open: boolean
  onClose: () => void
}

export const ReviewModal = ({ id, open, onClose }: Props) => {
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [reportId, setReportId] = useState<number | null>(null)
  const { currentUser } = useNguoiDung()
  const menuRef = useRef<HTMLDivElement | null>(null)

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['courseReviews', id, starFilter, searchKeyword],
    queryFn: () => layDanhGiaKhoaHoc(id, starFilter, searchKeyword).then((res) => res.data),
    enabled: !!id
  })

  const reviews = reviewsData?.danhSachBinhLuan ?? []

  // Xử lý click outside để đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hàm xử lý khi click "Báo cáo lạm dụng"
  const handleReportClick = (idDanhGia: number) => {
    setReportId(idDanhGia) // Lưu ID cần báo cáo
    setMenuOpen(null) // Đóng menu dropdown ngay lập tức
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className='
            w-full max-w-5xl 
            p-6 
            fixed 
            top-20
            translate-y-0
            max-h-[calc(100vh-100px)]
          '
        >
          <DialogHeader>
            <DialogTitle className='text-[#FF5722]'>Tất cả đánh giá</DialogTitle>
          </DialogHeader>

          <div className='flex gap-6 mt-4'>
            {/* LEFT SIDE */}
            <div className='w-1/3 flex flex-col gap-4 border-r border-[#FF5722]/20 pr-4'>
              <label className='text-[#FF5722] font-medium'>Tìm kiếm đánh giá</label>
              {/* Search Input + icon */}
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF5722]/40' />
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className='pl-10 focus:border-[#FF5722] focus:ring-[#FF5722]'
                  placeholder='Tìm kiếm...'
                />
              </div>
              {/* STAR FILTER */}
              <div className='flex flex-col gap-2'>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count =
                    reviewsData?.[
                      star === 5
                        ? 'namSao'
                        : star === 4
                          ? 'bonSao'
                          : star === 3
                            ? 'baSao'
                            : star === 2
                              ? 'haiSao'
                              : 'motSao'
                    ] ?? 0

                  const percent = reviewsData?.soLuongDanhGia ? (count / reviewsData.soLuongDanhGia) * 100 : 0
                  const isActive = starFilter === star

                  return (
                    <div
                      key={star}
                      className={`
                        flex items-center gap-2 cursor-pointer p-2 rounded transition
                        ${isActive ? 'bg-[#FF5722]/10 border border-[#FF5722]' : 'hover:bg-[#FF5722]/5'}
                      `}
                      onClick={() => setStarFilter((prev) => (prev === star ? null : star))}
                    >
                      <span className='w-12 flex items-center gap-1'>
                        {star} <Star className='h-4 w-4 text-[#FF5722]' />
                      </span>
                      <div className='flex-1 bg-[#FF5722]/10 h-3 rounded'>
                        <div className='bg-[#FF5722] h-3 rounded' style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className='w-10 text-right text-sm'>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <ScrollArea className='flex-1 max-h-[60vh]'>
              {isLoading ? (
                <p className='text-[#FF5722]/80 py-4'>Đang tải...</p>
              ) : reviews.length > 0 ? (
                reviews.map((r) => (
                  <div key={r.idDanhGia} className='border border-[#FF5722]/20 p-3 rounded shadow-sm relative mb-3'>
                    <div className='flex items-center justify-between mb-1'>
                      <div className='flex items-center gap-2'>
                        <Avatar className='w-8 h-8'>
                          <AvatarImage
                            src={'1.55.203.158:5154' + r.anhDaiDien}
                            alt={r.hoTen}
                            className='object-cover'
                          />
                          <AvatarFallback className='bg-[#FFECE4] text-[#FF5722] text-sm font-semibold'>
                            {r.hoTen?.trim().charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <span className='font-medium text-[#FF5722]'>{r.hoTen}</span>
                      </div>

                      {/* --- MENU DROPDOWN --- */}
                      <div ref={menuOpen === r.idDanhGia ? menuRef : null} className='relative'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={(e) => {
                            e.stopPropagation() // Ngăn chặn sự kiện click lan truyền
                            setMenuOpen(menuOpen === r.idDanhGia ? null : r.idDanhGia)
                          }}
                          className='text-[#FF5722] hover:bg-[#FF5722]/10'
                        >
                          <MoreHorizontal className='h-5 w-5' />
                        </Button>
                        {menuOpen === r.idDanhGia && (
                          <div className='absolute right-0 mt-2 w-40 bg-white border border-[#FF5722]/20 rounded shadow-lg z-10'>
                            <Button
                              variant='ghost'
                              className='
        w-full justify-start text-left
        text-red-500
        hover:bg-[#FF5722]/10
        hover:text-red-600
      '
                              onClick={() => {
                                if (!currentUser) {
                                  showInfoToast({ message: 'Vui lòng đăng nhập để báo cáo' })
                                  setMenuOpen(null)
                                  return
                                }

                                handleReportClick(r.idDanhGia)
                                setMenuOpen(null)
                              }}
                            >
                              Báo cáo lạm dụng
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stars */}
                    <div className='flex items-center gap-2 mb-2'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < r.soDiemDanhGia ? 'fill-[#FF5722] text-[#FF5722]' : 'text-[#FF5722]/30'
                          }`}
                        />
                      ))}
                      <span className='text-[#FF5722]/70 text-sm ml-2'>
                        {new Date(r.ngayDanhGia).toLocaleDateString()}
                      </span>
                    </div>

                    <p className='text-[#212121]'>{r.loiDanhGia}</p>
                  </div>
                ))
              ) : (
                <p className='text-[#FF5722]/70 text-center py-4'>Không tìm thấy đánh giá nào</p>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <ReportModal isOpen={!!reportId} onClose={() => setReportId(null)} targetId={reportId} type='REVIEW' />
    </>
  )
}
