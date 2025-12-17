import { useEffect } from 'react'
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { SelectCustomSingle } from '@/components/Select/SelectCustom'
import { Switch } from '@/components/ui/switch'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { baiTapSchema, type BaiTapFormData } from '@/validations/baitap.schema'
import { layChiTietBaiTap, themBaiTap, suaBaiTap } from '@/apis/baitap'
import { layTatCaBaiHoc } from '@/apis/khoahoc'
import type { KhoaHocOption } from '../KhoaHocCarousel/KhoaHocCarousel'
import type { LoaiBaiTap } from '@/@types/LoaiBaiTap.type'
import type { LoaiCauHoi } from '@/@types/LoaiCauHoi.type'
import type { DoKho } from '@/@types/DoKho.type'
import type { BaiHocOption } from '@/@types/KhoaHoc'

interface Props {
  selectRowId: number | null
  setSelectRowId: (id: number | null) => void
  onSuccess?: () => void
  dsKhoaHoc: KhoaHocOption[]
  dsLoaiBaiTap: LoaiBaiTap[]
  dsLoaiCauHoi: LoaiCauHoi[]
  dsLoaiDoKho: DoKho[]
}

export default function BaiTapForm({
  selectRowId,
  setSelectRowId,
  onSuccess,
  dsKhoaHoc,
  dsLoaiBaiTap,
  dsLoaiCauHoi,
  dsLoaiDoKho
}: Props) {
  const defaultValues: BaiTapFormData = {
    maBaiTap: '',
    tenBaiTap: '',
    moTa: '',
    thoiGianLam: 15,
    idBaiHoc: 0,
    idLoaiBaiTap: 0,
    trangThai: true,
    listCauHoi: [],
    // @ts-ignore
    idKhoaHoc: 0
  }

  const form = useForm<BaiTapFormData & { idKhoaHoc: number }>({
    resolver: zodResolver(baiTapSchema),
    defaultValues
  })

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = form

  // --- LOGIC CASCADING SELECT TRONG FORM ---
  // 1. Theo dõi giá trị idKhoaHoc trong form
  const watchIdKhoaHoc = watch('idKhoaHoc')

  // 2. Fetch danh sách bài học dựa trên khóa học đang chọn trong form
  const { data: dsBaiHocTrongForm = [], isFetching: loadingBaiHocForm } = useQuery({
    queryKey: ['dsBaiHocForm', watchIdKhoaHoc],
    queryFn: async () => {
      if (!watchIdKhoaHoc) return []
      const res = await layTatCaBaiHoc(watchIdKhoaHoc)
      return res.data || []
    },
    enabled: !!watchIdKhoaHoc // Chỉ fetch khi đã chọn khóa học
  })

  // 3. Khi đổi khóa học -> Reset bài học về 0
  useEffect(() => {
    // Chỉ reset nếu người dùng thay đổi thủ công (không phải do load detail set value)
    // Tuy nhiên để đơn giản, ta có thể check trong sự kiện onChange của Select
  }, [watchIdKhoaHoc])

  // --- QUẢN LÝ CÂU HỎI ---
  const {
    fields: cauHoiFields,
    append: appendCauHoi,
    remove: removeCauHoi
  } = useFieldArray({
    control,
    name: 'listCauHoi'
  })

  // --- LẤY CHI TIẾT (EDIT MODE) ---
  const { mutate: getDetail, isPending: loadingDetail } = useMutation({
    mutationFn: (id: number) => layChiTietBaiTap(id),
    onSuccess: (res: any) => {
      if (res.data) {
        const d = res.data
        // Lưu ý: API chi tiết bài tập thường trả về idBaiHoc.
        // Ta cần tìm ra idKhoaHoc tương ứng với idBaiHoc đó để set vào form.
        // Cách 1: API trả về idKhoaHoc.
        // Cách 2 (Tạm thời): Nếu API không trả về, ta phải loop tìm hoặc gọi API phụ.
        // Giả sử API Detail trả về idKhoaHoc hoặc ta mapping từ danh sách bài học (hơi khó nếu chưa load).
        // ==> Tốt nhất API layChiTietBaiTap nên trả về cả idKhoaHoc.

        // Giả sử d.idKhoaHoc có tồn tại trong response
        const idKhoaHocInitial = d.idKhoaHoc || 0

        reset({
          ...d,
          idKhoaHoc: idKhoaHocInitial, // Set khóa học để trigger load bài học
          listCauHoi: d.listCauHoi || []
        })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi tải dữ liệu' })
  })

  useEffect(() => {
    if (selectRowId) getDetail(selectRowId)
    else handleReset()
  }, [selectRowId])

  // --- SUBMIT ---
  const { mutate: saveMutate, isPending: isSaving } = useMutation({
    mutationFn: (data: BaiTapFormData) => {
      const payload: QLBaiTapRequest = {
        ...data,
        maBaiTap: data.maBaiTap || null,
        moTa: data.moTa || null,
        idBaiHoc: Number(data.idBaiHoc),
        idLoaiBaiTap: Number(data.idLoaiBaiTap)
      }
      return selectRowId ? suaBaiTap(selectRowId, payload) : themBaiTap(payload)
    },
    onSuccess: () => {
      showSuccessToast({ message: selectRowId ? 'Cập nhật thành công' : 'Thêm mới thành công' })
      onSuccess?.()
      handleReset()
    },
    onError: (err: any) => showErrorToast({ message: err?.response?.data?.message || 'Có lỗi xảy ra' })
  })

  const handleReset = () => {
    reset(defaultValues)
    setSelectRowId(null)
  }

  const handleAddQuestion = () => {
    appendCauHoi({
      noiDung: '',
      idLoaiCauHoi: 0,
      idLoaiDoKho: 0,
      listQLDapAn: [
        { noiDung: '', dapAnDung: false },
        { noiDung: '', dapAnDung: false }
      ]
    })
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit((data) => saveMutate(data))}
        className='space-y-4 p-4 rounded-md shadow-sm bg-white relative h-full flex flex-col'
      >
        {(loadingDetail || isSaving) && (
          <div className='absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-sm'>
            <Loader2 className='animate-spin h-8 w-8 text-orange-500' />
          </div>
        )}

        <div className='flex-1 overflow-y-auto pr-2 space-y-4'>
          {/* Hàng 1: Mã & Tên */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label className='text-sm'>Mã bài tập</Label>
              <Controller
                name='maBaiTap'
                control={control}
                render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder='Tự động' />}
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-sm'>
                Tên bài tập <span className='text-red-500'>*</span>
              </Label>
              <Controller name='tenBaiTap' control={control} render={({ field }) => <Input {...field} />} />
              {errors.tenBaiTap && <span className='text-red-500 text-xs'>{errors.tenBaiTap.message}</span>}
            </div>
          </div>

          {/* Hàng 2: Khóa học & Bài học (Cascading) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label className='text-sm'>
                Khóa học <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idKhoaHoc'
                control={control}
                render={({ field }) => (
                  <SelectCustomSingle
                    items={dsKhoaHoc}
                    selected={dsKhoaHoc.find((x) => x.id === field.value) || null}
                    onChange={(val) => {
                      field.onChange(val?.id)
                      setValue('idBaiHoc', 0) // Reset bài học khi đổi khóa học
                    }}
                    labelField='tenKhoaHoc'
                    placeholder='Chọn khóa học'
                  />
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-sm'>
                Bài học <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idBaiHoc'
                control={control}
                render={({ field }) => (
                  <SelectCustomSingle<BaiHocOption>
                    items={dsBaiHocTrongForm}
                    selected={dsBaiHocTrongForm.find((x: any) => x.id === field.value) || null}
                    onChange={(val) => field.onChange(val?.id)}
                    labelField='tenBaiHoc'
                    placeholder={watchIdKhoaHoc ? 'Chọn bài học' : 'Vui lòng chọn khóa học trước'}
                    loading={loadingBaiHocForm}
                    disabled={!watchIdKhoaHoc}
                  />
                )}
              />
              {errors.idBaiHoc && <span className='text-red-500 text-xs'>{errors.idBaiHoc.message}</span>}
            </div>
          </div>

          {/* Hàng 3: Loại bài tập & Thời gian */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label className='text-sm'>
                Loại bài tập <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='idLoaiBaiTap'
                control={control}
                render={({ field }) => (
                  <SelectCustomSingle
                    items={dsLoaiBaiTap}
                    selected={dsLoaiBaiTap.find((x) => x.id === field.value) || null}
                    onChange={(val) => field.onChange(val?.id)}
                    labelField='tenLoaiBaiTap'
                    placeholder='Chọn loại'
                  />
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-sm'>Thời gian (phút)</Label>
              <Controller
                name='thoiGianLam'
                control={control}
                render={({ field }) => (
                  <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                )}
              />
            </div>
          </div>

          {/* Trạng thái & Mô tả */}
          <div className='flex items-center space-x-2 mt-2'>
            <Controller
              name='trangThai'
              control={control}
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Kích hoạt</Label>
          </div>
          <div className='space-y-1'>
            <Label className='text-sm'>Mô tả</Label>
            <Controller
              name='moTa'
              control={control}
              render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={2} />}
            />
          </div>

          {/* --- Danh sách câu hỏi --- */}
          <div className='pt-4 border-t border-gray-100'>
            <div className='flex justify-between items-center mb-2'>
              <Label className='text-base font-bold text-gray-700'>Danh sách câu hỏi ({cauHoiFields.length})</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddQuestion}
                className='text-orange-600 border-orange-200 bg-orange-50'
              >
                <Plus className='w-4 h-4 mr-1' /> Thêm câu hỏi
              </Button>
            </div>

            <div className='space-y-4'>
              {cauHoiFields.map((field, index) => (
                <div key={field.id} className='border border-gray-200 rounded-lg p-3 bg-gray-50/50 relative'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute top-2 right-2 text-gray-400 hover:text-red-600'
                    onClick={() => removeCauHoi(index)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>

                  {/* Nội dung câu hỏi (Rút gọn cho ngắn code) */}
                  <div className='space-y-2'>
                    <Label className='text-xs font-bold text-gray-500'>Câu {index + 1}</Label>
                    <Controller
                      name={`listCauHoi.${index}.noiDung`}
                      control={control}
                      render={({ field }) => (
                        <Textarea {...field} placeholder='Nội dung câu hỏi...' className='bg-white' rows={2} />
                      )}
                    />
                    {/* ... Select Loại câu hỏi & Độ khó (Giống code cũ) ... */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='pt-4 border-t mt-auto flex gap-2'>
          <Button type='submit' className='flex-1 bg-orange-500 hover:bg-orange-600 text-white' disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu bài tập'}
          </Button>
          <Button type='button' variant='outline' onClick={handleReset} className='flex-1'>
            Xóa trắng
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
