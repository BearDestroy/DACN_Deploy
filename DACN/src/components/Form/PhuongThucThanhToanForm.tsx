import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { suaPhuongThucThanhToan, themPhuongThucThanhToan } from '@/apis/phuongthucthanhtoan'
import { Loader2, X } from 'lucide-react'
import { useEffect } from 'react'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { phuongThucThanhToanSchema, type phuongThucThanhToanFormData } from '@/validations/phuongthucthanhtoan.schema'

interface Props {
  defaultValues?: phuongThucThanhToanFormData
  editingId?: number | null
  setSelectRowId: (data: number | null) => void
  onSuccess?: () => void
}

export default function PhuongThucThanhToanForm({ defaultValues, editingId, setSelectRowId, onSuccess }: Props) {
  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: (body: phuongThucThanhToanFormData) => themPhuongThucThanhToan(body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: phuongThucThanhToanFormData }) => suaPhuongThucThanhToan(body, id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  const isSubmitting = isAdding || isUpdating

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors }
  } = useForm<phuongThucThanhToanFormData>({
    resolver: zodResolver(phuongThucThanhToanSchema),
    defaultValues: defaultValues || { maPhuongThucThanhToan: '', tenPhuongThucThanhToan: '', trangThai: true },
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = (data: phuongThucThanhToanFormData) => {
    if (editingId) {
      updateMutate({ id: editingId, body: data })
    } else {
      addMutate(data)
    }
  }

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const handleReset = () => {
    reset({ maPhuongThucThanhToan: '', tenPhuongThucThanhToan: '', trangThai: true })
    setSelectRowId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <fieldset disabled={isSubmitting} className='space-y-4'>
        <div>
          <Label htmlFor='code' className='text-sm font-medium'>
            Mã PTTT
          </Label>
          <Input
            id='code'
            {...register('maPhuongThucThanhToan')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.maPhuongThucThanhToan ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]' : 'border-gray-300 border'}`}
          />
          {errors.maPhuongThucThanhToan && (
            <p className='text-red-600 text-base mt-1'>{errors.maPhuongThucThanhToan.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor='name' className='text-sm font-medium'>
            Tên PTTT <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='name'
            {...register('tenPhuongThucThanhToan')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.tenPhuongThucThanhToan ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]' : 'border-gray-300 border'}`}
          />
          {errors.tenPhuongThucThanhToan && (
            <p className='text-red-600 text-base mt-1'>{errors.tenPhuongThucThanhToan.message}</p>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Label className='text-sm font-medium'>Trạng thái</Label>
          <Controller
            control={control}
            name='trangThai'
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className='data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300'
              />
            )}
          />
        </div>

        <div className='flex gap-3 pt-4'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-orange-500 hover:bg-orange-600 text-white flex-1 text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {isSubmitting && <Loader2 className='animate-spin h-4 w-4' />}
            {editingId ? 'Cập nhật' : 'Lưu'}
          </Button>

          <Button
            type='button'
            variant='outline'
            className='flex-1 text-sm font-medium'
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <X className='h-4 w-4 mr-1' /> Xóa trắng
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
