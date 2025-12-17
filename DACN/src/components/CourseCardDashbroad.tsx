import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { KhoaHocNguoiDung } from '@/@types/KhoaHoc'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChonSaoDanhGia } from './common/ChonSaoDanhGia'
import { useHoctap } from '@/hooks/useHocTap'
import { useForm } from 'react-hook-form'
import { danhGiaSchema, type DanhGiaRequest } from '@/validations/danhgia.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { suaDanhGia, themDanhGia, xoaDanhGia } from '@/apis/danhgia'

interface CourseCardProps {
  course: KhoaHocNguoiDung
}

export function CourseCardDashboard({ course }: CourseCardProps) {
  const lessonsCompleted = course.tiLeHoanThanh || 0
  const rating = course.danhGiaTrungBinh || 0
  const reviewCount = course.tongSoDanhGia || 0
  const daDanhGia = !!course.daDanhGia
  const hoanThanhMotBai = course.hoanThanhMotBai

  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { loadKhoaHocDaGhiDanh } = useHoctap()

  const handleSuccess = () => {
    try {
      loadKhoaHocDaGhiDanh()
    } catch (error) {
      console.error('Lỗi khi tải lại danh sách khóa học:', error)
    }
  }

  return (
    <>
      <Card className='h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 border-slate-200 group'>
        <div className='w-full bg-muted'>
          <AspectRatio ratio={16 / 9}>
            <Link to={`/hoc-tap/${course.idKhoaHoc}`}>
              <img
                src={'1.55.203.158:5154' + course.hinhDaiDien || 'https://via.placeholder.com/800x450'}
                alt={course.tenKhoaHoc}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </Link>
          </AspectRatio>
        </div>

        <CardHeader className='p-4 pb-2 space-y-1'>
          <CardTitle className='text-base font-bold line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-[#FF5722] transition-colors'>
            {course.tenKhoaHoc}
          </CardTitle>
          <CardDescription className='text-xs line-clamp-1'>{course.tenGiangVien}</CardDescription>
        </CardHeader>

        <CardContent className='p-4 pt-0 flex-1 flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <ChonSaoDanhGia rating={rating} onChange={() => {}} size={14} />
            <span className='text-xs text-muted-foreground'>({reviewCount})</span>
          </div>
          <div className='mt-auto space-y-1.5'>
            {lessonsCompleted >= 0 && (
              <>
                <Progress value={lessonsCompleted} className='h-2 bg-slate-100' />
                <p className='text-[10px] text-muted-foreground text-right font-medium'>
                  {lessonsCompleted}% hoàn thành
                </p>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className='p-4 pt-0 mt-auto'>
          {/* LOGIC HIỂN THỊ NÚT */}
          {!hoanThanhMotBai ? (
            // Trường hợp 1: Chưa hoàn thành bài nào -> Hiện nút Bắt đầu học
            <Button asChild className='w-full font-bold text-xs' size='sm'>
              <Link to={`/hoc-tap/${course.idKhoaHoc}`}>Bắt đầu học ngay</Link>
            </Button>
          ) : (
            // Trường hợp 2: Đã học ít nhất 1 bài -> Hiện cụm chức năng Đánh giá
            <div className='w-full grid grid-cols-2 gap-2'>
              {!daDanhGia ? (
                // Chưa đánh giá -> Hiện nút Viết đánh giá
                <Button
                  variant='secondary'
                  size='sm'
                  className='col-span-2 w-full font-bold text-xs text-[#FF5722] hover:bg-[#FF5722]/10'
                  onClick={() => setShowRatingModal(true)}
                >
                  Viết đánh giá
                </Button>
              ) : (
                // Đã đánh giá -> Hiện Sửa/Xóa
                <>
                  <Button variant='outline' size='sm' className='text-xs h-8' onClick={() => setShowRatingModal(true)}>
                    Sửa
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='text-xs h-8'
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Xóa
                  </Button>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      <RatingDialog
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        course={course}
        onSuccess={handleSuccess}
      />

      <DeleteDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        course={course}
        onSuccess={handleSuccess}
      />
    </>
  )
}

// ==========================================
// SUB-COMPONENT: MODAL ĐÁNH GIÁ (THÊM/SỬA)
// ==========================================

interface RatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: KhoaHocNguoiDung
  onSuccess: () => void
}

function RatingDialog({ open, onOpenChange, course, onSuccess }: RatingDialogProps) {
  const daDanhGia = !!course.daDanhGia

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<DanhGiaRequest>({
    resolver: zodResolver(danhGiaSchema),
    defaultValues: {
      idKhoaHoc: course.idKhoaHoc,
      soDiemDanhGia: 0,
      noiDungDanhGia: ''
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        idKhoaHoc: course.idKhoaHoc,
        soDiemDanhGia: course.daDanhGia?.soDiemDanhGia || 0,
        noiDungDanhGia: course.daDanhGia?.loiDanhGia || ''
      })
    }
  }, [open, course, reset])

  const ratingValue = watch('soDiemDanhGia')
  const mutationFn = daDanhGia ? suaDanhGia : themDanhGia

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DanhGiaRequest) => mutationFn(data),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: daDanhGia ? 'Cập nhật đánh giá thành công' : 'Đánh giá thành công' })
        onSuccess()
        onOpenChange(false)
      } else {
        showErrorToast({ message: res.message || 'Có lỗi xảy ra' })
      }
    },
    onError: (err) => {
      console.error('Lỗi đánh giá:', err)
    }
  })

  const onSubmit = (data: DanhGiaRequest) => {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] '>
        <DialogHeader>
          <DialogTitle>{daDanhGia ? 'Chỉnh sửa đánh giá' : 'Đánh giá khóa học'}</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về khóa học <span className='font-semibold'>{course.tenKhoaHoc}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
          <div className='flex flex-col items-center gap-3'>
            <Label className='text-sm font-medium'>Mức độ hài lòng</Label>
            <ChonSaoDanhGia
              rating={ratingValue}
              onChange={(val) => setValue('soDiemDanhGia', val, { shouldValidate: true })}
              size={32}
            />
            {errors.soDiemDanhGia && <p className='text-red-500 text-xs mt-1'>{errors.soDiemDanhGia.message}</p>}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='noiDungDanhGia'>Nhận xét chi tiết</Label>
            <Textarea
              id='noiDungDanhGia'
              {...register('noiDungDanhGia')}
              placeholder='Bạn cảm thấy nội dung khóa học như thế nào?'
              className='min-h-[120px] resize-none'
            />
            {errors.noiDungDanhGia && <p className='text-red-500 text-xs mt-1'>{errors.noiDungDanhGia.message}</p>}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button type='submit' disabled={ratingValue === 0 || isPending}>
              {daDanhGia ? 'Cập nhật' : 'Gửi đánh giá'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: KhoaHocNguoiDung
  onSuccess: () => void
}

function DeleteDialog({ open, onOpenChange, course, onSuccess }: DeleteDialogProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => xoaDanhGia(course.idKhoaHoc),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: 'Xóa đánh giá thành công' })
        onSuccess()
        onOpenChange(false)
      } else {
        showErrorToast({ message: res.message || 'Xóa thất bại' })
      }
    },
    onError: (err) => {
      console.error('Lỗi xóa đánh giá:', err)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa đánh giá</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa đánh giá cho khóa học <span className='font-semibold'>{course.tenKhoaHoc}</span>{' '}
            không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button variant='destructive' onClick={() => mutate()} disabled={isPending}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
