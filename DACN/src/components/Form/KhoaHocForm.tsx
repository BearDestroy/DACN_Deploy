import { useEffect, useRef, useState } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Star, X } from 'lucide-react'
import type { ChuDe } from '@/@types/ChuDe.type'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { khoaHocSchema, type KhoaHocFormData } from '@/validations/khoahoc.schema'
import type { MucDich } from '@/@types/MucDich.type'
import type { NgheNghiep } from '@/@types/NgheNghiep.type'
import type { TrinhDo } from '@/@types/TrinhDo.type'
import type { GiangVien } from '@/@types/GiangVien.type'
import { SelectCustomSingle } from '../Select/SelectCustom'
import type { KhoaHocChiTietResponse } from '@/@types/KhoaHoc'
import { layChiTietKhoaHoc, suaKhoaHoc, themKhoaHoc } from '@/apis/khoahoc'
import { ScrollArea } from '../ui/scroll-area'
import ChuongHocCarousel from '../Carousel/ChuongHocCarousel'
import { mapApiToForm } from '@/utils/function'
import { SelectCustomMulti } from '../Select/SelectCustomMulti'
interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
  chuDe: ChuDe[]
  giangVien: GiangVien[]
  loadingChuDe: boolean
  loadingGiangVien: boolean
  loadingMucDich: boolean
  loadingNgheNghiep: boolean
  loadingTrinhDo: boolean
  mucDich: MucDich[]
  ngheNghiep: NgheNghiep[]
  trinhDo: TrinhDo[]
}

export default function KhoaHocForm({
  selectRowId,
  setSelectRowId,
  onSuccess,
  chuDe,
  loadingChuDe,
  loadingMucDich,
  loadingNgheNghiep,
  loadingTrinhDo,
  mucDich,
  ngheNghiep,
  trinhDo,
  giangVien,
  loadingGiangVien
}: Props) {
  const defaultValues: KhoaHocFormData = {
    maKhoaHoc: '',
    tenKhoaHoc: '',
    moTaNgan: '',
    noiDungHocDuoc: '',
    yeuCauKhoaHoc: '',
    noiDungKhoaHoc: '',
    doiTuongKhoaHoc: '',
    idTrinhDo: 0,
    idGiangVien: 0,
    idMucDich: 0,
    idNgheNghiep: 0,
    idChuDe: [],
    anhDaiDien: null,
    trangThai: false,
    danhSachChuongHoc: [],
    anhDaiDienFile: null
  }
  const imageDefault = '/channel-default.jpg'

  const [khoaHocChiTiet, setKhoaHocChiTiet] = useState<KhoaHocChiTietResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<KhoaHocFormData>({
    resolver: zodResolver(khoaHocSchema),
    defaultValues: defaultValues
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = form
  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietKhoaHoc(id),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        if (res.data) {
          const formData = mapApiToForm(res.data)
          reset(formData)
        }
        setKhoaHocChiTiet(res.data ?? null)
      } else {
        showErrorToast({ message: res.message })
      }
    },

    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: KhoaHocFormData }) => suaKhoaHoc(id, body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })

        onSuccess?.()

        if (selectRowId) {
          getDetailMutate({ id: selectRowId })
        }
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  const { mutate: addMutate, isPending: isLoadingAdd } = useMutation({
    mutationFn: ({ body }: { body: KhoaHocFormData }) => themKhoaHoc(body),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        reset()
        onSuccess?.()
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  useEffect(() => {
    if (selectRowId) {
      getDetailMutate({ id: selectRowId })
    } else {
      reset(defaultValues)
    }
  }, [selectRowId, getDetailMutate, reset])

  const handleReset = () => {
    reset(defaultValues)
    setSelectRowId(null)
    setKhoaHocChiTiet(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = (data: KhoaHocFormData) => {
    if (selectRowId) {
      updateMutate({ id: selectRowId, body: data })
    } else {
      addMutate({ body: data })
    }
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-1'>
        {isLoadingGetDetail ||
          isLoadingUpdate ||
          (isLoadingAdd && (
            <div className='absolute inset-0 bg-white/50 z-50 flex items-center justify-center'>
              <Loader2 className='animate-spin h-8 w-8 text-orange-500' />
            </div>
          ))}

        <div className='space-y-1 p-4 rounded-md shadow-sm'>
          <div className='flex gap-3'>
            <div className='w-48 h-48 aspect-video flex flex-col relative'>
              <Controller
                name='anhDaiDienFile'
                control={control}
                render={({ field }) => {
                  const previewSrc = field.value
                    ? URL.createObjectURL(field.value as File)
                    : khoaHocChiTiet?.hinhDaiDien
                      ? `1.55.203.158:5154${khoaHocChiTiet.hinhDaiDien}`
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
                          if (file) {
                            field.onChange(file)
                          } else {
                            field.onChange(null) // nếu xóa file
                          }
                        }}
                      />
                      <div
                        className='w-48 h-48 aspect-video relative rounded-md border border-gray-300 overflow-hidden cursor-pointer group'
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

            <div className='grid grid-cols-12 gap-2 flex-1'>
              <div className='col-span-12 -mt-2'>
                <Label className='text-sm font-medium'>
                  Tên khóa học <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='tenKhoaHoc'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                    />
                  )}
                />
                {errors.tenKhoaHoc && <span className='text-red-600 text-sm'>{errors.tenKhoaHoc.message}</span>}
              </div>

              <div
                className='col-span-4 row-span-2 flex flex-col items-center justify-center 
                space-y-1 text-center md:text-left md:items-start'
              >
                <Label className='text-sm font-medium'>Đánh giá trung bình</Label>

                <div className='flex items-center gap-1 justify-center md:justify-start'>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const rating = khoaHocChiTiet?.danhGiaTrungBinh ?? 0
                    const fillLevel = Math.max(0, Math.min(1, rating - i))

                    return (
                      <div key={i} className='relative h-5 w-5'>
                        <Star className='h-5 w-5 stroke-yellow-500' />
                        {fillLevel > 0 && (
                          <div
                            className='absolute top-0 left-0 h-5 overflow-hidden'
                            style={{ width: `${fillLevel * 100}%` }}
                          >
                            <Star className='h-5 w-5 fill-yellow-500 stroke-yellow-500' />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <span className='text-xs text-gray-500'>{khoaHocChiTiet?.tongSoDanhGia ?? 0} lượt đánh giá</span>
              </div>

              <div className='col-span-8 flex flex-col space-y-1'>
                <Label className='text-sm font-medium'>Mã khóa học</Label>
                <Controller
                  name='maKhoaHoc'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                    />
                  )}
                />
                {errors.maKhoaHoc && <span className='text-red-600 text-sm'>{errors.maKhoaHoc.message}</span>}
              </div>

              <div className='col-span-8 flex flex-col space-y-1'>
                <Label className='text-sm font-medium'>
                  Giảng viên <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='idGiangVien'
                  control={control}
                  rules={{ required: 'Giảng viên bắt buộc' }}
                  render={({ field }) => {
                    const selected = giangVien.find((x) => x.id === field.value) ?? null
                    return (
                      <SelectCustomSingle
                        items={giangVien}
                        selected={selected}
                        onChange={(item) => field.onChange(item?.id ?? null)}
                        labelField='tenGiangVien'
                        placeholder='Chọn giảng viên'
                        loading={loadingGiangVien}
                        errors={!!errors.idGiangVien}
                      />
                    )
                  }}
                />
                {errors.idGiangVien && <span className='text-red-600 text-sm'>{errors.idGiangVien.message}</span>}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Đối tượng học</Label>
              <Controller
                name='doiTuongKhoaHoc'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    value={field.value ?? ''}
                    className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                  />
                )}
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Yêu cầu khóa học</Label>
              <Controller
                name='yeuCauKhoaHoc'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    value={field.value ?? ''}
                    className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                  />
                )}
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Mô tả ngắn <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='moTaNgan'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    value={field.value ?? ''}
                    className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                  />
                )}
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Nội dung học được <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='noiDungHocDuoc'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    value={field.value ?? ''}
                    className='border border-gray-300 rounded-md px-2 py-1 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                  />
                )}
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Nghề nghiệp <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idNgheNghiep'
                control={control}
                rules={{ required: 'Nghề nghiệp bắt buộc' }}
                render={({ field }) => {
                  const selected = ngheNghiep.find((x) => x.id === field.value) ?? null
                  return (
                    <SelectCustomSingle
                      items={ngheNghiep}
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
              {errors.idNgheNghiep && <span className='text-sm text-red-600'>{errors.idNgheNghiep.message}</span>}
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Mục đích <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idMucDich'
                control={control}
                rules={{ required: 'Mục đích bắt buộc' }}
                render={({ field }) => {
                  const selected = mucDich.find((x) => x.id === field.value) ?? null
                  return (
                    <SelectCustomSingle
                      items={mucDich}
                      selected={selected}
                      onChange={(item) => field.onChange(item?.id ?? null)}
                      labelField='tenMucDich'
                      placeholder='Chọn mục đích'
                      loading={loadingMucDich}
                      errors={!!errors.idMucDich}
                    />
                  )
                }}
              />
              {errors.idMucDich && <span className='text-sm text-red-600'>{errors.idMucDich.message}</span>}
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>
                Trình độ <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idTrinhDo'
                control={control}
                rules={{ required: 'Trình độ bắt buộc' }}
                render={({ field }) => {
                  const selected = trinhDo.find((x) => x.id === field.value) ?? null
                  return (
                    <SelectCustomSingle
                      items={trinhDo}
                      selected={selected}
                      onChange={(item) => field.onChange(item?.id ?? null)}
                      labelField='tenTrinhDo'
                      placeholder='Chọn trình độ'
                      loading={loadingTrinhDo}
                      errors={!!errors.idTrinhDo}
                    />
                  )
                }}
              />
              {errors.idTrinhDo && <span className='text-sm text-red-600'>{errors.idTrinhDo.message}</span>}
            </div>
          </div>
          <div className='col-span-1 md:col-span-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-1'>
                  Nội dung khóa học <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='noiDungKhoaHoc'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={6}
                      value={field.value ?? ''}
                      className='border border-gray-300 rounded-md px-2 transition-shadow duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                    />
                  )}
                />
              </div>
              <div className='flex flex-col space-y-1 -mt-0.5 '>
                <Label className='text-sm font-medium'>
                  Chủ đề <span className='text-red-500'>*</span>
                </Label>

                <Controller
                  name='idChuDe'
                  control={control}
                  rules={{
                    validate: (value) => (value && value.length > 0) || 'Chủ đề bắt buộc'
                  }}
                  render={({ field }) => (
                    <SelectCustomMulti
                      items={chuDe}
                      selectedIds={field.value ?? []}
                      onChange={field.onChange}
                      labelField='tenChuDe'
                      placeholder='Chọn chủ đề'
                      loading={loadingChuDe}
                      errors={!!errors.idChuDe}
                    />
                  )}
                />

                {errors.idChuDe && <span className='text-sm text-red-600'>{errors.idChuDe.message}</span>}
              </div>
            </div>
          </div>

          <div className='mt-2 mb-6'>
            <ScrollArea className='space-y-1 rounded-md'>
              <ChuongHocCarousel />
            </ScrollArea>
          </div>
        </div>

        <div className='absolute bottom-0 left-0 w-full flex gap-1 mb-2 px-2'>
          <Button
            type='submit'
            disabled={isLoadingAdd || isLoadingUpdate}
            className='bg-orange-500 hover:bg-orange-600 text-white flex-1 text-sm font-medium flex items-center justify-center gap-2'
          >
            {(isLoadingAdd || isLoadingUpdate) && <Loader2 className='animate-spin h-4 w-4' />}
            {khoaHocChiTiet?.idKhoaHoc ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>

          <Button
            type='button'
            variant='outline'
            className='flex-1 text-sm font-medium flex items-center justify-center gap-2'
            onClick={handleReset}
            disabled={isLoadingGetDetail || isLoadingAdd || isLoadingUpdate}
          >
            <X className='h-4 w-4' /> Xóa trắng
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
