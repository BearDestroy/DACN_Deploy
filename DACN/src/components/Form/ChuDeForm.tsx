import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { suaChuDe, themChuDe } from '@/apis/chude'
import { layTatCaTheLoai } from '@/apis/theloai'
import { Check, ChevronsUpDownIcon, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { chuDeSchema, type chuDeFormData } from '@/validations/chude.schema'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  defaultValues?: chuDeFormData
  editingId?: number | null
  setSelectRowId: (data: number | null) => void
  onSuccess?: () => void
}

export default function ChuDeForm({ defaultValues, editingId, setSelectRowId, onSuccess }: Props) {
  const [open, setOpen] = useState(false)

  const {
    data: danhMucs = [],
    isLoading: loadingDM,
    isError
  } = useQuery({
    queryKey: ['theloais'],
    queryFn: async () => {
      const res = await layTatCaTheLoai()
      return res.data || []
    }
  })

  useEffect(() => {
    if (isError) {
      showErrorToast({ message: 'Lỗi khi tải thể loại' })
    }
  }, [isError])

  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: (body: chuDeFormData) => themChuDe(body),
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
    mutationFn: ({ id, body }: { id: number; body: chuDeFormData }) => suaChuDe(body, id),
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
  } = useForm<chuDeFormData>({
    resolver: zodResolver(chuDeSchema),
    defaultValues: defaultValues || { maChuDe: '', tenChuDe: '', trangThai: true, idTheLoai: 0 },
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = (data: chuDeFormData) => {
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
    reset({ maChuDe: '', tenChuDe: '', trangThai: true, idTheLoai: 0 })
    setSelectRowId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <fieldset disabled={isSubmitting} className='space-y-4'>
        <div>
          <Label htmlFor='code' className='text-sm font-medium'>
            Mã chủ đề
          </Label>
          <Input
            id='code'
            {...register('maChuDe')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
              errors.maChuDe
                ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]'
                : 'border-gray-300 border'
            }`}
          />
          {errors.maChuDe && <p className='text-red-600 text-base mt-1'>{errors.maChuDe.message}</p>}
        </div>

        <div>
          <Label htmlFor='name' className='text-sm font-medium'>
            Tên chủ đề <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='name'
            {...register('tenChuDe')}
            className={`mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
              errors.tenChuDe
                ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]'
                : 'border-gray-300 border'
            }`}
          />
          {errors.tenChuDe && <p className='text-red-600 text-base mt-1'>{errors.tenChuDe.message}</p>}
        </div>

        <div>
          <Label className='text-sm font-medium'>
            Danh mục <span className='text-red-500'>*</span>
          </Label>
          <Controller
            control={control}
            name='idTheLoai'
            render={({ field }) => (
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className={`w-full justify-between mt-2 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                        errors.idTheLoai
                          ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]'
                          : 'border-gray-300 border'
                      }`}
                      disabled={loadingDM}
                    >
                      {loadingDM
                        ? 'Đang tải...'
                        : field.value
                          ? danhMucs.find((dm) => dm.id === field.value)?.tenTheLoai
                          : 'Chọn thể loại'}
                      <ChevronsUpDownIcon className='opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
                    <Command>
                      <CommandInput placeholder='Tìm thể loại...' className='h-9' />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy thể loại.</CommandEmpty>
                        <CommandGroup>
                          {danhMucs.map((dm) => (
                            <CommandItem
                              key={dm.id}
                              value={dm.id.toString()}
                              onSelect={() => {
                                field.onChange(dm.id)
                                setOpen(false)
                              }}
                              className={`cursor-pointer ${
                                field.value === dm.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'
                              }`}
                            >
                              {dm.tenTheLoai}
                              <Check
                                className={`ml-auto text-orange-500 ${
                                  field.value === dm.id ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.idTheLoai && <p className='text-red-600 text-base mt-1'>{errors.idTheLoai.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Trạng thái */}
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

        {/* Buttons */}
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
