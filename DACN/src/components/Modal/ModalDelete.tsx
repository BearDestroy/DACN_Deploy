'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'

interface DeleteModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
}

export function DeleteModal({
  isOpen,
  setIsOpen,
  onConfirm,
  title = 'Xác nhận xóa',
  description = 'Bạn sắp xóa mục này. Bạn có chắc chắn không?'
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[420px] rounded-2xl px-6 py-8'>
        <div className='mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-red-100'>
          <AlertTriangle className='h-12 w-12 text-red-500' />
        </div>

        <DialogHeader className='text-center space-y-2'>
          <DialogTitle className='text-2xl font-semibold text-gray-900 text-center'>{title}</DialogTitle>
          <DialogDescription className='text-base text-gray-600 text-center'>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-6 flex justify-center gap-4 w-full'>
          <Button
            variant='outline'
            className='flex-1 px-6 py-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 justify-center'
            onClick={() => setIsOpen(false)}
          >
            Không, giữ lại.
          </Button>

          <Button
            className='flex-1 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white justify-center'
            onClick={() => {
              onConfirm()
              setIsOpen(false)
            }}
          >
            Có, hãy xóa!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
