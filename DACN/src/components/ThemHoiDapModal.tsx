import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { showErrorToast } from '@/utils/toast'

interface ThemHoiDapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tieuDe: string, noiDung: string) => void
  isPending: boolean
}

export function ThemHoiDapModal({ open, onOpenChange, onSubmit, isPending }: ThemHoiDapModalProps) {
  const [tieuDe, setTieuDe] = useState('')
  const [noiDung, setNoiDung] = useState('')

  const handleSubmit = () => {
    if (!tieuDe.trim() || !noiDung.trim()) {
      showErrorToast({ message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung' })
      return
    }
    onSubmit(tieuDe, noiDung)
    if (!isPending) {
      //
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTieuDe('')
      setNoiDung('')
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-[#FF5722]'>Đặt câu hỏi mới</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>Tiêu đề câu hỏi</label>
            <Input
              placeholder='Nhập tiêu đề câu hỏi...'
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Nội dung chi tiết</label>
            <Textarea
              placeholder='Mô tả chi tiết câu hỏi của bạn...'
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              className='min-h-[150px]'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !tieuDe.trim() || !noiDung.trim()}
            className='bg-[#FF5722] hover:bg-[#E64A19] text-white'
          >
            {isPending ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin text-white' />
                Đang đăng...
              </>
            ) : (
              'Đăng câu hỏi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
