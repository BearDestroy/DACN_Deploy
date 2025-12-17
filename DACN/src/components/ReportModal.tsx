import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, AlertTriangle } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import { layTatCaLoaiDanhGia } from '@/apis/loaidanhgia'
import { baoCaoDanhGia } from '@/apis/baocaodanhgia'
import { baoCaoKhoaHoc } from '@/apis/baocaokhoahoc'
import { SelectCustomSingle } from './Select/SelectCustom'
import type { LoaiDanhGia } from '@/@types/LoaiDanhGia.type'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: number | null
  type: 'REVIEW' | 'COURSE'
}

const reportSchema = z.object({
  idLoaiBaoCao: z.string().min(1, 'Vui lòng chọn lý do báo cáo').transform(Number),

  noiDung: z.string().max(500, 'Nội dung báo cáo không được vượt quá 500 ký tự').optional().or(z.literal(''))
})

type ReportFormInput = z.input<typeof reportSchema> // string
type ReportFormOutput = z.output<typeof reportSchema> // number

export const ReportModal = ({ isOpen, onClose, targetId, type }: ReportModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ReportFormInput, any, ReportFormOutput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      idLoaiBaoCao: '',
      noiDung: ''
    }
  })
  const { data: dsLoaiBaoCao = [] } = useQuery({
    queryKey: ['loaiBaoCao'],
    queryFn: () => layTatCaLoaiDanhGia().then((res) => res.data),
    staleTime: 1000 * 60 * 30
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        idLoaiBaoCao: '',
        noiDung: ''
      })
    }
  }, [isOpen, reset])

  /* ===== MUTATION ===== */
  const mutation = useMutation({
    mutationFn: async (data: ReportFormOutput) => {
      if (!targetId) return

      const payload = {
        idLoaiBaoCao: data.idLoaiBaoCao,
        noiDung: data.noiDung ?? ''
      }

      if (type === 'REVIEW') {
        await baoCaoDanhGia({
          ...payload,
          idDanhGia: targetId
        })
      } else {
        await baoCaoKhoaHoc({
          ...payload,
          idKhoaHoc: targetId
        })
      }
    },
    onSuccess: () => {
      showSuccessToast({ message: 'Gửi báo cáo thành công!' })
      onClose()
    },
    onError: () => {
      showErrorToast({ message: 'Gửi báo cáo thành công!' })
    }
  })

  const onSubmit = (data: ReportFormOutput) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] border-[#FF5722]/20'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-[#FF5722]'>
            <AlertTriangle className='h-5 w-5' />
            Báo cáo lạm dụng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='py-4 space-y-4'>
          <div className='space-y-2'>
            <Label className='text-base font-medium text-gray-700'>
              Vấn đề bạn gặp phải là gì? <span className='text-red-500'>*</span>
            </Label>

            <Controller
              name='idLoaiBaoCao'
              control={control}
              render={({ field }) => (
                <SelectCustomSingle
                  items={dsLoaiBaoCao}
                  selected={dsLoaiBaoCao.find((x) => x.id === Number(field.value)) || null}
                  onChange={(val: LoaiDanhGia | null) => {
                    field.onChange(val ? String(val.id) : '')
                  }}
                  labelField='tenLoaiDanhGia'
                  placeholder='Chọn lý do báo cáo...'
                />
              )}
            />

            {errors.idLoaiBaoCao && <p className='text-sm text-red-500'>{errors.idLoaiBaoCao.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label className='text-base font-medium text-gray-700'>Chi tiết thêm (tùy chọn)</Label>

            <Controller
              name='noiDung'
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder='Mô tả chi tiết vi phạm...' className='min-h-[100px]' />
              )}
            />

            {errors.noiDung && <p className='text-sm text-red-500'>{errors.noiDung.message}</p>}
          </div>

          <DialogFooter className='mt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Hủy bỏ
            </Button>

            <Button type='submit' disabled={mutation.isPending} className='bg-[#FF5722] hover:bg-[#F4511E]'>
              {mutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Gửi báo cáo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
