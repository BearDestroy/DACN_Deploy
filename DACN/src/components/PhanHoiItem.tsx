import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { MoreVertical, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'
import type { PhanHoiResponse } from '@/@types/BaiHoc'
import { formatTimeAgo } from '@/utils/function'

interface PhanHoiItemProps {
  phanHoi: PhanHoiResponse
  onEdit: (id: number, content: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function PhanHoiItem({ phanHoi, onEdit, onDelete }: PhanHoiItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  // Khởi tạo editContent với nội dung hiện tại
  const [editContent, setEditContent] = useState(phanHoi.noiDung)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    // Không lưu nếu nội dung trống hoặc không thay đổi
    if (!editContent.trim() || editContent === phanHoi.noiDung) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    await onEdit(phanHoi.idPhanHoi, editContent.trim()) // trim() nội dung trước khi lưu
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(phanHoi.idPhanHoi)
    // Sau khi xóa thành công, dialog sẽ tự đóng do `phanHoi` không còn trong danh sách cha
    // Nếu có lỗi, isDeleting sẽ chuyển về false và dialog vẫn mở để người dùng thử lại
  }

  // Logic hiển thị nút chỉnh sửa/xóa
  const isMine = phanHoi.phanHoiCuaMinh

  return (
    <>
      {/* Container chính của phản hồi */}
      {/* Thay đổi: Nền trắng/xám nhẹ, border xám, chữ đen/xám đậm để tăng tương phản */}
      <div className='flex gap-4 group relative items-start bg-white/70 border border-slate-200 rounded-lg p-4 transition-all hover:bg-white'>
        {/* Avatar */}
        <Avatar className='h-9 w-9 mt-0.5 ring-1 ring-orange-500 shrink-0 shadow-sm'>
          <AvatarImage src={'1.55.203.158:5154' + phanHoi.hinhAnh || undefined} />
          {/* Avatar Fallback vẫn giữ màu cam làm điểm nhấn */}
          <AvatarFallback className='bg-orange-600 text-white text-sm font-medium'>
            {phanHoi.nguoiPhanHoi?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Nội dung phản hồi */}
        <div className='flex-1 min-w-0'>
          {/* Header (Tên & Thời gian) */}
          <div className='flex items-center justify-between mb-1'>
            <div className='flex items-baseline gap-2'>
              {/* Tên người dùng: Màu chữ rõ ràng hơn, nhấn mạnh bằng font semi-bold */}
              <span className='font-semibold text-base text-slate-800'>{phanHoi.nguoiPhanHoi}</span>
              {/* Thời gian: Màu xám nhẹ hơn */}
              <span className='text-xs text-slate-500 font-normal'>{formatTimeAgo(phanHoi.thoiGianPhanHoi)}</span>
            </div>

            {/* Dropdown Menu (Sửa/Xóa) */}
            {isMine && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    // Thay đổi: Nút menu màu xám, chỉ hiện khi hover, mượt hơn
                    className='h-7 w-7 -mr-2 text-slate-400 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    aria-label='Tùy chọn phản hồi'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                {/* Menu Dropdown: Nền trắng, border xám */}
                <DropdownMenuContent align='end' className='bg-white border border-slate-200 text-slate-700 shadow-lg'>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditing(true)
                      setEditContent(phanHoi.noiDung) // Đảm bảo nội dung luôn đúng khi bắt đầu sửa
                    }}
                    className='cursor-pointer hover:bg-slate-50 text-slate-700 transition-colors'
                  >
                    <Pencil className='w-3.5 h-3.5 mr-2 text-orange-600' /> Sửa phản hồi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className='cursor-pointer text-red-500 hover:bg-red-50/70 hover:text-red-600 transition-colors'
                  >
                    <Trash2 className='w-3.5 h-3.5 mr-2' /> Xóa phản hồi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Body (Nội dung) */}
          {isEditing ? (
            // Form chỉnh sửa
            <div className='space-y-2 animate-in fade-in zoom-in-95 duration-200'>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                // Thay đổi: Nền trắng, border xám, focus viền cam
                className='min-h-[80px] bg-white border border-slate-300 text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-0 transition-colors'
              />
              <div className='flex gap-2 justify-end'>
                {/* Nút Hủy */}
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(phanHoi.noiDung) // Khôi phục nội dung ban đầu
                  }}
                  className='h-7 text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors'
                  disabled={isSaving}
                >
                  <X className='w-3.5 h-3.5 mr-1' /> Hủy
                </Button>
                {/* Nút Lưu */}
                <Button
                  size='sm'
                  onClick={handleSave}
                  disabled={isSaving || !editContent.trim() || editContent.trim() === phanHoi.noiDung}
                  // Màu cam đậm, nổi bật
                  className='h-7 bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-sm'
                >
                  {isSaving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Check className='w-3.5 h-3.5 mr-1' />}
                  Lưu
                </Button>
              </div>
            </div>
          ) : (
            // Hiển thị nội dung
            // Thay đổi: Màu chữ slate-700 (xám đậm) dễ đọc trên nền sáng
            <div className='text-slate-700 text-sm whitespace-pre-wrap leading-relaxed break-words'>
              {phanHoi.noiDung}
            </div>
          )}
        </div>
      </div>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='bg-white border border-slate-200 text-slate-800 shadow-xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-slate-900'>Xóa phản hồi?</AlertDialogTitle>
            <AlertDialogDescription className='text-slate-500'>
              Hành động này không thể hoàn tác. Phản hồi của bạn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className='bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              disabled={isDeleting}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className='bg-red-600 hover:bg-red-700 text-white transition-colors'
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
              Xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
