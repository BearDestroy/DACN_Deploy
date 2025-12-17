import { useEffect, useRef, useMemo } from 'react'
import { useForm, Controller, FormProvider, type Resolver, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SelectCustomSingle } from '@/components/Select/SelectCustom'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { loTrinhHocSchema, type LoTrinhHocFormData } from '@/validations/lotrinhhoc.schema'
import { layChiTietQLLoTrinhHoc, suaLoTrinhHoc, themLoTrinhHoc } from '@/apis/loTrinhHoc'
import { useMutation } from '@tanstack/react-query'
import KhoaHocCarousel, { type KhoaHocOption } from '../KhoaHocCarousel/KhoaHocCarousel'
import { Switch } from '@/components/ui/switch'
import type { QLLoTrinhHocChiTietResponse } from '@/@types/LoTrinhHoc'

interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
  mucDich: { id: number; tenMucDich: string }[]
  ngheNghiep: { id: number; tenNgheNghiep: string }[]
  trinhDo: { id: number; tenTrinhDo: string }[]
  loadingMucDich: boolean
  loadingNgheNghiep: boolean
  loadingTrinhDo: boolean
  khoaHocs: KhoaHocOption[] | []
}

// Helper function để map dữ liệu (để ngoài component tránh bị tạo lại mỗi lần render)
const mapApiToForm = (data: QLLoTrinhHocChiTietResponse): LoTrinhHocFormData => ({
  maLoTrinhHoc: data.maLoTrinhHoc ?? '',
  tenLoTrinhHoc: data.tenLoTrinhHoc ?? '',
  moTaNgan: data.moTaNgan ?? '',
  noiDungHocDuoc: data.noiDungHocDuoc ?? '',
  idTrinhDo: data.idTrinhDo ?? 0,
  idMucDich: data.idMucDich ?? 0,
  idNgheNghiep: data.idNgheNghiep ?? 0,
  anhDaiDien: data.anhDaiDien, // Url ảnh từ server
  anhDaiDienFile: null, // File mới upload (nếu có)
  trangThai: data.trangThai ?? false,
  danhSachKhoaHoc: (data.danhSachKhoaHoc ?? []).map((kh) => ({
    idKhoaHoc: kh.idKhoaHoc,
    idKhoaHocLoTrinh: kh.idKhoaHocLoTrinh,
    thuTu: kh.thuTu ?? 0
  }))
})

export default function LoTrinhHocForm({
  selectRowId,
  setSelectRowId,
  onSuccess,
  mucDich,
  ngheNghiep,
  trinhDo,
  loadingMucDich,
  loadingNgheNghiep,
  loadingTrinhDo,
  khoaHocs
}: Props) {
  const defaultValues: LoTrinhHocFormData = {
    maLoTrinhHoc: '',
    tenLoTrinhHoc: '',
    moTaNgan: '',
    noiDungHocDuoc: '',
    idTrinhDo: 0,
    idMucDich: 0,
    idNgheNghiep: 0,
    anhDaiDien: null,
    trangThai: false,
    anhDaiDienFile: null,
    danhSachKhoaHoc: []
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<LoTrinhHocFormData>({
    resolver: zodResolver(loTrinhHocSchema) as Resolver<LoTrinhHocFormData>,
    defaultValues
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = form

  const watchedAnhDaiDienFile = useWatch({ control, name: 'anhDaiDienFile' })
  const watchedAnhDaiDienUrl = useWatch({ control, name: 'anhDaiDien' })

  const previewImage = useMemo(() => {
    if (watchedAnhDaiDienFile) {
      return URL.createObjectURL(watchedAnhDaiDienFile)
    }
    if (watchedAnhDaiDienUrl) {
      return `1.55.203.158:5154${watchedAnhDaiDienUrl}`
    }
    return '/channel-default.jpg'
  }, [watchedAnhDaiDienFile, watchedAnhDaiDienUrl])

  useEffect(() => {
    return () => {
      if (watchedAnhDaiDienFile && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [watchedAnhDaiDienFile, previewImage])

  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietQLLoTrinhHoc(id),
    onSuccess: (res) => {
      if (res.statusCode === 200 && res.data) {
        reset(mapApiToForm(res.data))
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi lấy chi tiết' })
  })

  useEffect(() => {
    if (selectRowId) {
      getDetailMutate({ id: selectRowId })
    }
  }, [selectRowId])

  const handleReset = () => {
    reset(defaultValues)
    setSelectRowId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const { mutate: themLoTrinhHocMutate, isPending: isLoadingThem } = useMutation({
    mutationFn: (data: LoTrinhHocFormData) => themLoTrinhHoc(data),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message })
        handleReset() // Reset form sau khi thêm thành công
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi thêm mới' })
  })

  const { mutate: suaLoTrinhHocMutate, isPending: isLoadingSua } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LoTrinhHocFormData }) => suaLoTrinhHoc(id, data),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ khi cập nhật' })
  })

  const onSubmit = (data: LoTrinhHocFormData) => {
    if (selectRowId) {
      suaLoTrinhHocMutate({ id: selectRowId, data })
    } else {
      themLoTrinhHocMutate(data)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4 rounded-md shadow-sm relative bg-white'>
        {isLoadingGetDetail && (
          <div className='absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-md'>
            <Loader2 className='animate-spin h-8 w-8 text-orange-500' />
          </div>
        )}

        <div className='flex flex-col space-y-1 md:col-span-2'>
          <Label className='text-sm font-medium'>Ảnh đại diện</Label>
          <Controller
            name='anhDaiDienFile'
            control={control}
            render={(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              { field: { value, onChange, ...fieldProps } } // 1. Tách 'value' ra để KHÔNG truyền vào input
            ) => (
              <>
                <input
                  {...fieldProps}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      onChange(file) // Cập nhật file vào form state
                    }
                  }}
                />
                <div
                  className='w-full h-48 border border-gray-300 rounded-md cursor-pointer overflow-hidden relative group bg-gray-50'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img src={previewImage} alt='preview' className='w-full h-full object-fit' />

                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                    <span className='text-white text-sm font-medium'>Click để thay đổi hình ảnh</span>
                  </div>
                </div>
              </>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Mã lộ trình */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Mã lộ trình</Label>
            <Controller
              name='maLoTrinhHoc'
              control={control}
              render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder='Nhập mã...' />}
            />
            {errors.maLoTrinhHoc && <span className='text-red-600 text-sm'>{errors.maLoTrinhHoc.message}</span>}
          </div>

          {/* Tên lộ trình */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Tên lộ trình <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='tenLoTrinhHoc'
              control={control}
              render={({ field }) => <Input {...field} placeholder='Nhập tên lộ trình...' />}
            />
            {errors.tenLoTrinhHoc && <span className='text-red-600 text-sm'>{errors.tenLoTrinhHoc.message}</span>}
          </div>

          {/* Mô tả ngắn */}
          <div className='flex flex-col space-y-1 md:col-span-2'>
            <Label className='text-sm font-medium'>
              Mô tả ngắn <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='moTaNgan'
              control={control}
              render={({ field }) => <Textarea {...field} rows={3} placeholder='Nhập mô tả ngắn...' />}
            />
            {errors.moTaNgan && <span className='text-red-600 text-sm'>{errors.moTaNgan.message}</span>}
          </div>

          {/* Nội dung học được */}
          <div className='flex flex-col space-y-1 md:col-span-2'>
            <Label className='text-sm font-medium'>
              Nội dung học được <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='noiDungHocDuoc'
              control={control}
              render={({ field }) => <Textarea {...field} rows={4} placeholder='Chi tiết nội dung học...' />}
            />
            {errors.noiDungHocDuoc && <span className='text-red-600 text-sm'>{errors.noiDungHocDuoc.message}</span>}
          </div>

          {/* Trình độ */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Trình độ <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idTrinhDo'
              control={control}
              render={({ field }) => {
                const selected = trinhDo.find((x) => x.id === field.value) ?? null
                return (
                  <SelectCustomSingle
                    items={trinhDo}
                    selected={selected}
                    onChange={(item) => field.onChange(item?.id ?? 0)}
                    labelField='tenTrinhDo'
                    placeholder='Chọn trình độ'
                    loading={loadingTrinhDo}
                    errors={!!errors.idTrinhDo}
                  />
                )
              }}
            />
            {errors.idTrinhDo && <span className='text-red-600 text-sm'>{errors.idTrinhDo.message}</span>}
          </div>

          {/* Mục đích */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Mục đích <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idMucDich'
              control={control}
              render={({ field }) => {
                const selected = mucDich.find((x) => x.id === field.value) ?? null
                return (
                  <SelectCustomSingle
                    items={mucDich}
                    selected={selected}
                    onChange={(item) => field.onChange(item?.id ?? 0)}
                    labelField='tenMucDich'
                    placeholder='Chọn mục đích'
                    loading={loadingMucDich}
                    errors={!!errors.idMucDich}
                  />
                )
              }}
            />
            {errors.idMucDich && <span className='text-red-600 text-sm'>{errors.idMucDich.message}</span>}
          </div>

          {/* Nghề nghiệp */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Nghề nghiệp <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='idNgheNghiep'
              control={control}
              render={({ field }) => {
                const selected = ngheNghiep.find((x) => x.id === field.value) ?? null
                return (
                  <SelectCustomSingle
                    items={ngheNghiep}
                    selected={selected}
                    onChange={(item) => field.onChange(item?.id ?? 0)}
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

          <div className='flex flex-col gap-2'>
            <Label className='text-sm font-medium'>Trạng thái hoạt động</Label>
            <Controller
              name='trangThai'
              control={control}
              render={({ field }) => <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />}
            />
          </div>
        </div>

        <div className='mt-2 mb-6'>
          <Label className='text-sm font-medium mb-1 block'>Danh sách khóa học</Label>

          <div className='space-y-1 rounded-md h-auto max-h-[500px] overflow-y-auto pr-2 border border-gray-200 p-2'>
            <KhoaHocCarousel danhSachOption={khoaHocs} />
          </div>

          {errors.danhSachKhoaHoc && (
            <span className='text-red-600 text-sm block mt-1'>
              {errors.danhSachKhoaHoc.message || 'Vui lòng kiểm tra lại danh sách khóa học'}
            </span>
          )}
        </div>

        <div className='flex gap-2 mt-4'>
          <Button
            type='submit'
            className='bg-orange-500 hover:bg-orange-600 text-white flex-1 flex items-center justify-center'
            disabled={isLoadingThem || isLoadingSua}
          >
            {(isLoadingThem || isLoadingSua) && <Loader2 className='animate-spin h-5 w-5 mr-2' />}
            Lưu
          </Button>

          <Button type='button' variant='outline' onClick={handleReset} className='flex-1'>
            Xóa trắng
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
