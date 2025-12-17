import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, X, Check, ChevronsUpDownIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import type { LoaiDanhGia } from '@/@types/LoaiDanhGia.type'
import type { BaoCaoKhoaHocChiTiet } from '@/@types/BaoCaoKhoaHoc'
import { duyetBaoCaoKhoaHoc, layChiTietBaoCaoKhoaHoc, suaBaoCaoKhoaHoc } from '@/apis/baocaokhoahoc'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
  loaiDanhGia: LoaiDanhGia[]
  loadingDM: boolean
}

export default function BaoCaoKhoaHocForm({ selectRowId, setSelectRowId, onSuccess, loaiDanhGia, loadingDM }: Props) {
  const [baoCaoDetail, setBaoCaoDetail] = useState<BaoCaoKhoaHocChiTiet | null>(null)
  const [open, setOpen] = useState(false)
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<{ idLoaiBaoCao: number | null }>({
    defaultValues: { idLoaiBaoCao: baoCaoDetail?.idLoaiBaoCao ?? null }
  })

  const { mutate: duyetMutate, isPending: isLoadingDuyet } = useMutation({
    mutationFn: (id: number) => duyetBaoCaoKhoaHoc(id),
    onSuccess: () => {
      showSuccessToast({ message: 'Duyệt thành công' })
      onSuccess?.()
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const { mutate: updateMutate, isPending: isLoadingUpdate } = useMutation({
    mutationFn: ({ id, idLoaiBaoCao }: { id: number; idLoaiBaoCao: number }) => suaBaoCaoKhoaHoc(id, idLoaiBaoCao),
    onSuccess: () => {
      showSuccessToast({ message: 'Cập nhật thành công' })
      onSuccess?.()
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })
  const { mutate: getDetailMutate, isPending: isLoadingGetDetail } = useMutation({
    mutationFn: ({ id }: { id: number }) => layChiTietBaoCaoKhoaHoc(id),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        setBaoCaoDetail(res.data ?? null)
        setValue('idLoaiBaoCao', res.data?.idLoaiBaoCao ?? null)
        showSuccessToast({ message: res.message })
        onSuccess?.()
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'lỗi máy chủ' })
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
      duyetMutate(baoCaoDetail.id)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleDuyet)} className='space-y-1'>
      <div className='space-y-4 p-4  rounded-md shadow-sm'>
        {baoCaoDetail?.anhDaiDienUrl && (
          <div className='flex justify-center mb-4'>
            <img
              src={'1.55.203.158:5154' + baoCaoDetail.anhDaiDienUrl}
              alt='Ảnh đại diện'
              className='h-32 w-32 object-cover rounded-md border'
            />
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
          <div className='flex flex-col space-y-1 md:col-span-2'>
            <Label className='text-sm font-medium'>Tên khóa học</Label>
            <Input value={baoCaoDetail?.tenKhoaHoc ?? ''} disabled />
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Mã khóa học</Label>
            <Input value={baoCaoDetail?.maKhoaHoc ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Tên giảng viên</Label>
            <Input value={baoCaoDetail?.tenGiangVien ?? ''} disabled />
          </div>

          <div className='flex flex-col space-y-1 md:col-span-2'>
            <Label className='text-sm font-medium'>Mô tả ngắn</Label>
            <Textarea value={baoCaoDetail?.moTaNgan ?? ''} disabled rows={2} />
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Mục đích</Label>
            <Input value={baoCaoDetail?.tenMucDich ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Đánh giá trung bình</Label>
            <Input value={`${baoCaoDetail?.soDiemTrungBinh ?? ''} / ${baoCaoDetail?.soLuongDanhGia ?? ''}`} disabled />
          </div>

          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Nghề nghiệp</Label>
            <Input value={baoCaoDetail?.tenNgheNghiep ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Trình độ</Label>
            <Input value={baoCaoDetail?.tenTrinhDo ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Tên người báo cáo</Label>
            <Input value={baoCaoDetail?.tenNguoiBaoCaoKhoaHoc ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1'>
            <Label className='text-sm font-medium'>Ngày báo cáo</Label>
            <Input value={baoCaoDetail?.ngayBaoCao ?? ''} disabled />
          </div>
          <div className='flex flex-col space-y-1 md:col-span-2'>
            <Label className='text-sm font-medium'>Nội dung báo cáo</Label>
            <Textarea value={baoCaoDetail?.noiDungBaoCao ?? ''} disabled rows={2} />
          </div>
          <div className='flex flex-col md:flex-row gap-3 mt-2 items-end'>
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
                        className={`w-full justify-between rounded-md border px-3 py-2 ${errors.idLoaiBaoCao ? 'border-red-600' : 'border-gray-300'}`}
                        disabled={loadingDM}
                      >
                        {loadingDM ? 'Đang tải...' : (selected?.tenLoaiDanhGia ?? 'Chọn loại báo cáo')}
                        <ChevronsUpDownIcon className='opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 p-0'>
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
                                className={`cursor-pointer ${selected?.id === item.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'}`}
                              >
                                {item.tenLoaiDanhGia}
                                <Check
                                  className={`ml-auto text-orange-500 ${selected?.id === item.id ? 'opacity-100' : 'opacity-0'}`}
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
          </div>
        </div>
      </div>

      {/* Loại báo cáo + 3 nút */}

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
    </form>
  )
}
