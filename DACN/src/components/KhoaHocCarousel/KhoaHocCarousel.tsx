import { useState } from 'react'
import { useFormContext, Controller, useFieldArray, useWatch } from 'react-hook-form'
import { X, Plus, Clock, BookOpen, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SelectCustomSingle } from '@/components/Select/SelectCustom'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { xoaKhoaHocTrongLoTrinh } from '@/apis/loTrinhHoc'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { formatTime } from '@vidstack/react'

export type KhoaHocOption = {
  id: number
  tenKhoaHoc: string
  tenGiangVien?: string
  thoiLuong?: number
  soBaiHoc?: number
}

type Props = {
  danhSachOption: KhoaHocOption[]
  loading?: boolean
}

export default function LoTrinhHocCarousel({ danhSachOption, loading }: Props) {
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    idToDelete: 0,
    index: -1
  })

  const {
    control,
    formState: { errors }
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'danhSachKhoaHoc'
  })

  const watchedKhoaHocList = useWatch({
    control,
    name: 'danhSachKhoaHoc',
    defaultValue: []
  })

  const getFieldError = (index: number) => {
    const e = errors?.danhSachKhoaHoc
    if (Array.isArray(e) && e[index]?.idKhoaHoc) {
      return e[index]?.idKhoaHoc
    }
    return null
  }

  const handleAddKhoaHoc = () => {
    append({
      idKhoaHoc: null,
      thuTu: fields.length + 1,
      idKhoaHocLoTrinh: 0
    })
  }

  const { mutate: deleteKhoaHocMutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaKhoaHocTrongLoTrinh(id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        if (deleteState.index !== -1) remove(deleteState.index)
        setDeleteState({ isOpen: false, idToDelete: 0, index: -1 })
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const confirmDelete = () => {
    if (deleteState.idToDelete > 0) {
      deleteKhoaHocMutate({ id: deleteState.idToDelete })
    }
  }

  const handleDeleteClick = (index: number, idKhoaHocLoTrinh: number) => {
    if (idKhoaHocLoTrinh > 0) {
      setDeleteState({
        isOpen: true,
        idToDelete: idKhoaHocLoTrinh,
        index
      })
    } else {
      remove(index)
    }
  }

  return (
    <div className='space-y-4 pb-10'>
      {fields.map((field, index) => {
        const currentVal = watchedKhoaHocList?.[index]
        const selectedCourse = danhSachOption?.find((k) => k.id == currentVal?.idKhoaHoc)

        const fieldError = getFieldError(index)

        return (
          <div
            key={field.id}
            className='group relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200'
          >
            <div className='flex items-start gap-3'>
              {/* Cột Thứ tự */}
              <div className='w-14 flex-shrink-0'>
                <Controller
                  name={`danhSachKhoaHoc.${index}.thuTu`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, ...restField } }) => (
                    <div className='flex flex-col gap-1'>
                      <label className='text-[10px] font-semibold text-black uppercase'>Thứ tự</label>
                      <Input
                        {...restField}
                        type='text'
                        inputMode='numeric'
                        className='h-9 text-center font-bold text-black bg-gray-50 border-gray-200 focus:border-orange-500'
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '' || /^\d+$/.test(val)) onChange(val)
                        }}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Cột Select Khóa học */}
              <div className='flex-1'>
                <Controller
                  name={`danhSachKhoaHoc.${index}.idKhoaHoc`}
                  control={control}
                  rules={{ required: 'Vui lòng chọn khóa học' }}
                  render={({ field }) => (
                    <div className='flex flex-col gap-1'>
                      <label className='text-[10px] font-semibold text-black uppercase'>
                        Khóa học <span className='text-red-500'>*</span>
                      </label>

                      <SelectCustomSingle
                        items={danhSachOption} // Truyền danh sách Option vào đây
                        selected={danhSachOption?.find((c) => c.id == field.value) || null}
                        onChange={(item) => field.onChange(item?.id)}
                        labelField='tenKhoaHoc'
                        placeholder='-- Chọn khóa học --'
                        loading={loading}
                        errors={!!fieldError}
                      />

                      {fieldError && (
                        <span className='text-[10px] text-red-500 font-medium ml-1'>{fieldError.message}</span>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Cột Xóa */}
              <div className='flex flex-col gap-1'>
                <label className='text-[10px] font-semibold uppercase opacity-0 select-none'>Xóa</label>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='h-9 w-9 border-orange-500 text-red-500 hover:bg-red-50 hover:text-red-600'
                  onClick={() => handleDeleteClick(index, currentVal?.idKhoaHocLoTrinh)}
                  title='Xóa khỏi lộ trình'
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Thông tin chi tiết khóa học (Hiển thị dựa trên selectedCourse tìm được từ danhSachOption) */}
            <div className='mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3'>
              <InfoField
                label='Giảng viên'
                value={selectedCourse?.tenGiangVien}
                icon={<User className='absolute right-2.5 top-2.5 h-4 w-4 text-black' />}
              />

              <InfoField
                label='Thời lượng'
                value={formatTime(selectedCourse?.thoiLuong ?? 0)}
                icon={<Clock className='absolute right-2.5 top-2.5 h-4 w-4 text-black' />}
              />

              <InfoField
                label='Số bài học'
                value={selectedCourse?.soBaiHoc ? `${selectedCourse.soBaiHoc} bài` : ''}
                icon={<BookOpen className='absolute right-2.5 top-2.5 h-4 w-4 text-black' />}
              />
            </div>
          </div>
        )
      })}

      {/* Nút thêm mới */}
      <div className='pt-2'>
        <Button
          type='button'
          variant='outline'
          className='w-full border-dashed border-gray-300 text-black hover:border-orange-500 hover:text-orange-600 h-11'
          onClick={handleAddKhoaHoc}
        >
          <Plus className='h-4 w-4 mr-2' /> Thêm khóa học
        </Button>
      </div>

      <DeleteModal
        isOpen={deleteState.isOpen}
        setIsOpen={(open) => setDeleteState((prev) => ({ ...prev, isOpen: open }))}
        onConfirm={confirmDelete}
        title='Xóa khóa học'
        description='Bạn có chắc chắn muốn xóa khóa học này khỏi lộ trình không?'
      />
    </div>
  )
}

function InfoField({ label, value, icon }: { label: string; value?: string | number | null; icon: React.ReactNode }) {
  return (
    <div className='space-y-1'>
      <label className='text-[10px] font-semibold text-black uppercase'>{label}</label>
      <div className='relative'>
        <Input
          readOnly
          disabled
          value={value || ''}
          placeholder='...'
          className='h-9 bg-gray-50 text-black border-gray-200 pr-8 cursor-not-allowed'
        />
        {icon}
      </div>
    </div>
  )
}
