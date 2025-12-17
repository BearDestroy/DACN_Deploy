import { useEffect, useState, useRef } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, Loader2, MessageSquare, Star, X } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { nguoiDungSchema, type NguoiDungFormData } from '@/validations/nguoidung.schema'
import type { NguoiDungChiTiet } from '@/@types/NguoiDung'
import { SelectCustomSingle } from '../Select/SelectCustom'
import { SelectCustomMulti } from '../Select/SelectCustomMulti'
import { layChiTietNguoiDung, suaNguoiDung, themNguoiDung } from '@/apis/nguoidung'
import { layTatCaMucDich } from '@/apis/mucdich'
import { layTatCaNgheNghiep } from '@/apis/nghenghiep'
import { layTatCaVaiTro } from '@/apis/vaitro'

interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
}

export default function NguoiDungForm({ selectRowId, setSelectRowId, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageDefault = '/channel-default.jpg'
  const defaultValues: NguoiDungFormData = {
    tenNguoiDung: '',
    email: '',
    idNgheNghiep: 0,
    idMucDich: 0,
    idVaiTro: [],
    anhDaiDienFile: null
  }

  const [nguoiDungChiTiet, setNguoiDungChiTiet] = useState<NguoiDungChiTiet | null>(null)

  const form = useForm<NguoiDungFormData>({
    resolver: zodResolver(nguoiDungSchema),
    defaultValues
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = form

  const { data: mucDichs = [], isLoading: loadingMucDich } = useQuery({
    queryKey: ['mucDichs'],
    queryFn: async () => {
      const res = await layTatCaMucDich()
      return res.data || []
    }
  })
  const { data: ngheNghieps = [], isLoading: loadingNgheNghiep } = useQuery({
    queryKey: ['ngheNghieps'],
    queryFn: async () => {
      const res = await layTatCaNgheNghiep()
      return res.data || []
    }
  })
  const { data: vaiTros = [], isLoading: isLoadingVaiTro } = useQuery({
    queryKey: ['vaiTros'],
    queryFn: async () => {
      const res = await layTatCaVaiTro()
      return res.data || []
    }
  })

  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietNguoiDung(id),
    onSuccess: (res) => {
      if (res.statusCode === 200 && res.data) {
        reset({
          tenNguoiDung: res.data.tenNguoiDung,
          email: res.data.email,
          idNgheNghiep: res.data.idNgheNghiep,
          idMucDich: res.data.idMucDich,
          idVaiTro: res.data.idVaiTro || [],
          anhDaiDienFile: null
        })
        setNguoiDungChiTiet(res.data)
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: NguoiDungFormData }) => suaNguoiDung(id, body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
      } else showErrorToast({ message: data.message })
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const { mutate: addMutate, isPending: isLoadingAdd } = useMutation({
    mutationFn: ({ body }: { body: NguoiDungFormData }) => themNguoiDung(body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
        handleReset()
      } else showErrorToast({ message: data.message })
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  useEffect(() => {
    if (selectRowId) getDetailMutate({ id: selectRowId })
    else {
      reset(defaultValues)
      setTimeout(() => setNguoiDungChiTiet(null), 0)
    }
  }, [selectRowId, getDetailMutate, reset])

  const handleReset = () => {
    reset(defaultValues)
    setSelectRowId(null)
    setNguoiDungChiTiet(null)
  }

  const onSubmit = (data: NguoiDungFormData) => {
    if (selectRowId) updateMutate({ id: selectRowId, body: data })
    else addMutate({ body: data })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 relative'>
        {(isLoadingGetDetail || isLoadingUpdate || isLoadingAdd) && (
          <div className='absolute inset-0 bg-white/50 z-50 flex items-center justify-center'>
            <Loader2 className='animate-spin h-8 w-8 text-orange-500' />
          </div>
        )}
        <div className='space-y-1 p-2 rounded-md'>
          {selectRowId && (
            <div className='bg-linear-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200 mb-4'>
              <h3 className='text-sm font-medium text-gray-700 mb-2'>Thống kê hoạt động</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                  <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                    <BookOpen className='h-4 w-4 text-orange-600' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Khóa học</p>
                    <p className='text-sm font-medium text-gray-900'>{nguoiDungChiTiet?.soLuongKhoaHoc ?? 0}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                  <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Hoàn thành</p>
                    <p className='text-sm font-medium text-gray-900'>{nguoiDungChiTiet?.soLuongBaiHocHoanThanh ?? 0}</p>
                  </div>
                </div>

                {/* Đánh giá TB */}
                <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                  <div className='w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center'>
                    <Star className='h-4 w-4 text-yellow-600' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Đánh giá TB</p>
                    <p className='text-sm font-medium text-gray-900'>
                      {nguoiDungChiTiet?.danhGiaTrungBinh ? nguoiDungChiTiet?.danhGiaTrungBinh.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Số đánh giá */}
                <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <MessageSquare className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Số đánh giá</p>
                    <p className='text-sm font-medium text-gray-900'>{nguoiDungChiTiet?.soLuongDanhGia ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='space-y-1 rounded-md -mt-6'>
          <div className='flex justify-center'>
            <div className='w-48 h-48 aspect-video flex flex-col relative mb-4'>
              <Controller
                name='anhDaiDienFile'
                control={control}
                render={({ field }) => {
                  const previewSrc = field.value
                    ? URL.createObjectURL(field.value as File)
                    : nguoiDungChiTiet?.anhDaiDien
                      ? `1.55.203.158:5154${nguoiDungChiTiet.anhDaiDien}`
                      : imageDefault

                  return (
                    <>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          field.onChange(file ?? null)
                        }}
                      />
                      <div
                        className='w-full h-full relative rounded-md border border-gray-300 overflow-hidden cursor-pointer group'
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <img
                          src={previewSrc}
                          alt='Ảnh đại diện'
                          className='w-full h-full object-cover transition-transform duration-200 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                          <span className='text-white text-sm'>Click để thay ảnh</span>
                        </div>
                      </div>
                    </>
                  )
                }}
              />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-2 -mt-5'>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Tên người dùng <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='tenNguoiDung'
              control={control}
              render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder='Nhập tên người dùng' />}
            />
            {errors.tenNguoiDung && <span className='text-red-600 text-sm'>{errors.tenNguoiDung.message}</span>}
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Email <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input {...field} type='email' value={field.value ?? ''} placeholder='example@email.com' />
              )}
            />
            {errors.email && <span className='text-red-600 text-sm'>{errors.email.message}</span>}
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Nghề nghiệp <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idNgheNghiep'
              control={control}
              render={({ field }) => {
                const selected = ngheNghieps.find((x) => x.id === field.value) ?? null
                return (
                  <SelectCustomSingle
                    items={ngheNghieps}
                    selected={selected}
                    onChange={(item) => field.onChange(item?.id ?? null)}
                    labelField='tenNgheNghiep'
                    placeholder='Chọn nghề nghiệp'
                    loading={loadingNgheNghiep}
                    errors={!!errors.idNgheNghiep}
                  />
                )
              }}
            />
            {errors.idNgheNghiep && <span className='text-red-600 text-sm'>{errors.idNgheNghiep.message}</span>}
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Mục đích học tập <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idMucDich'
              control={control}
              render={({ field }) => {
                const selected = mucDichs.find((x) => x.id === field.value) ?? null
                return (
                  <SelectCustomSingle
                    items={mucDichs}
                    selected={selected}
                    onChange={(item) => field.onChange(item?.id ?? null)}
                    labelField='tenMucDich'
                    placeholder='Chọn mục đích học tập'
                    loading={loadingMucDich}
                    errors={!!errors.idMucDich}
                  />
                )
              }}
            />
            {errors.idMucDich && <span className='text-red-600 text-sm'>{errors.idMucDich.message}</span>}
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Vai trò <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idVaiTro'
              control={control}
              render={({ field }) => (
                <SelectCustomMulti
                  items={vaiTros}
                  selectedIds={field.value ?? []}
                  onChange={field.onChange}
                  labelField='tenVaiTro'
                  placeholder='Chọn vai trò'
                  loading={isLoadingVaiTro}
                  errors={!!errors.idVaiTro}
                />
              )}
            />
            {errors.idVaiTro && <span className='text-red-600 text-sm'>{errors.idVaiTro.message}</span>}
          </div>
        </div>

        <div className='flex gap-2 mt-4'>
          <Button
            type='submit'
            disabled={isLoadingAdd || isLoadingUpdate}
            className='bg-orange-500 hover:bg-orange-600 text-white flex-1'
          >
            {(isLoadingAdd || isLoadingUpdate) && <Loader2 className='animate-spin h-4 w-4 mr-1' />}{' '}
            {selectRowId ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
          <Button
            type='button'
            variant='outline'
            className='flex-1'
            onClick={handleReset}
            disabled={isLoadingGetDetail || isLoadingAdd || isLoadingUpdate}
          >
            <X className='h-4 w-4 mr-1' /> Xóa trắng
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
