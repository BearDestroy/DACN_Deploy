import { useEffect, useState, useRef } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, Loader2, MessageSquare, Star, X } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { giangVienSchema, type GiangVienFormData } from '@/validations/giangvien.schema'
import type { GiangVienChiTiet } from '@/@types/GiangVien.type'
import { SelectCustomSingle } from '../Select/SelectCustom'
import { layChiTietGiangVien, suaGiangVien, themGiangVien } from '@/apis/giangvien'
import { layTatCaChuyenMon } from '@/apis/chuyenmon.api'
import { layTatCaHocVan } from '@/apis/hocvan'
import DatePicker from '../Calendar'

interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
}

export default function GiangVienForm({ selectRowId, setSelectRowId, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageDefault = '/channel-default.jpg'
  const defaultValues: GiangVienFormData = {
    maGiangVien: '',
    tenGiangVien: '',
    namSinh: new Date(),
    soDienThoai: '',
    email: '',
    idChuyenMon: 0,
    idHocVan: 0,
    kinhNghiem: '',
    anhDaiDienFile: null
  }

  const [giangVienChiTiet, setGiangVienChiTiet] = useState<GiangVienChiTiet | null>(null)

  const form = useForm<GiangVienFormData>({
    resolver: zodResolver(giangVienSchema),
    defaultValues
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = form

  const { data: chuyenMons = [], isLoading: loadingChuyenMon } = useQuery({
    queryKey: ['chuyenMons'],
    queryFn: async () => {
      const res = await layTatCaChuyenMon()
      return res.data || []
    }
  })

  const { data: hocVans = [], isLoading: loadingHocVan } = useQuery({
    queryKey: ['hocVans'],
    queryFn: async () => {
      const res = await layTatCaHocVan()
      return res.data || []
    }
  })

  // Get detail
  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietGiangVien(id),
    onSuccess: (res) => {
      if (res.statusCode === 200 && res.data) {
        const d = res.data
        reset({
          maGiangVien: d.maGiangVien ?? '',
          tenGiangVien: d.tenGiangVien ?? '',
          namSinh: d.namSinh ?? new Date(),
          soDienThoai: d.soDienThoai ?? '',
          email: d.email ?? '',
          idChuyenMon: d.idChuyenMon ?? 0,
          idHocVan: d.idHocVan ?? 0,
          kinhNghiem: d.kinhNghiem ?? '',
          anhDaiDienFile: null
        })
        setGiangVienChiTiet(d)
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  // Update
  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: GiangVienFormData }) => suaGiangVien(id, body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  // Add
  const { mutate: addMutate, isPending: isLoadingAdd } = useMutation({
    mutationFn: ({ body }: { body: GiangVienFormData }) => themGiangVien(body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        onSuccess?.()
        handleReset()
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  useEffect(() => {
    if (selectRowId) getDetailMutate({ id: selectRowId })
    else {
      reset(defaultValues)
      setTimeout(() => setGiangVienChiTiet(null), 0)
    }
  }, [selectRowId, getDetailMutate, reset])

  const handleReset = () => {
    reset(defaultValues)
    setSelectRowId(null)
    setGiangVienChiTiet(null)
  }

  const onSubmit = (data: GiangVienFormData) => {
    if (selectRowId) updateMutate({ id: selectRowId, body: data })
    else addMutate({ body: data })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
        {(isLoadingGetDetail || isLoadingUpdate || isLoadingAdd) && (
          <div className='absolute inset-0 bg-white/50 z-50 flex items-center justify-center'>
            <Loader2 className='animate-spin h-8 w-8 text-orange-500' />
          </div>
        )}
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
                  <p className='text-sm font-medium text-gray-900'>{giangVienChiTiet?.soLuongKhoaHoc ?? 0}</p>
                </div>
              </div>

              <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Học sinh</p>
                  <p className='text-sm font-medium text-gray-900'>{giangVienChiTiet?.soLuongHocSinh ?? 0}</p>
                </div>
              </div>

              <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                <div className='w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center'>
                  <Star className='h-4 w-4 text-yellow-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Đánh giá TB</p>
                  <p className='text-sm font-medium text-gray-900'>
                    {giangVienChiTiet?.danhGiaTrungBinh != null ? giangVienChiTiet.danhGiaTrungBinh.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2 bg-white rounded-md p-2'>
                <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                  <MessageSquare className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Số đánh giá</p>
                  <p className='text-sm font-medium text-gray-900'>{giangVienChiTiet?.soLuongDanhGia ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-center'>
          <div className='w-48 h-48 aspect-video flex flex-col relative'>
            <Controller
              name='anhDaiDienFile'
              control={control}
              render={({ field }) => {
                const previewSrc = field.value
                  ? URL.createObjectURL(field.value as File)
                  : giangVienChiTiet?.anhDaiDien
                    ? `1.55.203.158:5154${giangVienChiTiet.anhDaiDien}`
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

        {/* Form fields */}
        <div className='grid grid-cols-1 gap-2'>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Mã giảng viên</Label>
            <Controller
              name='maGiangVien'
              control={control}
              render={({ field }) => <Input {...field} value={field.value ?? ''} />}
            />
            {errors.maGiangVien && <span className='text-red-600 text-sm'>{errors.maGiangVien.message}</span>}
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>
              Tên giảng viên <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='tenGiangVien'
              control={control}
              render={({ field }) => <Input {...field} value={field.value ?? ''} />}
            />
            {errors.tenGiangVien && <span className='text-red-600 text-sm'>{errors.tenGiangVien.message}</span>}
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Ngày sinh</Label>
              <Controller
                name='namSinh'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    // @ts-expect-error hoặc dùng as any
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    dateFormat='dd/MM/yyyy'
                    placeholderText='Chọn ngày sinh'
                    className='w-full border rounded-md px-3 py-2'
                  />
                )}
              />
              {errors.namSinh && <span className='text-red-600 text-sm'>{errors.namSinh.message}</span>}
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Số điện thoại</Label>
              <Controller
                name='soDienThoai'
                control={control}
                render={({ field }) => <Input type='number' {...field} value={field.value ?? ''} />}
              />
              {errors.soDienThoai && <span className='text-red-600 text-sm'>{errors.soDienThoai.message}</span>}
            </div>
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Email</Label>
            <Controller
              name='email'
              control={control}
              render={({ field }) => <Input {...field} type='email' value={field.value ?? ''} />}
            />
            {errors.email && <span className='text-red-600 text-sm'>{errors.email.message}</span>}
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Chuyên môn <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idChuyenMon'
                control={control}
                render={({ field }) => {
                  const selected = chuyenMons.find((x) => x.id === field.value) ?? null
                  return (
                    <SelectCustomSingle
                      items={chuyenMons}
                      selected={selected}
                      onChange={(item) => field.onChange(item?.id ?? null)}
                      labelField='tenChuyenMon'
                      placeholder='Chọn chuyên môn'
                      loading={loadingChuyenMon}
                      errors={!!errors.idChuyenMon}
                    />
                  )
                }}
              />
              {errors.idChuyenMon && <span className='text-red-600 text-sm'>{errors.idChuyenMon.message}</span>}
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Học vấn</Label>
              <Controller
                name='idHocVan'
                control={control}
                render={({ field }) => {
                  const selected = hocVans.find((x) => x.id === field.value) ?? null
                  return (
                    <SelectCustomSingle
                      items={hocVans}
                      selected={selected}
                      onChange={(item) => field.onChange(item?.id ?? null)}
                      labelField='tenHocVan'
                      placeholder='Chọn học vấn'
                      loading={loadingHocVan}
                      errors={!!errors.idHocVan}
                    />
                  )
                }}
              />
              {errors.idHocVan && <span className='text-red-600 text-sm'>{errors.idHocVan.message}</span>}
            </div>
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Kinh nghiệm</Label>
            <Controller
              name='kinhNghiem'
              control={control}
              render={({ field }) => <Input {...field} value={field.value ?? ''} />}
            />
            {errors.kinhNghiem && <span className='text-red-600 text-sm'>{errors.kinhNghiem.message}</span>}
          </div>
        </div>

        {/* Buttons */}
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
