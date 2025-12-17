import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast } from '@/utils/toast'
import { ChevronLeft, Menu, Loader2, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { layKhoaHocNguoiDungChiTiet, LayThoiGianXemBaiHoc, type IKhoaHocChiTiet } from '@/apis/khoahoc'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { useHoctap } from '@/hooks/useHocTap'
import { VideoPlayer } from '@/components/VideoPlayer'
import { LessonNavigation } from '@/components/BaiHocDieuHuong'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SidebarKhoaHoc } from '@/components/SidebarKhoaHoc'
import { BaiHocTab } from '@/components/BaiHocTab'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export function TrangHoc() {
  const { idKhoaHoc, idBaiHoc, id } = useParams()
  const idKhoaHocParam = idKhoaHoc || id

  const navigate = useNavigate()
  const { danhDauHoanThanhBaiHoc } = useHoctap()

  const [khoaHoc, setKhoaHoc] = useState<IKhoaHocChiTiet | null>(null)
  const [baiHocChonId, setBaiHocChonId] = useState<number | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0)
  const [seekTime, setSeekTime] = useState<number | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const { mutate: layKhoaHocMutate, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => layKhoaHocNguoiDungChiTiet(id),
    onSuccess: (res) => {
      if (res.statusCode === 200 && res.data) {
        setKhoaHoc(res.data)

        const completedFromDb =
          res.data.chuongHoc
            ?.flatMap((c) => c.baiHoc)
            .filter((b) => b.hoanThanh)
            .map((b) => b.idBaiHoc) || []
        setCompletedLessonIds(completedFromDb)

        if (idBaiHoc) {
          setBaiHocChonId(Number(idBaiHoc))
        } else if ((res.data.chuongHoc?.length ?? 0) > 0 && (res.data.chuongHoc[0].baiHoc?.length ?? 0) > 0) {
          setBaiHocChonId((prev) => prev ?? res.data?.chuongHoc[0].baiHoc[0].idBaiHoc ?? 0)
        }
      } else {
        showErrorToast({ message: res.message || 'Không lấy được thông tin khóa học' })
        navigate('/')
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ, vui lòng thử lại' })
      navigate('/')
    }
  })

  useEffect(() => {
    const syncVideoProgress = async () => {
      if (!baiHocChonId) return

      try {
        const response = await LayThoiGianXemBaiHoc(baiHocChonId)
        const time = Number(response.data)

        if (time && time > 0) {
          setSeekTime(time)
        } else {
          // setSeekTime(0) // Uncomment nếu muốn chắc chắn về 0
        }
      } catch (error) {
        console.error('Lỗi khi đồng bộ tiến độ video:', error)
      }
    }

    syncVideoProgress()
  }, [baiHocChonId])

  useEffect(() => {
    if (idKhoaHocParam) layKhoaHocMutate(Number(idKhoaHocParam))
  }, [idKhoaHocParam, layKhoaHocMutate])

  useEffect(() => {
    if (idBaiHoc) {
      setTimeout(() => {
        setBaiHocChonId(Number(idBaiHoc))
      })
    }
  }, [idBaiHoc])

  const tatCaBaiHoc =
    khoaHoc?.chuongHoc.flatMap((chuong) => chuong.baiHoc.map((b) => ({ ...b, section: chuong.tenChuongHoc }))) || []

  const chiSoBaiHocHienTai = tatCaBaiHoc.findIndex((b) => b.idBaiHoc === baiHocChonId)
  const baiHocHienTai = chiSoBaiHocHienTai >= 0 ? tatCaBaiHoc[chiSoBaiHocHienTai] : null
  const coTheQuayLai = chiSoBaiHocHienTai > 0
  const coTheTiep = chiSoBaiHocHienTai < tatCaBaiHoc.length - 1

  const chuyenSangBaiTruoc = () => {
    if (coTheQuayLai) {
      const index = tatCaBaiHoc[chiSoBaiHocHienTai - 1].idBaiHoc
      handleSelectLesson(index)
    }
  }

  const chuyenSangBaiSau = () => {
    if (coTheTiep) {
      const index = tatCaBaiHoc[chiSoBaiHocHienTai + 1].idBaiHoc
      handleSelectLesson(index)
    }
  }

  const handleSelectLesson = (selectedLessonId: number) => {
    setBaiHocChonId(selectedLessonId)
    setIsSidebarOpen(false)
    setSeekTime(null)
  }

  const handleToggleLesson = async (idToToggle: number) => {
    const isCompleted = await danhDauHoanThanhBaiHoc(idToToggle)
    setCompletedLessonIds((prev) => {
      if (isCompleted) {
        if (!prev.includes(idToToggle)) return [...prev, idToToggle]
      } else {
        return prev.filter((id) => id !== idToToggle)
      }
      return prev
    })
  }

  return (
    <div className='flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans'>
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-3'>
            <Loader2 className='animate-spin h-10 w-10 text-orange-600' />
            <span className='text-sm font-medium text-slate-600'>Đang tải nội dung...</span>
          </div>
        </div>
      )}
      <div className='flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out'>
        <header className='h-16 border-b border-gray-200 flex items-center px-4 md:px-6 justify-between bg-white shrink-0 z-20 shadow-sm'>
          <div className='flex items-center gap-4 overflow-hidden'>
            <Button
              variant='ghost'
              size='icon'
              className='text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full'
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className='w-6 h-6' />
            </Button>
            <div className='flex flex-col justify-center overflow-hidden'>
              <h1 className='text-base font-bold text-slate-800 truncate leading-tight'>{khoaHoc?.tenKhoaHoc}</h1>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='hidden lg:block'>
              <Button
                variant='outline'
                size='sm'
                className='border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all'
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <span className='text-sm font-medium mr-2'>{isSidebarCollapsed ? 'Mở danh sách bài' : 'Thu gọn'}</span>
                {isSidebarCollapsed ? <PanelRightOpen className='h-4 w-4' /> : <PanelRightClose className='h-4 w-4' />}
              </Button>
            </div>

            <div className='lg:hidden'>
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant='outline' size='icon' className='bg-white border-slate-200'>
                    <Menu className='h-5 w-5' />
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className='p-0 w-80 bg-white'>
                  <SidebarKhoaHoc
                    khoaHoc={khoaHoc}
                    baiHocChonId={baiHocChonId}
                    danhSachBaiDaHoc={completedLessonIds}
                    thoiGianHienTai={playerCurrentTime}
                    khiChonBaiHoc={handleSelectLesson}
                    khiToggleHoanThanh={handleToggleLesson}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Nội dung cuộn (Scrollable Area) */}
        <div className='flex-1 overflow-y-auto bg-gray-50/50 scroll-smooth'>
          <div
            className={cn(
              'mx-auto w-full h-full transition-all duration-300 p-4 md:p-6 space-y-5',
              isSidebarCollapsed ? 'max-w-7xl' : 'max-w-6xl'
            )}
          >
            <VideoPlayer
              baiHoc={baiHocHienTai}
              onComplete={() => baiHocChonId && handleToggleLesson(baiHocChonId)}
              onTimeUpdate={setPlayerCurrentTime}
              seekTime={seekTime}
              onSeeked={() => setSeekTime(null)}
              hinhAnh={khoaHoc?.hinhAnh ?? ''}
              // Lưu ý: Nếu VideoPlayer của bạn có prop lanCuoiXem thì truyền thêm vào đây
              // lanCuoiXem={seekTime ?? 0}
            />

            <LessonNavigation
              onPrev={chuyenSangBaiTruoc}
              onNext={chuyenSangBaiSau}
              onComplete={() => baiHocChonId && handleToggleLesson(baiHocChonId)}
              canPrev={coTheQuayLai}
              canNext={coTheTiep}
              isCompleted={!!baiHocChonId && completedLessonIds.includes(baiHocChonId)}
              className='rounded-xl border border-slate-200 shadow-sm'
            />

            <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]'>
              <BaiHocTab
                baiHoc={baiHocHienTai}
                khoaHoc={khoaHoc}
                thoiGianHienTai={playerCurrentTime}
                tuaVideo={(time) => setSeekTime(time)} // Chức năng tua video từ Ghi chú
              />
            </div>

            <div className='h-8'></div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'hidden lg:block h-full z-10 shadow-xl bg-white border-l border-gray-200 transition-all duration-300 ease-in-out transform',
          isSidebarCollapsed ? 'w-0 translate-x-full opacity-0 border-none' : 'w-96 translate-x-0 opacity-100'
        )}
        style={{ overflow: 'hidden' }}
      >
        <div className='w-96 h-full'>
          <SidebarKhoaHoc
            khoaHoc={khoaHoc}
            baiHocChonId={baiHocChonId}
            danhSachBaiDaHoc={completedLessonIds}
            thoiGianHienTai={playerCurrentTime}
            khiChonBaiHoc={handleSelectLesson}
            khiToggleHoanThanh={handleToggleLesson}
          />
        </div>
      </div>
    </div>
  )
}
