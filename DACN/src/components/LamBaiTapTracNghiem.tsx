import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import type { IChiTietBaiTap, IKetQuaLamBai, INopBaiTapRequest } from '@/@types/BaiTap'
import { LayChiTietBaiTap, NopBaiTap } from '@/apis/baitap'
interface Props {
  idBaiTap: number
  quayLai: () => void
}

export function LamBaiTapTracNghiem({ idBaiTap, quayLai }: Props) {
  const [chiTietBaiTap, setChiTietBaiTap] = useState<IChiTietBaiTap | null>(null)
  const [chiSoCauHoi, setChiSoCauHoi] = useState(0)
  const [dapAnDaChon, setDapAnDaChon] = useState<Record<number, number>>({})

  const [ketQuaLamBai, setKetQuaLamBai] = useState<IKetQuaLamBai | null>(null)
  const [dangNopBai, setDangNopBai] = useState(false)

  // 1. Tải đề bài
  useEffect(() => {
    const layChiTietDeBai = async () => {
      try {
        const response = await LayChiTietBaiTap(idBaiTap)
        if (response) {
          setChiTietBaiTap(response.data ?? null)
        }
      } catch (loi) {
        console.error('Lỗi tải chi tiết đề bài:', loi)
      }
    }
    layChiTietDeBai()
  }, [idBaiTap])

  if (!chiTietBaiTap) return <div className='p-10 text-center text-slate-500'>Đang tải nội dung bài tập...</div>
  const tongSoCauHoi = chiTietBaiTap.cauHoi.length
  const cauHoiHienTai = chiTietBaiTap.cauHoi[chiSoCauHoi]
  const phanTramTienDo = ((chiSoCauHoi + 1) / tongSoCauHoi) * 100

  // Logic chọn đáp án
  const chonDapAn = (idDapAn: number) => {
    if (ketQuaLamBai) return
    setDapAnDaChon((cu) => ({
      ...cu,
      [chiSoCauHoi]: idDapAn
    }))
  }

  const nopBai = async () => {
    setDangNopBai(true)
    try {
      const duLieuGuiDi: INopBaiTapRequest = {
        IdBaiTap: idBaiTap,
        ThoiGianLamBai: new Date(),
        CauHoi: Object.keys(dapAnDaChon).map((indexStr) => {
          const index = parseInt(indexStr)
          const cauHoiData = chiTietBaiTap.cauHoi[index]
          return {
            IdBaiTapCauHoi: cauHoiData.idBaiTapCauHoi,
            IdCauHoi: cauHoiData.idCauHoi,
            IdDapAn: dapAnDaChon[index]
          }
        })
      }
      const response = await NopBaiTap(duLieuGuiDi)
      if (response) {
        setKetQuaLamBai(response.data ?? null)
      }
    } catch (loi) {
      console.error('Lỗi khi nộp bài:', loi)
    } finally {
      setDangNopBai(false)
    }
  }

  // Render Màn hình Kết quả
  if (ketQuaLamBai) {
    // 1. Tính toán lại các chỉ số
    const tiLeDung = (ketQuaLamBai.soCauDung / ketQuaLamBai.tongSoCau) * 100
    const diemHe10 = (ketQuaLamBai.soCauDung / ketQuaLamBai.tongSoCau) * 10

    const getXepLoaiInfo = (percent: number) => {
      if (percent === 100) return { label: 'Xuất sắc', color: 'text-green-600', bg: 'bg-green-100', icon: '👑' }
      if (percent >= 80) return { label: 'Giỏi', color: 'text-blue-600', bg: 'bg-blue-100', icon: '🏆' }
      if (percent >= 65) return { label: 'Khá', color: 'text-cyan-600', bg: 'bg-cyan-100', icon: '⭐' }
      if (percent >= 50) return { label: 'Đạt', color: 'text-orange-600', bg: 'bg-orange-100', icon: 'u' }
      return { label: 'Cần cố gắng', color: 'text-red-500', bg: 'bg-red-100', icon: '💪' }
    }

    const rankInfo = getXepLoaiInfo(tiLeDung)

    return (
      <div className='max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in duration-300'>
        {/* Header Icon & Title */}
        <div className='relative'>
          <div
            className={`w-24 h-24 ${rankInfo.bg} rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-sm`}
          >
            <span className='text-5xl'>{rankInfo.icon}</span>
          </div>
          <h2 className='text-3xl font-bold text-slate-800'>Kết quả bài làm</h2>
          <p className='text-slate-500 mt-2'>
            Bạn đã hoàn thành bài tập lần thứ{' '}
            <span className='font-semibold text-slate-700'>{ketQuaLamBai.lanLam}</span>
          </p>
        </div>

        {/* Điểm số to (Quy ra thang điểm 10 cho đẹp) */}
        <div className='py-2'>
          <div className={`text-6xl font-black ${rankInfo.color} tracking-tight`}>
            {Number.isInteger(diemHe10) ? diemHe10 : diemHe10.toFixed(1)}
            <span className='text-3xl text-slate-400 font-medium ml-1'>/10</span>
          </div>
          <div className={`text-lg font-medium mt-2 ${rankInfo.color} uppercase tracking-wide`}>{rankInfo.label}</div>
        </div>

        {/* Thông số chi tiết */}
        <div className='grid grid-cols-2 gap-4 max-w-sm mx-auto'>
          <div className='bg-slate-50 p-4 rounded-xl border border-slate-100'>
            <div className='text-sm font-medium text-slate-500 mb-1'>Số câu đúng</div>
            <div className='font-bold text-slate-800 text-xl'>
              {ketQuaLamBai.soCauDung}{' '}
              <span className='text-slate-400 text-base font-normal'>/ {ketQuaLamBai.tongSoCau}</span>
            </div>
          </div>

          <div className='bg-slate-50 p-4 rounded-xl border border-slate-100'>
            <div className='text-sm font-medium text-slate-500 mb-1'>Tỷ lệ đúng</div>
            <div className={`font-bold text-xl ${tiLeDung >= 50 ? 'text-green-600' : 'text-red-500'}`}>
              {Math.round(tiLeDung)}%
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-center gap-3 pt-4 border-t border-slate-100'>
          <Button variant='outline' className='border-slate-200 hover:bg-slate-50 text-slate-600' onClick={quayLai}>
            Quay về danh sách
          </Button>
          <Button
            className='bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200'
            onClick={() => {
              setKetQuaLamBai(null)
              setDapAnDaChon({})
              setChiSoCauHoi(0)
            }}
          >
            <RotateCcw className='w-4 h-4 mr-2' /> Làm lại bài
          </Button>
        </div>
      </div>
    )
  }

  // Render Màn hình Làm bài
  return (
    <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col'>
      {/* Header */}
      <div className='p-6 border-b border-slate-100'>
        <div className='flex justify-between items-center mb-4'>
          <Button variant='ghost' size='sm' onClick={quayLai} className='text-slate-500 hover:text-slate-800 pl-0'>
            <ArrowLeft className='w-4 h-4 mr-1' /> Thoát
          </Button>
          <div className='text-sm font-semibold text-slate-600'>
            Câu hỏi {chiSoCauHoi + 1}/{tongSoCauHoi}
          </div>
        </div>
        <Progress value={phanTramTienDo} className='h-2 bg-slate-100' color='bg-orange-500' />
      </div>
      <div className='flex-1 p-6 md:p-10'>
        <h3 className='text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed'>{cauHoiHienTai.noiDung}</h3>

        <div className='space-y-3'>
          {cauHoiHienTai.dapAn.map((da, index) => {
            const duocChon = dapAnDaChon[chiSoCauHoi] === da.idDapAn

            return (
              <div
                key={da.idDapAn}
                onClick={() => chonDapAn(da.idDapAn)}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 group
                  ${duocChon ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50'}
                `}
              >
                <div
                  className={`
                  w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors
                  ${duocChon ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 text-slate-500 group-hover:border-orange-300'}
                `}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`font-medium ${duocChon ? 'text-orange-900' : 'text-slate-700'}`}>{da.noiDung}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className='p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center'>
        <Button
          variant='outline'
          onClick={() => setChiSoCauHoi((cu) => Math.max(0, cu - 1))}
          disabled={chiSoCauHoi === 0}
        >
          Câu trước
        </Button>

        {chiSoCauHoi === tongSoCauHoi - 1 ? (
          <Button onClick={nopBai} disabled={dangNopBai} className='bg-green-600 hover:bg-green-700 text-white px-8'>
            {dangNopBai ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        ) : (
          <Button
            onClick={() => setChiSoCauHoi((cu) => Math.min(tongSoCauHoi - 1, cu + 1))}
            className='bg-orange-600 hover:bg-orange-700 text-white'
          >
            Câu tiếp theo <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        )}
      </div>
    </div>
  )
}
