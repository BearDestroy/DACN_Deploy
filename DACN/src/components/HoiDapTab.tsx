import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Plus, MessageCircle, Loader2, HelpCircle } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import { LayDanhSachHoiDap, ThemHoiDap } from '@/apis/baihoc'
import type { HoiDapResponse } from '@/@types/BaiHoc'
import { HoiDapItem } from './HoiDapItem'
import { ThemHoiDapModal } from './ThemHoiDapModal'
import { ChiTietHoiDapModal } from './ChiTietHoiDapModal'

interface HoiDapTabProps {
  idBaiHoc: number
}

export function HoiDapTab({ idBaiHoc }: HoiDapTabProps) {
  const queryClient = useQueryClient()
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedhoiDapId, setSelectedhoiDapId] = useState<number | null>(null)

  // --- DATA FETCHING ---
  const { data: danhSachHoiDap = [], isLoading } = useQuery({
    queryKey: ['hoidap', idBaiHoc],
    queryFn: async () => {
      const res = await LayDanhSachHoiDap(idBaiHoc)
      if (res?.statusCode !== 200) {
        // Chỉ log lỗi hoặc toast nhẹ, tránh làm phiền nếu lỗi nhỏ
        console.error(res.message)
      }
      return res.data || []
    },
    enabled: !!idBaiHoc,
    staleTime: 3 * 60 * 1000 // Cache 3 phút
  })

  // --- MUTATION ---
  const themHoiDapMutation = useMutation({
    mutationFn: ({ tieuDe, noiDung }: { tieuDe: string; noiDung: string }) => ThemHoiDap(idBaiHoc, tieuDe, noiDung),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        showSuccessToast({ message: 'Đã gửi câu hỏi thành công!' })
        queryClient.invalidateQueries({ queryKey: ['hoidap', idBaiHoc] })
        setOpenAddModal(false)
      } else {
        showErrorToast({ message: data?.message || 'Không thể đăng câu hỏi' })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi kết nối, vui lòng thử lại sau.' })
    }
  })

  // --- HANDLERS ---
  const handleCreatehoiDap = (tieuDe: string, noiDung: string) => {
    themHoiDapMutation.mutate({ tieuDe, noiDung })
  }

  const handleViewDetail = (id: number) => {
    setSelectedhoiDapId(id)
    setOpenDetailModal(true)
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className='flex flex-col justify-center items-center py-20 gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
        <span className='text-slate-500 font-medium'>Đang tải danh sách thảo luận...</span>
      </div>
    )
  }

  // --- RENDER ---
  return (
    <div className='max-w-5xl mx-auto p-4 md:p-6'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 flex items-center gap-2'>
            <HelpCircle className='w-6 h-6 text-orange-600' />
            Hỏi đáp & Thảo luận
          </h2>
          <p className='text-slate-500 text-sm mt-1'>
            {danhSachHoiDap.length > 0
              ? `Hiện có ${danhSachHoiDap.length} câu hỏi trong bài học này`
              : 'Chưa có câu hỏi nào. Hãy là người đầu tiên!'}
          </p>
        </div>

        <Button
          onClick={() => setOpenAddModal(true)}
          className='bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]'
        >
          <Plus className='w-4 h-4 mr-2' />
          Đặt câu hỏi mới
        </Button>
      </div>

      {/* Content Section */}
      <div className='min-h-[300px]'>
        {danhSachHoiDap.length === 0 ? (
          // Empty State UI
          <div className='flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50'>
            <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
              <MessageCircle className='w-10 h-10 text-orange-400' />
            </div>
            <h3 className='text-lg font-semibold text-slate-800 mb-2'>Chưa có thảo luận nào</h3>
            <p className='text-slate-500 text-center max-w-sm mb-6'>
              Bạn có thắc mắc về bài học? Đừng ngần ngại đặt câu hỏi để được giảng viên và các bạn học hỗ trợ.
            </p>
            <Button
              variant='outline'
              onClick={() => setOpenAddModal(true)}
              className='border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800'
            >
              Tạo câu hỏi ngay
            </Button>
          </div>
        ) : (
          // List Data UI
          <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            {danhSachHoiDap.map((hoiDap: HoiDapResponse) => (
              <HoiDapItem key={hoiDap.idHoiDap} hoiDap={hoiDap} onViewDetail={handleViewDetail} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ThemHoiDapModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        onSubmit={handleCreatehoiDap}
        isPending={themHoiDapMutation.isPending}
      />

      <ChiTietHoiDapModal
        open={openDetailModal}
        onOpenChange={setOpenDetailModal}
        hoiDapId={selectedhoiDapId}
        idBaiHoc={idBaiHoc}
      />
    </div>
  )
}
