import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Edit2, Loader2, Plus, StickyNote, X } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import type { IGhiChuResponse } from '@/@types/BaiHoc'
import { LayDanhSachGhiChu, SuaGhiChu, ThemGhiChu, XoaGhiChu } from '@/apis/baihoc'
import DeleteModal from './Modal'
import { formatTime } from '@vidstack/react'

interface GhiChuProps {
  idBaiHoc: number
  thoiGianHienTai: number
  tuaVideo: (time: number) => void
}

export function GhiChuTab({ idBaiHoc, thoiGianHienTai, tuaVideo }: GhiChuProps) {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [editingNote, setEditingNote] = useState<IGhiChuResponse | null>(null)
  const [noiDung, setNoiDung] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<IGhiChuResponse | null>(null)
  const thoiGianHienThi = editingNote ? editingNote.thoiDiemGhiChu : thoiGianHienTai

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dsghichu', idBaiHoc],
    queryFn: async () => {
      const res = await LayDanhSachGhiChu(idBaiHoc)
      if (res?.statusCode !== 200) throw new Error(res?.message || 'Không thể lấy danh sách ghi chú')
      return res.data || []
    },
    enabled: !!idBaiHoc,
    staleTime: 5 * 60 * 1000
  })

  const dsghichu = data || []

  const addMutation = useMutation({
    mutationFn: (noiDung: string) => ThemGhiChu(idBaiHoc, Math.round(thoiGianHienTai), noiDung),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        showSuccessToast({ message: 'Thêm ghi chú thành công' })
        queryClient.invalidateQueries({ queryKey: ['dsghichu', idBaiHoc] })
        setOpenModal(false)
        setNoiDung('')
      } else showErrorToast({ message: data?.message || 'Thêm ghi chú thất bại' })
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi thêm ghi chú' })
  })

  const editMutation = useMutation({
    mutationFn: (noiDung: string) => SuaGhiChu(editingNote!.idGhiChu, noiDung),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        showSuccessToast({ message: 'Cập nhật ghi chú thành công' })
        queryClient.invalidateQueries({ queryKey: ['dsghichu', idBaiHoc] })
        setOpenModal(false)
        setEditingNote(null)
        setNoiDung('')
      } else showErrorToast({ message: data?.message || 'Cập nhật ghi chú thất bại' })
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi cập nhật ghi chú' })
  })

  const deleteMutation = useMutation({
    mutationFn: (idGhiChu: number) => XoaGhiChu(idGhiChu),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        showSuccessToast({ message: 'Xóa ghi chú thành công' })
        queryClient.invalidateQueries({ queryKey: ['dsghichu', idBaiHoc] })
      } else showErrorToast({ message: data?.message || 'Xóa ghi chú thất bại' })
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi xóa ghi chú' })
  })

  const handleSubmit = () => {
    if (!noiDung.trim()) {
      showErrorToast({ message: 'Vui lòng nhập nội dung ghi chú' })
      return
    }

    if (editingNote) {
      editMutation.mutate(noiDung)
    } else {
      addMutation.mutate(noiDung)
    }
  }

  const handleEdit = (note: IGhiChuResponse) => {
    setEditingNote(note)
    setNoiDung(note.noiDungGhiChu)
    setOpenModal(true)
  }

  const handleDeleteClick = (note: IGhiChuResponse) => {
    setNoteToDelete(note)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (noteToDelete) deleteMutation.mutate(noteToDelete.idGhiChu)
    setNoteToDelete(null)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditingNote(null)
    setNoiDung('')
  }

  const handleOpenAddModal = () => {
    setEditingNote(null)
    setNoiDung('')
    setOpenModal(true)
  }
  const isPending = addMutation.isPending || editMutation.isPending
  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-[#FF5722]'>Ghi chú của tôi</h1>
        <Button
          onClick={handleOpenAddModal}
          disabled={!idBaiHoc}
          className='bg-[#FF5722] hover:bg-[#E64A19] text-white'
        >
          <Plus className='w-4 h-4 mr-1' /> Thêm ghi chú
        </Button>
      </div>

      <div className='space-y-4'>
        {isLoading ? (
          <div className='text-center py-8'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF5722] border-r-transparent'></div>
            <p className='text-[#FF5722]/80 mt-2'>Đang tải ghi chú...</p>
          </div>
        ) : isError ? (
          <div className='text-center py-8'>
            <p className='text-red-500'>❌ {error?.message || 'Lỗi khi tải ghi chú'}</p>
          </div>
        ) : dsghichu.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-[#FF5722]/80'>Chưa có ghi chú nào</p>
            <p className='text-[#FF5722]/60 text-sm mt-1'>Nhấn "Thêm ghi chú" để tạo ghi chú mới</p>
          </div>
        ) : (
          dsghichu.map((note: IGhiChuResponse) => (
            <div
              key={note.idGhiChu}
              className='bg-[#FF5722]/5 p-4 rounded-lg border border-[#FF5722]/20 hover:border-[#FF5722]/40 transition-colors cursor-pointer'
              onClick={() => {
                tuaVideo(note.thoiDiemGhiChu)
              }}
            >
              <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                  <p className='text-[#FF5722] whitespace-pre-wrap'>{note.noiDungGhiChu}</p>
                  <p className='text-sm text-[#FF5722]/70 mt-1'>{formatTime(note.thoiDiemGhiChu)}</p>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-[#FF5722] border-[#FF5722] hover:bg-[#FF5722] hover:text-white'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(note)
                    }}
                    disabled={editMutation.isPending}
                  >
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    color='white'
                    className='text-[#FF5722]  border-1 hover:bg-[#FF5722] hover:text-white bg-white border-[#FF5722]'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(note)
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <X className='w-4 h-4'></X>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={openModal} onOpenChange={handleCloseModal}>
        <DialogContent className='sm:max-w-lg bg-white border-slate-200 shadow-2xl p-0 gap-0 overflow-hidden'>
          <DialogHeader className='px-6 py-4 border-b border-slate-100 bg-slate-50'>
            <DialogTitle className='text-lg font-bold text-slate-800 flex items-center gap-2'>
              <StickyNote className='w-5 h-5 text-orange-600' />
              {editingNote ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới'}
            </DialogTitle>
          </DialogHeader>

          <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5'>
              <span className='text-sm font-medium text-slate-600'>Thời điểm ghi chú:</span>
              <div className='flex items-center gap-1.5 text-orange-700 bg-white border border-orange-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm'>
                <Clock className='w-3.5 h-3.5' />
                <span>{typeof formatTime === 'function' ? formatTime(thoiGianHienThi) : thoiGianHienThi}</span>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <label className='text-sm font-medium text-slate-700 ml-1'>Nội dung ghi chú</label>
              <Textarea
                placeholder='Nhập nội dung ghi chú của bạn tại đây...'
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                className='min-h-[150px] bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-transparent rounded-xl resize-none p-4 text-base'
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className='px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-row gap-2 justify-end -mt-2'>
            <Button
              variant='ghost'
              onClick={handleCloseModal}
              disabled={isPending}
              className='text-slate-500 hover:text-slate-700 hover:bg-slate-200'
            >
              Hủy bỏ
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isPending || !noiDung.trim()}
              className='bg-orange-600 hover:bg-orange-700 text-white min-w-[100px] shadow-sm transition-all active:scale-95'
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu...
                </>
              ) : editingNote ? (
                'Cập nhật'
              ) : (
                'Lưu ghi chú'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title='Xác nhận xóa ghi chú'
        description='Bạn có chắc chắn muốn xóa ghi chú này?'
      />
    </div>
  )
}
