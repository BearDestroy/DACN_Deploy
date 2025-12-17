import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, PlayCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { LamBaiTapTracNghiem } from './LamBaiTapTracNghiem'
import type { IBaiTapTomTat } from '@/@types/BaiTap'
import { LayDanhSachBaiTap } from '@/apis/baitap'
import { formatTime } from '@vidstack/react'

export function BaiTapTab({ idBaiHoc }: { idBaiHoc: number }) {
  const [idBaiTapDangChon, setIdBaiTapDangChon] = useState<number | null>(null)
  const [danhSachBaiTap, setDanhSachBaiTap] = useState<IBaiTapTomTat[]>([])
  const [dangTai, setDangTai] = useState(true)

  const layDanhSachBaiTap = async () => {
    try {
      setDangTai(true)
      const response = await LayDanhSachBaiTap(idBaiHoc)
      // Kiểm tra kỹ data trước khi set
      if (response && response.data) {
        setDanhSachBaiTap(response.data)
      } else {
        setDanhSachBaiTap([])
      }
    } catch (loi) {
      console.error('Lỗi tải danh sách bài tập:', loi)
    } finally {
      setDangTai(false)
    }
  }

  useEffect(() => {
    layDanhSachBaiTap()
  }, [idBaiHoc])

  if (idBaiTapDangChon) {
    return (
      <LamBaiTapTracNghiem
        idBaiTap={idBaiTapDangChon}
        quayLai={() => {
          setIdBaiTapDangChon(null)
          layDanhSachBaiTap() // Load lại để cập nhật trạng thái/điểm nếu có
        }}
      />
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-4 space-y-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-slate-800'>Bài tập thực hành</h2>
        <div className='bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium text-sm'>
          Đã hoàn thành: {danhSachBaiTap.filter((bt) => bt.trangThai === 'hoan_thanh').length}/{danhSachBaiTap.length}
        </div>
      </div>

      {dangTai ? (
        <div className='text-center py-10 text-slate-500'>Đang tải dữ liệu bài tập...</div>
      ) : (
        <div className='grid gap-4'>
          {danhSachBaiTap.length === 0 && <div className='text-center text-slate-500'>Chưa có bài tập nào.</div>}

          {danhSachBaiTap.map((baiTap) => (
            <div
              key={baiTap.idBaiTap}
              className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4'
            >
              <div className='flex items-start gap-4'>
                <div
                  className={`p-3 rounded-lg ${baiTap.trangThai === 'hoan_thanh' ? 'bg-green-100' : 'bg-orange-100'}`}
                >
                  {baiTap.trangThai === 'hoan_thanh' ? (
                    <CheckCircle2 className='w-6 h-6 text-green-600' />
                  ) : (
                    <PlayCircle className='w-6 h-6 text-orange-600' />
                  )}
                </div>
                <div>
                  <h3 className='font-bold text-slate-800 text-lg'>{baiTap.tenBaiTap}</h3>
                  <div className='flex items-center gap-4 mt-2 text-sm text-slate-500'>
                    <span className='flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' /> {baiTap.soLuongCauHoi} câu hỏi
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' /> {formatTime(baiTap.thoiGianLam)}
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-slate-400 font-medium uppercase'>{baiTap.tenLoaiBaiTap}</div>
                </div>
              </div>

              <div className='flex items-center gap-4 sm:border-l sm:pl-6 border-slate-100'>
                {baiTap.trangThai === 'hoan_thanh' && baiTap.diemSo !== undefined && (
                  <div className='text-center mr-4 min-w-[60px]'>
                    <div className='text-xs text-slate-400 uppercase font-semibold mb-0.5'>Kết quả</div>
                    <div className='text-xl font-bold text-green-600 leading-none'>
                      {baiTap.diemSo}/{baiTap.soLuongCauHoi}
                    </div>
                    <div className='text-[10px] text-slate-500 font-medium mt-1'>câu đúng</div>
                  </div>
                )}
                <Button
                  onClick={() => setIdBaiTapDangChon(baiTap.idBaiTap)}
                  className={
                    baiTap.trangThai === 'hoan_thanh'
                      ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }
                >
                  {baiTap.trangThai === 'hoan_thanh' ? 'Làm lại' : 'Làm ngay'}
                  <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
