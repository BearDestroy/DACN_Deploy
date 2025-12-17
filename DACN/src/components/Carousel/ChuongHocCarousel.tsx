import { useEffect, useState } from 'react'
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { ChuongHocFormData } from '@/validations/chuonghoc.schema'
import type { BaiHocFormData } from '@/validations/baihoc.schema'
import DeleteModal from '../Modal'
import { xoaBaiHoc, xoaChuongHoc } from '@/apis/khoahoc'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

type FormValues = {
  danhSachChuongHoc: ChuongHocFormData[]
}

export default function ChuongHocCarousel() {
  const [expanded, setExpanded] = useState<string[]>([])

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean
    type: 'chuong' | 'bai'
    idToDelete: number
    chapIndex: number
    baiIndex?: number
  }>({
    isOpen: false,
    type: 'chuong',
    idToDelete: 0,
    chapIndex: -1
  })

  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useFormContext<FormValues>()

  const { fields, append, remove } = useFieldArray({ control, name: 'danhSachChuongHoc' })
  const danhSachChuongHoc = watch('danhSachChuongHoc')

  // 2. HÀM TOGGLE MỚI: Xử lý mở/đóng độc lập
  const toggleChapter = (id: string) => {
    setExpanded((prev) => {
      if (prev.includes(id)) {
        // Nếu đang mở -> Đóng lại (loại bỏ khỏi mảng)
        return prev.filter((item) => item !== id)
      } else {
        // Nếu đang đóng -> Mở ra (thêm vào mảng)
        return [...prev, id]
      }
    })
  }

  const handleAddChapter = () => {
    const nextThuTu = (danhSachChuongHoc?.length || 0) + 1
    append({ idChuongHoc: null, thuTu: nextThuTu, tenChuongHoc: '', danhSachBaiHoc: [] })
  }

  const handleAddLesson = (chapterIndex: number) => {
    const currentLessons = getValues(`danhSachChuongHoc.${chapterIndex}.danhSachBaiHoc`) || []
    setValue(`danhSachChuongHoc.${chapterIndex}.danhSachBaiHoc`, [
      ...currentLessons,
      {
        idBaiHoc: null,
        thuTu: currentLessons.length + 1,
        tenBaiHoc: '',
        taiLieuKemTheo: null,
        tenTaiLieu: '',
        taiNguyenFile: null
      }
    ])
  }

  // 3. CẬP NHẬT USE EFFECT: Tự động mở chương đầu tiên (nếu chưa mở gì)
  useEffect(() => {
    if (fields.length > 0 && expanded.length === 0) {
      const firstId = fields[0].id
      if (firstId) {
        // setTimeout để tránh lỗi render cycle nếu cần
        setTimeout(() => {
          setExpanded([firstId])
        }, 0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]) // Chỉ chạy khi số lượng field thay đổi

  const removeLessonFromUI = (chapterIndex: number, lessonIndex: number) => {
    const currentLessons = getValues(`danhSachChuongHoc.${chapterIndex}.danhSachBaiHoc`) || []
    setValue(
      `danhSachChuongHoc.${chapterIndex}.danhSachBaiHoc`,
      currentLessons.filter((_, i) => i !== lessonIndex)
    )
  }

  const { mutate: deleteBaiHocMutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaBaiHoc(id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        if (deleteState.chapIndex !== -1 && deleteState.baiIndex !== undefined) {
          removeLessonFromUI(deleteState.chapIndex, deleteState.baiIndex)
        }
        setDeleteState((prev) => ({ ...prev, isOpen: false }))
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const { mutate: deleteChuongHocMutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaChuongHoc(id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        if (deleteState.chapIndex !== -1) {
          remove(deleteState.chapIndex)
        }
        setDeleteState((prev) => ({ ...prev, isOpen: false }))
      } else {
        showErrorToast({ message: data.message })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const handleDeleteClick = (chapIndex: number, baiIndex?: number) => {
    const currentChapter = danhSachChuongHoc[chapIndex]

    if (baiIndex !== undefined) {
      const bai = currentChapter.danhSachBaiHoc?.[baiIndex]
      if (bai?.idBaiHoc) {
        setDeleteState({
          isOpen: true,
          type: 'bai',
          idToDelete: bai.idBaiHoc,
          chapIndex: chapIndex,
          baiIndex: baiIndex
        })
      } else {
        removeLessonFromUI(chapIndex, baiIndex)
      }
    } else {
      if (currentChapter?.idChuongHoc) {
        setDeleteState({
          isOpen: true,
          type: 'chuong',
          idToDelete: currentChapter.idChuongHoc,
          chapIndex: chapIndex,
          baiIndex: undefined
        })
      } else {
        remove(chapIndex)
      }
    }
  }

  const handleConfirmDelete = () => {
    if (deleteState.type === 'chuong') {
      deleteChuongHocMutate({ id: deleteState.idToDelete })
    } else {
      deleteBaiHocMutate({ id: deleteState.idToDelete })
    }
  }

  return (
    <div className='space-y-2'>
      {fields.map((field, index) => {
        const chapterErrors = errors?.danhSachChuongHoc?.[index]
        const currentFieldData = danhSachChuongHoc?.[index] || field

        // Kiểm tra xem ID này có trong mảng expanded không
        const isExpanded = expanded.includes(field.id)

        return (
          <Collapsible
            key={field.id}
            open={isExpanded}
            // Khi collapsible tự thay đổi trạng thái (nếu có), gọi hàm toggle
            onOpenChange={() => toggleChapter(field.id)}
          >
            <div className='rounded-lg border border-gray-200 bg-white overflow-hidden'>
              <div
                className='flex justify-between items-center w-full px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer group gap-2'
                // Thêm onClick vào div cha để bấm vào header là toggle luôn (UX tốt hơn)
                onClick={() => toggleChapter(field.id)}
              >
                <div className='flex flex-col items-center' onClick={(e) => e.stopPropagation()}>
                  <label className='text-xs font-medium text-gray-700 mb-1'>
                    Thứ tự <span className='text-red-500'>*</span>
                  </label>
                  <Controller
                    name={`danhSachChuongHoc.${index}.thuTu`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        type='text'
                        {...f}
                        className='w-9 h-9 text-center text-xs rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-600 p-1.5 border-orange-500 focus:border-orange-500 font-medium focus:shadow-[0_0_16px_#fed7aa]'
                      />
                    )}
                  />
                </div>

                <div className='flex-1 flex flex-col' onClick={(e) => e.stopPropagation()}>
                  <label className='text-xs font-medium text-gray-700 mb-1'>
                    Tên chương <span className='text-red-500'>*</span>
                  </label>
                  <div className='flex items-center gap-2'>
                    <Controller
                      name={`danhSachChuongHoc.${index}.tenChuongHoc`}
                      control={control}
                      render={({ field: f }) => (
                        <Input
                          {...f}
                          className={`flex-1 px-0 bg-transparent focus:border-orange-500 focus:outline-none
            focus:shadow-[0_0_16px_#fed7aa] p-2 ${chapterErrors?.tenChuongHoc ? 'border-orange-500' : 'border-gray-300'}`}
                        />
                      )}
                    />
                    {chapterErrors?.tenChuongHoc && (
                      <span className='text-xs text-red-500'>{chapterErrors.tenChuongHoc.message}</span>
                    )}
                    <span className='text-xs text-gray-500'>({currentFieldData.danhSachBaiHoc?.length || 0} bài)</span>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    className='h-8.5 w-8.5 p-0 text-red-500 border-orange-500 hover:bg-red-50 mt-5'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(index)
                    }}
                  >
                    <X className='h-3 w-3' />
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className='h-8.5 w-8.5 p-0 text-orange-500 mt-5 border-red-500 hover:bg-red-50'
                    // Logic toggle nằm ở đây
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChapter(field.id)
                    }}
                  >
                    {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                  </Button>
                </div>
              </div>

              <CollapsibleContent className='px-4 pb-2 -mt-2'>
                {/* Nội dung bài học giữ nguyên không đổi */}
                <div className='space-y-1'>
                  {currentFieldData.danhSachBaiHoc?.map((bai: BaiHocFormData, baiIndex: number) => {
                    const baiErrors = chapterErrors?.danhSachBaiHoc?.[baiIndex]
                    return (
                      <div
                        key={bai.idBaiHoc || `new-lesson-${index}-${baiIndex}`}
                        className='flex justify-between items-center px-2 mb-1.5 rounded transition-colors group'
                      >
                        <div className='flex items-center gap-2 flex-1'>
                          <div className='flex flex-col items-center'>
                            <label className='text-xs font-medium text-gray-700 mb-1'>
                              Thứ tự <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                              name={`danhSachChuongHoc.${index}.danhSachBaiHoc.${baiIndex}.thuTu`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  type='text'
                                  {...f}
                                  className='w-9 h-9 text-center text-xs rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-600 p-1.5 border-orange-500 focus:border-orange-500 font-medium focus:shadow-[0_0_16px_#fed7aa]'
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            />
                          </div>

                          <div className='flex-1 flex flex-col'>
                            <label className='text-xs font-medium text-gray-700 mb-1'>
                              Tên bài học <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                              name={`danhSachChuongHoc.${index}.danhSachBaiHoc.${baiIndex}.tenBaiHoc`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  {...f}
                                  placeholder='Tên bài học...'
                                  className={`px-0 bg-transparent p-2 border ${
                                    baiErrors?.tenBaiHoc ? 'border-red-500' : 'border-gray-300'
                                  } focus:border-orange-500 focus:outline-none focus:shadow-[0_0_16px_#fed7aa]`}
                                />
                              )}
                            />
                            {baiErrors?.tenBaiHoc && (
                              <span className='text-xs text-red-500'>{baiErrors.tenBaiHoc.message}</span>
                            )}
                          </div>

                          <div className='flex-1 flex flex-col min-w-0'>
                            <label className='text-xs font-medium text-gray-700 mb-1'>
                              Video <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                              name={`danhSachChuongHoc.${index}.danhSachBaiHoc.${baiIndex}.taiNguyenFile`}
                              control={control}
                              render={({ field: f }) => (
                                <div className='relative w-full'>
                                  <Input
                                    type='file'
                                    accept='video/*'
                                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null
                                      f.onChange(file)
                                    }}
                                  />
                                  <div
                                    className='w-full h-9 px-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border border-gray-300 shadow rounded-md text-sm bg-white text-black overflow-hidden'
                                    title={typeof f.value === 'string' ? f.value : f.value?.name}
                                  >
                                    <span className='truncate text-left'>
                                      {f.value
                                        ? typeof f.value === 'string'
                                          ? f.value
                                          : f.value.name
                                        : 'Chọn video...'}
                                    </span>
                                    {f.value && (
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='relative z-20 text-red-500 hover:text-red-700 w-6 h-6'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          f.onChange(null)
                                        }}
                                      >
                                        <X className='w-4 h-4' />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <div className='flex gap-1.5'>
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            className='h-8.5 w-8.5 p-0 text-red-500 border-orange-500 hover:bg-red-50 mt-5'
                            onClick={() => handleDeleteClick(index, baiIndex)}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    className='w-full text-sm border-dashed hover:bg-orange-50 mt-2 border-orange-500'
                    onClick={() => handleAddLesson(index)}
                  >
                    <Plus className='h-3.5 w-3.5' /> Thêm bài học
                  </Button>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}

      <Button
        type='button'
        size='sm'
        variant='outline'
        className='w-full text-sm border-dashed hover:bg-orange-50 border-orange-500'
        onClick={handleAddChapter}
      >
        <Plus className='h-3.5 w-3.5' /> Thêm chương học
      </Button>

      <DeleteModal
        isOpen={deleteState.isOpen}
        setIsOpen={(open) => setDeleteState((prev) => ({ ...prev, isOpen: open }))}
        onConfirm={handleConfirmDelete}
        title={deleteState.type === 'chuong' ? 'Xóa chương học' : 'Xóa bài học'}
        description={`Bạn có chắc chắn muốn xóa ${deleteState.type === 'chuong' ? 'chương' : 'bài học'} này không? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
}
