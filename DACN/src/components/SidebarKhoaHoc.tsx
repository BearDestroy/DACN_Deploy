import { useEffect, useState } from 'react' // Thêm import useState
import { LuuTienDo, type IKhoaHocChiTiet } from '@/apis/khoahoc'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Clock, FileText, PlayCircle, Check, Loader2 } from 'lucide-react' // Thêm icon Loader2
import { cn } from '@/lib/utils'

interface PropsSidebarKhoaHoc {
  khoaHoc: IKhoaHocChiTiet | null
  baiHocChonId: number | null
  danhSachBaiDaHoc: number[]
  thoiGianHienTai: number
  khiChonBaiHoc: (id: number) => void
  khiToggleHoanThanh: (id: number) => Promise<void>
}

export function SidebarKhoaHoc({
  khoaHoc,
  baiHocChonId,
  danhSachBaiDaHoc,
  thoiGianHienTai,
  khiChonBaiHoc,
  khiToggleHoanThanh
}: PropsSidebarKhoaHoc) {
  const [baiHocDangToggleId, setBaiHocDangToggleId] = useState<number | null>(null)

  const tongSoBaiHoc = khoaHoc?.chuongHoc.reduce((tong, chuong) => tong + chuong.baiHoc.length, 0) || 0
  const soBaiDaHoc = danhSachBaiDaHoc.length
  const phanTramTienDo = tongSoBaiHoc > 0 ? (soBaiDaHoc / tongSoBaiHoc) * 100 : 0

  const xuLyChonBaiHoc = async (idBaiHoc: number) => {
    if (baiHocChonId && thoiGianHienTai > 0) {
      const thoiGianLamTron = Math.round(thoiGianHienTai)
      try {
        await LuuTienDo(baiHocChonId, thoiGianLamTron)
      } catch (e) {
        console.error(e)
      }
    }
    khiChonBaiHoc(idBaiHoc)
  }

  const xuLyToggleHoanThanh = async (idBaiHoc: number) => {
    if (baiHocDangToggleId !== null) return

    setBaiHocDangToggleId(idBaiHoc)
    try {
      await khiToggleHoanThanh(idBaiHoc)
    } catch (error) {
      console.error('Lỗi khi đánh dấu hoàn thành:', error)
    } finally {
      setBaiHocDangToggleId(null)
    }
  }

  useEffect(() => {
    const xuLyTruocKhiDongTrang = () => {
      if (baiHocChonId && thoiGianHienTai > 0) {
        navigator.sendBeacon(`/tiendohoctaps/${baiHocChonId}/luu-tien-do?thoiGian=${thoiGianHienTai}`)
      }
    }
    window.addEventListener('beforeunload', xuLyTruocKhiDongTrang)
    return () => window.removeEventListener('beforeunload', xuLyTruocKhiDongTrang)
  }, [baiHocChonId, thoiGianHienTai])

  return (
    <div className='flex flex-col h-full bg-white border-l border-slate-200'>
      <div className='p-5 border-b border-slate-100 bg-white'>
        <h2 className='font-bold text-slate-800 text-base mb-3 line-clamp-1'>
          {khoaHoc?.tenKhoaHoc || 'Nội dung khóa học'}
        </h2>
        <div className='space-y-2'>
          <div className='flex justify-between text-xs font-semibold text-slate-500'>
            <span className='text-orange-600'>{phanTramTienDo.toFixed(0)}% hoàn thành</span>
            <span>
              {soBaiDaHoc}/{tongSoBaiHoc} bài học
            </span>
          </div>
          <Progress value={phanTramTienDo} className='h-1.5 bg-slate-100' color='bg-orange-600' />
        </div>
      </div>

      <ScrollArea className='flex-1 bg-slate-50/50'>
        <Accordion type='multiple' className='w-full' defaultValue={khoaHoc?.chuongHoc.map((_, i) => `chuong-${i}`)}>
          {khoaHoc?.chuongHoc.map((chuong, chiSoChuong) => (
            <AccordionItem key={chiSoChuong} value={`chuong-${chiSoChuong}`} className='border-b border-slate-100'>
              <AccordionTrigger className='px-5 py-4 bg-white hover:bg-slate-50 font-semibold text-slate-800 text-sm no-underline hover:no-underline transition-colors'>
                <div className='text-left'>
                  <div className='text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1'>
                    Chương {chiSoChuong + 1}
                  </div>
                  {chuong.tenChuongHoc}
                </div>
              </AccordionTrigger>

              <AccordionContent className='pb-0'>
                <div className='flex flex-col'>
                  {chuong.baiHoc.map((baiHoc, chiSoBai) => {
                    const dangChon = baiHoc.idBaiHoc === baiHocChonId
                    const daHoanThanh = danhSachBaiDaHoc.includes(baiHoc.idBaiHoc)
                    const dangXuLy = baiHoc.idBaiHoc === baiHocDangToggleId

                    return (
                      <div
                        key={baiHoc.idBaiHoc}
                        className={cn(
                          'relative w-full flex items-start gap-3 px-5 py-3 transition-all duration-200 cursor-pointer group border-l-[3px]',
                          dangChon
                            ? 'bg-orange-50/60 border-l-orange-600'
                            : 'bg-slate-50 border-l-transparent hover:bg-slate-100',
                          dangXuLy && 'pointer-events-none'
                        )}
                        onClick={() => xuLyChonBaiHoc(baiHoc.idBaiHoc)}
                      >
                        <div
                          className='mt-0.5 shrink-0 z-10'
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!dangXuLy) {
                              xuLyToggleHoanThanh(baiHoc.idBaiHoc)
                            }
                          }}
                        >
                          <div
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded transition-all duration-300 shadow-sm',
                              daHoanThanh
                                ? 'bg-green-500 border border-green-500 text-white scale-110'
                                : 'bg-white border border-slate-300 hover:border-orange-400 text-transparent',
                              dangXuLy && 'opacity-60 cursor-not-allowed'
                            )}
                          >
                            {dangXuLy ? (
                              <Loader2 className='w-4 h-4 animate-spin text-orange-600/80' />
                            ) : (
                              <Check className='w-3.5 h-3.5 stroke-[3]' />
                            )}
                          </div>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p
                            className={cn(
                              'text-sm font-medium mb-1.5 transition-colors leading-snug',
                              dangChon ? 'text-orange-700' : 'text-slate-700 group-hover:text-slate-900'
                            )}
                          >
                            {chiSoBai + 1}. {baiHoc.tenBaiHoc}
                          </p>

                          <div className='flex items-center gap-3 text-xs text-slate-500'>
                            <span className='flex items-center gap-1'>
                              {/* Đổi icon tùy theo loại bài học hoặc trạng thái */}
                              {dangChon ? (
                                <PlayCircle className='w-3 h-3 text-orange-600' />
                              ) : (
                                <Clock className='w-3 h-3' />
                              )}
                              {baiHoc.thoiLuongBaiHoc}p
                            </span>
                            <span className='flex items-center gap-1 opacity-70'>
                              <FileText className='w-3 h-3' /> Video
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}
