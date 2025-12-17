import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Loader2, MessageSquare, Clock } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import type { PhanHoiResponse } from '@/@types/BaiHoc'
import { LayChiTietHoiDap, SuaPhanHoi, ThemPhanHoi, XoaPhanHoi } from '@/apis/baihoc'
import { PhanHoiItem } from './PhanHoiItem'
import { formatTimeAgo } from '@/utils/function'

interface ChiTietHoiDapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hoiDapId: number | null
  idBaiHoc: number
}

export function ChiTietHoiDapModal({ open, onOpenChange, hoiDapId, idBaiHoc }: ChiTietHoiDapModalProps) {
  const queryClient = useQueryClient()
  const [noiDungPhanHoi, setNoiDungPhanHoi] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: chiTietHoiDap, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['hoidap-detail', hoiDapId],
    queryFn: async () => {
      if (!hoiDapId) return null
      const res = await LayChiTietHoiDap(hoiDapId)
      if (res?.statusCode !== 200) {
        showErrorToast({ message: res.message })
      }
      return res.data
    },
    enabled: !!hoiDapId && open
  })

  // === MUTATION THÊM ===
  const themPhanHoiMutation = useMutation({
    mutationFn: (idHoiDap: number) => ThemPhanHoi(idHoiDap, noiDungPhanHoi),
    onSuccess: (data, idHoiDap) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: 'Đã gửi phản hồi thành công' })
        queryClient.invalidateQueries({ queryKey: ['hoidap-detail', idHoiDap] })
        queryClient.invalidateQueries({ queryKey: ['hoidap', idBaiHoc] })
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        setNoiDungPhanHoi('')
      } else {
        showErrorToast({ message: data?.message || 'Không thể gửi phản hồi' })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi gửi phản hồi' })
  })

  const suaPhanHoiMutation = useMutation({
    mutationFn: ({ id, noiDung }: { id: number; noiDung: string }) => SuaPhanHoi(id, noiDung),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: 'Cập nhật thành công' })
        queryClient.invalidateQueries({ queryKey: ['hoidap-detail', hoiDapId] })
      } else {
        showErrorToast({ message: data?.message || 'Lỗi cập nhật' })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const xoaPhanHoiMutation = useMutation({
    mutationFn: (id: number) => XoaPhanHoi(id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: 'Đã xóa phản hồi' })
        queryClient.invalidateQueries({ queryKey: ['hoidap-detail', hoiDapId] })
        queryClient.invalidateQueries({ queryKey: ['hoidap', idBaiHoc] })
      } else {
        showErrorToast({ message: data?.message || 'Lỗi khi xóa' })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  // Handlers truyền xuống component con
  const handleEditphanHoi = async (id: number, noiDung: string) => {
    await suaPhanHoiMutation.mutateAsync({ id, noiDung })
  }

  const handleDeletephanHoi = async (id: number) => {
    await xoaPhanHoiMutation.mutateAsync(id)
  }

  const handleGuiPhanHoi = () => {
    if (!chiTietHoiDap) return
    if (!noiDungPhanHoi.trim()) {
      showErrorToast({ message: 'Vui lòng nhập nội dung phản hồi' })
      return
    }
    themPhanHoiMutation.mutate(chiTietHoiDap.idHoiDap)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl max-h-[90vh] h-full flex flex-col p-0 gap-0 bg-white shadow-2xl overflow-hidden border-slate-200'>
        {/* HEADER: Trắng sạch, Border dưới nhẹ */}
        <DialogHeader className='px-6 py-4 border-b border-slate-100 bg-white shrink-0 flex flex-row items-center justify-between'>
          <DialogTitle className='text-lg font-bold text-slate-800 flex items-center gap-2'>
            <MessageSquare className='w-5 h-5 text-orange-600' />
            Thảo luận chi tiết
          </DialogTitle>
        </DialogHeader>

        {/* BODY: Scrollable */}
        {isLoadingDetail ? (
          <div className='flex justify-center items-center flex-1 bg-white'>
            <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
          </div>
        ) : chiTietHoiDap ? (
          <>
            <div className='flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-white'>
              {/* SECTION: CÂU HỎI CHÍNH */}
              <div className='bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm mb-8'>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-12 w-12 ring-2 ring-white shadow-sm'>
                    <AvatarImage src={'1.55.203.158:5154 ' + chiTietHoiDap.hinhAnh || undefined} />
                    <AvatarFallback className='bg-linear-to-br from-orange-400 to-orange-600 text-white font-bold'>
                      {chiTietHoiDap.hoTen?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex-1 space-y-2'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1'>
                      <h3 className='font-bold text-slate-900 text-base'>{chiTietHoiDap.hoTen}</h3>
                      <span className='flex items-center text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm w-fit'>
                        <Clock className='w-3 h-3 mr-1' />
                        {formatTimeAgo(chiTietHoiDap.thoiGianTao)}
                      </span>
                    </div>

                    <div>
                      <h4 className='font-bold text-orange-700 text-lg mb-2 leading-tight'>
                        {chiTietHoiDap.tieuDeCauHoi}
                      </h4>
                      <p className='text-slate-700 text-sm whitespace-pre-wrap leading-relaxed'>
                        {chiTietHoiDap.noiDung}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: DIVIDER & COUNT */}
              <div className='relative my-6 flex items-center justify-center'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-slate-200' />
                </div>
                <span className='relative bg-white px-4 text-sm font-medium text-slate-500 uppercase tracking-wider'>
                  {chiTietHoiDap.phanHoi?.length || 0} Câu trả lời
                </span>
              </div>

              {/* SECTION: DANH SÁCH PHẢN HỒI */}
              <div className='space-y-5 pb-4'>
                {chiTietHoiDap.phanHoi?.map((phanHoi: PhanHoiResponse) => (
                  <PhanHoiItem
                    key={phanHoi.idPhanHoi}
                    phanHoi={phanHoi}
                    onEdit={handleEditphanHoi}
                    onDelete={handleDeletephanHoi}
                  />
                ))}

                {(!chiTietHoiDap.phanHoi || chiTietHoiDap.phanHoi.length === 0) && (
                  <div className='flex flex-col items-center justify-center py-8 text-slate-400 italic text-sm'>
                    <MessageSquare className='w-8 h-8 mb-2 opacity-20' />
                    Chưa có phản hồi nào. Hãy chia sẻ ý kiến của bạn!
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </div>

            {/* FOOTER: INPUT AREA */}
            <div className='p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10'>
              <div className='relative flex gap-2 items-end'>
                <Avatar className='h-8 w-8 mb-1 hidden sm:block'>
                  {/* Giả lập avatar người đang đăng nhập nếu có thông tin user, hoặc để trống */}
                  <AvatarFallback className='bg-slate-100 text-slate-400 text-xs'>Me</AvatarFallback>
                </Avatar>

                <div className='flex-1 relative'>
                  <Textarea
                    placeholder='Viết bình luận của bạn...'
                    value={noiDungPhanHoi}
                    onChange={(e) => setNoiDungPhanHoi(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGuiPhanHoi()
                      }
                    }}
                    className='w-full min-h-[50px] max-h-[150px] pr-12 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-transparent rounded-xl resize-none py-3 shadow-inner'
                  />
                  <div className='absolute bottom-2 right-2'>
                    <Button
                      size='icon'
                      onClick={handleGuiPhanHoi}
                      disabled={themPhanHoiMutation.isPending || !noiDungPhanHoi.trim()}
                      className='h-8 w-8 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-all disabled:opacity-50'
                    >
                      {themPhanHoiMutation.isPending ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Send className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <p className='text-[10px] text-slate-400 mt-2 text-center sm:text-left sm:ml-10'>
                Nhấn <kbd className='font-sans px-1 rounded bg-slate-100 border border-slate-300'>Enter</kbd> để gửi.
              </p>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
