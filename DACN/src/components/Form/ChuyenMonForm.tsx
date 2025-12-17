import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { chuyenMonSchema, type ChuyenMonFormData } from '@/validations/chuyenMon.schema'
import { useMutation } from '@tanstack/react-query'
import { suaChuyenMon, themChuyenMon } from '@/apis/chuyenmon.api'
import { Loader2, X } from 'lucide-react'
import { useEffect } from 'react'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

interface Props {
  defaultValues?: ChuyenMonFormData
  editingId?: number | null
  setSelectRowId: (data: number | null) => void
  onSuccess?: () => void
}

export default function ChuyenMonForm({ defaultValues, editingId, setSelectRowId, onSuccess }: Props) {
  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: (body: ChuyenMonFormData) => themChuyenMon(body),
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
    mutationFn: ({ id, body }: { id: number; body: ChuyenMonFormData }) => suaChuyenMon(body, id),
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
  } = useForm<ChuyenMonFormData>({
    resolver: zodResolver(chuyenMonSchema),
    defaultValues: defaultValues || { maChuyenMon: '', tenChuyenMon: '', trangThai: true },
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = (data: ChuyenMonFormData) => {
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
    reset({ maChuyenMon: '', tenChuyenMon: '', trangThai: true })
    setSelectRowId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <fieldset disabled={isSubmitting} className='space-y-4'>
        <div>
          <Label htmlFor='code' className='text-sm font-medium'>
            Mã chuyên môn
          </Label>
          <Input
            id='code'
            {...register('maChuyenMon')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.maChuyenMon ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]' : 'border-gray-300 border'}`}
          />
          {errors.maChuyenMon && <p className='text-red-600 text-base mt-1'>{errors.maChuyenMon.message}</p>}
        </div>

        <div>
          <Label htmlFor='name' className='text-sm font-medium'>
            Tên chuyên môn <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='name'
            {...register('tenChuyenMon')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.tenChuyenMon ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]' : 'border-gray-300 border'}`}
          />
          {errors.tenChuyenMon && <p className='text-red-600 text-base mt-1'>{errors.tenChuyenMon.message}</p>}
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
