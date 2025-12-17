import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, X, Star, ChevronsUpDownIcon, Check } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { duyetBaoCaoDanhGia, layChiTietBaoCaoDanhGia, suaLoaiBaoCaoDanhGia } from '@/apis/baocaodanhgia'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { formatDate } from '@/utils/function'
import type { BaoCaoDanhGiaChiTiet } from '@/@types/BaoCaoDanhGia'
import { Textarea } from '../ui/textarea'
import type { LoaiDanhGia } from '@/@types/LoaiDanhGia.type'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface Props {
  selectRowId: number | null
  setSelectRowId: (data: number | null) => void
  onSuccess?: () => void
  loaiDanhGia: LoaiDanhGia[]
  loadingDM: boolean
}

export default function BaoCaoDanhGiaForm({ selectRowId, setSelectRowId, onSuccess, loaiDanhGia, loadingDM }: Props) {
  const [baoCaoDetail, setBaoCaoDetail] = useState<BaoCaoDanhGiaChiTiet | null>(null)
  const [open, setOpen] = useState(false)
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<{ idLoaiBaoCao: number | null }>({
    defaultValues: {
      idLoaiBaoCao: baoCaoDetail?.idLoaiBaoCao ?? null
    }
  })

  // const { data: loaiDanhGias = [], isLoading: loadingDM } = useQuery({
  //   queryKey: ['loaidanhgias'],
  //   queryFn: async () => {
  //     const res = await layTatCaLoaiDanhGia()
  //     return res.data || []
  //   }
  // })

  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietBaoCaoDanhGia(id),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        setBaoCaoDetail(res.data ?? null)
        setValue('idLoaiBaoCao', res.data?.idLoaiBaoCao ?? null)
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'lỗi máy chủ' })
    }
  })

  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationFn: ({ id, idLoaiBaoCao }: { id: number; idLoaiBaoCao: number }) => suaLoaiBaoCaoDanhGia(id, idLoaiBaoCao),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  const { mutate: duyetMutate, isPending: isLoadingDuyet } = useMutation({
    mutationFn: (id: number) => duyetBaoCaoDanhGia(id),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
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
      reset({ idLoaiBaoCao: null })
    }
  }, [selectRowId, getDetailMutate, reset, setValue])

  useEffect(() => {
    if (baoCaoDetail?.idLoaiBaoCao != null) {
      setValue('idLoaiBaoCao', baoCaoDetail.idLoaiBaoCao)
    }
  }, [baoCaoDetail, setValue])

  const handleReset = () => {
    reset({ idLoaiBaoCao: null })
    setSelectRowId(null)
    setBaoCaoDetail(null)
  }

  const handleDuyet = () => {
    if (baoCaoDetail?.id) {
      // if(confirm("Bạn có chắc chắn muốn duyệt báo cáo này?"))
      duyetMutate(baoCaoDetail.id)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleDuyet)}>
      <div className='space-y-2 p-4 border rounded-md shadow-sm bg-white'>
        <div className='space-y-1'>
          <h4 className='text-lg font-semibold border-b pb-1'>Thông tin đánh giá</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Tên người đánh giá</Label>
              <Input value={baoCaoDetail?.tenNguoiDanhGia ?? ''} disabled />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Ngày đánh giá</Label>
              <Input value={formatDate(baoCaoDetail?.ngayDanhGia ?? '')} disabled />
            </div>

            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Số điểm đánh giá</Label>
              <div className='flex items-center gap-1'>
                {baoCaoDetail?.soDiemDanhGia != null
                  ? Array.from({ length: baoCaoDetail.soDiemDanhGia }, (_, i) => (
                      <Star key={i} className='h-5 w-5 fill-yellow-500 stroke-yellow-500' />
                    ))
                  : ''}
              </div>
            </div>
            <div className='col-span-1 md:col-span-2 flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Nội dung đánh giá</Label>
              <Textarea value={baoCaoDetail?.noiDungDanhGia ?? ''} disabled rows={3} />
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <h4 className='text-lg font-semibold border-b pb-1'>Thông tin báo cáo</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col space-y-2'>
              <Label className='text-sm font-medium'>Tên người báo cáo</Label>
              <Input value={baoCaoDetail?.tenNguoiBaoCaoDanhGia ?? ''} disabled />
            </div>
            <div className='flex flex-col space-y-1'>
              <Label className='text-sm font-medium'>Ngày báo cáo</Label>
              <Input value={formatDate(baoCaoDetail?.ngayBaoCao ?? '')} disabled />
            </div>
          </div>
          <div className='flex flex-col space-y-1 pt-2'>
            <Label className='text-sm font-medium'>Nội dung báo cáo</Label>
            <Textarea value={baoCaoDetail?.noiDungBaoCao ?? ''} disabled rows={3} />
          </div>
        </div>

        <div className='flex flex-col'>
          <Label className='text-sm font-medium'>
            Loại báo cáo <span className='text-red-500'>*</span>
          </Label>

          <Controller
            control={control}
            name='idLoaiBaoCao'
            rules={{ required: 'Vui lòng chọn loại báo cáo' }}
            render={({ field }) => {
              const selected = loaiDanhGia.find((x) => x.id === Number(field.value))
              return (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className={`w-full justify-between mt-2 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                        errors.idLoaiBaoCao
                          ? 'border-red-600 border-2 shadow-[0_0_8px_rgba(255,100,50,0.5)]'
                          : 'border-gray-300 border'
                      }`}
                      disabled={loadingDM}
                    >
                      {loadingDM ? 'Đang tải...' : selected ? selected.tenLoaiDanhGia : 'Chọn loại báo cáo'}

                      <ChevronsUpDownIcon className='opacity-50' />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className='w-86 p-0'>
                    <Command>
                      <CommandInput placeholder='Tìm loại báo cáo…' className='h-9' />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy loại báo cáo.</CommandEmpty>

                        <CommandGroup>
                          {loaiDanhGia.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={item.tenLoaiDanhGia}
                              onSelect={() => {
                                field.onChange(item.id)
                                setOpen(false)
                              }}
                              className={`cursor-pointer ${
                                selected?.id === item.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'
                              }`}
                            >
                              {item.tenLoaiDanhGia}

                              <Check
                                className={`ml-auto text-orange-500 ${
                                  selected?.id === item.id ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )
            }}
          />

          {errors.idLoaiBaoCao && <p className='text-red-600 text-base mt-1'>{errors.idLoaiBaoCao.message}</p>}
        </div>

        <div className='flex gap-3 mt-3'>
          <Button
            type='button'
            disabled={!baoCaoDetail || isLoadingDuyet}
            onClick={() => baoCaoDetail && duyetMutate(baoCaoDetail.id)}
            className='bg-orange-500 hover:bg-orange-600 text-white flex-1 text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {isLoadingDuyet && <Loader2 className='animate-spin h-4 w-4' />}
            Duyệt
          </Button>

          <Button
            type='button'
            disabled={!baoCaoDetail?.id || getValues('idLoaiBaoCao') == null || isLoadingUpdate}
            onClick={() => {
              const idLoaiBaoCao = getValues('idLoaiBaoCao')
              if (baoCaoDetail?.id && idLoaiBaoCao != null) {
                updateMutate({
                  id: baoCaoDetail.id,
                  idLoaiBaoCao
                })
              }
            }}
            className='bg-blue-500 hover:bg-blue-600 text-white flex-1 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2'
          >
            {isLoadingUpdate && <Loader2 className='animate-spin h-4 w-4' />}
            Sửa
          </Button>

          <Button
            type='button'
            variant='outline'
            className='flex-1 text-sm font-medium'
            onClick={handleReset}
            disabled={isLoadingGetDetail || isLoadingDuyet || isLoadingUpdate}
          >
            <X className='h-4 w-4 mr-1' /> Xóa trắng
          </Button>
        </div>
      </div>
    </form>
  )
}
