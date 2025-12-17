import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, CheckCircle2, PlayCircle, List, Star, Trash2, Edit } from 'lucide-react'

import type { KhoaHocNguoiDung } from '@/@types/KhoaHoc'
import type { LoTrinhNguoiDung } from '@/@types/LoTrinhHoc'
import { useHoctap } from '@/hooks/useHocTap'
import { suaDanhGia, themDanhGia, xoaDanhGia } from '@/apis/danhgia'
import { danhGiaSchema, type DanhGiaRequest } from '@/validations/danhgia.schema'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChonSaoDanhGia } from './common/ChonSaoDanhGia'

interface LoTrinhHocCardDashboardProps {
  loTrinh: LoTrinhNguoiDung
}

export function LoTrinhHocCardDashboard({ loTrinh }: LoTrinhHocCardDashboardProps) {
  const { tenLoTrinh, tiLeHoanThanh, hinhAnh, danhSachKhoaHoc } = loTrinh
  const { loadKhoaHocDaGhiDanh } = useHoctap()

  const handleRefresh = () => {
    try {
      loadKhoaHocDaGhiDanh()
    } catch (error) {
      console.error('Lỗi khi tải lại danh sách:', error)
    }
  }

  // Tìm khóa học đang học dở hoặc khóa học chưa học đầu tiên
  const nextCourse = useMemo(() => {
    if (!danhSachKhoaHoc || danhSachKhoaHoc.length === 0) return null
    const inProgress = danhSachKhoaHoc.find((c) => (c.tiLeHoanThanh || 0) > 0 && (c.tiLeHoanThanh || 0) < 100)
    if (inProgress) return inProgress
    const notStarted = danhSachKhoaHoc.find((c) => (c.tiLeHoanThanh || 0) === 0)
    return notStarted || danhSachKhoaHoc[danhSachKhoaHoc.length - 1]
  }, [danhSachKhoaHoc])

  const completedCount = useMemo(() => {
    return danhSachKhoaHoc?.filter((c) => (c.tiLeHoanThanh || 0) === 100).length || 0
  }, [danhSachKhoaHoc])

  const totalCount = danhSachKhoaHoc?.length || 0

  return (
    <Sheet>
      <Card className='group h-full flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white'>
        {/* 1. HEADER: Thông tin chung */}
        <CardHeader className='p-0'>
          <div className='relative h-24 bg-linear-to-r from-slate-100 to-slate-50'>
            {hinhAnh && (
              <div className='absolute inset-0 opacity-10'>
                <img src={'1.55.203.158:5154' + hinhAnh} alt='' className='w-full h-full object-cover' />
              </div>
            )}
            <div className='absolute -bottom-6 left-5'>
              <div className='w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-100 p-1 flex items-center justify-center'>
                {hinhAnh ? (
                  <img
                    src={'1.55.203.158:5154' + hinhAnh}
                    alt='icon'
                    className='w-full h-full rounded-lg object-cover'
                  />
                ) : (
                  <BookOpen className='w-6 h-6 text-[#FF5722]' />
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-8 px-5 pb-4 flex-1 flex flex-col gap-4'>
          <div>
            <h3 className='font-bold text-lg text-slate-800 line-clamp-2 leading-snug min-h-14'>{tenLoTrinh}</h3>
            <div className='flex items-center gap-2 mt-2 text-xs text-muted-foreground'>
              <Badge variant='secondary' className='bg-slate-100 text-slate-600 font-normal hover:bg-slate-100'>
                {totalCount} khóa học
              </Badge>
              <span>•</span>
              <span className={cn('font-medium', tiLeHoanThanh === 100 ? 'text-green-600' : 'text-[#FF5722]')}>
                {Math.round(tiLeHoanThanh)}% Hoàn thành
              </span>
            </div>
          </div>

          <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
            <div
              className={cn(
                'h-full transition-all duration-500',
                tiLeHoanThanh === 100 ? 'bg-green-500' : 'bg-[#FF5722]'
              )}
              style={{ width: `${tiLeHoanThanh}%` }}
            />
          </div>

          {nextCourse && (
            <div className='mt-auto pt-4 border-t border-slate-100'>
              <p className='text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2'>Tiếp tục học</p>
              <div className='flex gap-3 items-center group/item cursor-pointer'>
                <div className='relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-slate-100'>
                  <img
                    src={'1.55.203.158:5154' + nextCourse.hinhDaiDien || ''}
                    className='w-full h-full object-cover'
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/10 group-hover/item:bg-black/20 transition-colors'>
                    <PlayCircle className='w-5 h-5 text-white drop-shadow-sm' />
                  </div>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-slate-700 line-clamp-1 group-hover/item:text-[#FF5722] transition-colors'>
                    {nextCourse.tenKhoaHoc}
                  </p>
                  <p className='text-xs text-muted-foreground'>Bài {nextCourse.hoanThanhMotBai ? 'tiếp theo' : '1'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className='p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2'>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              className='flex-1 bg-white border-slate-200 text-slate-600 hover:text-[#FF5722] hover:border-[#FF5722]/30'
            >
              <List className='w-4 h-4 mr-2' />
              Chi tiết
            </Button>
          </SheetTrigger>

          {nextCourse && (
            <Button asChild className='flex-1 bg-[#FF5722] hover:bg-[#E64A19] shadow-sm text-white'>
              <Link to={`/hoc-tap/${nextCourse.idKhoaHoc}`}>Học ngay</Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <SheetContent className='w-[400px] sm:w-[540px] overflow-y-auto'>
        <SheetHeader className='mb-6'>
          <SheetTitle className='text-xl font-bold text-[#FF5722] flex items-center gap-2'>
            <BookOpen className='w-5 h-5' />
            {tenLoTrinh}
          </SheetTitle>
          <SheetDescription>
            Chi tiết tiến độ {completedCount}/{totalCount} khóa học trong lộ trình.
          </SheetDescription>
          <div className='mt-4 flex items-center gap-3'>
            <Progress value={tiLeHoanThanh} className='h-3 flex-1' />
            <span className='text-sm font-bold'>{Math.round(tiLeHoanThanh)}%</span>
          </div>
        </SheetHeader>

        <div className='flex flex-col gap-4 pb-10'>
          {danhSachKhoaHoc?.map((course, index) => (
            <CourseListItem key={course.idKhoaHoc} course={course} index={index} onActionSuccess={handleRefresh} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CourseListItem({
  course,
  index,
  onActionSuccess
}: {
  course: KhoaHocNguoiDung
  index: number
  onActionSuccess: () => void
}) {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isCompleted = (course.tiLeHoanThanh || 0) === 100
  const isStarted = (course.tiLeHoanThanh || 0) > 0
  const daDanhGia = !!course.daDanhGia
  const hoanThanhMotBai = course.hoanThanhMotBai

  return (
    <>
      <div
        className={cn(
          'flex gap-4 p-3 rounded-lg border transition-all',
          isCompleted
            ? 'bg-[#FF5722]/10 border-[#FF5722]/30'
            : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
        )}
      >
        <div className='flex flex-col items-center gap-1 pt-1'>
          {isCompleted ? (
            <div className='w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center text-white'>
              <CheckCircle2 className='w-4 h-4' />
            </div>
          ) : (
            <div className='w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500'>
              {index + 1}
            </div>
          )}
          <div className='w-px flex-1 bg-slate-100 my-1' />
        </div>

        <div className='flex-1 min-w-0 flex flex-col gap-2'>
          <div className='flex justify-between items-start gap-2'>
            <h4 className={cn('font-semibold text-sm line-clamp-2', isCompleted && 'text-[#FF5722]')}>
              {course.tenKhoaHoc}
            </h4>
            {course.danhGiaTrungBinh > 0 && (
              <div className='flex items-center text-xs text-amber-500 font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded'>
                <span className='mr-1'>★</span>
                {course.danhGiaTrungBinh.toFixed(1)}
              </div>
            )}
          </div>

          <div className='flex items-center gap-4 text-xs text-slate-500'>
            <span className='line-clamp-1 max-w-[120px]'>{course.tenGiangVien}</span>
            {isStarted && (
              <span className={cn('font-medium', isCompleted ? 'text-[#FF5722]' : 'text-[#FF5722]')}>
                {course.tiLeHoanThanh}%
              </span>
            )}
          </div>

          <div className='mt-2 flex flex-col gap-2'>
            <Button asChild variant={isCompleted ? 'outline' : 'default'} size='sm' className='w-full h-8 text-xs'>
              <Link to={`/hoc-tap/${course.idKhoaHoc}`}>
                {isCompleted ? 'Xem lại' : isStarted ? 'Tiếp tục học' : 'Bắt đầu học'}
              </Link>
            </Button>

            {hoanThanhMotBai && (
              <div className='flex gap-2'>
                {!daDanhGia ? (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => setShowRatingModal(true)}
                    className='w-full h-8 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
                  >
                    <Star className='w-3.5 h-3.5 mr-1.5' /> Viết đánh giá
                  </Button>
                ) : (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setShowRatingModal(true)}
                      className='flex-1 h-8 text-xs'
                    >
                      <Edit className='w-3.5 h-3.5 mr-1.5' /> Sửa
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setShowDeleteModal(true)}
                      className='flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100'
                    >
                      <Trash2 className='w-3.5 h-3.5 mr-1.5' /> Xóa
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <RatingDialog
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        course={course}
        onSuccess={onActionSuccess}
      />

      <DeleteDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        course={course}
        onSuccess={onActionSuccess}
      />
    </>
  )
}

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
    defaultValues: { idKhoaHoc: course.idKhoaHoc, soDiemDanhGia: 0, noiDungDanhGia: '' }
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
    onError: (err) => console.error(err)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-[#FF5722]'>{daDanhGia ? 'Chỉnh sửa đánh giá' : 'Đánh giá khóa học'}</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm về <span className='font-semibold'>{course.tenKhoaHoc}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutate(data))} className='grid gap-6 py-4'>
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
              placeholder='Bạn cảm thấy khóa học thế nào?'
              className='min-h-[100px] resize-none'
            />
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={ratingValue === 0 || isPending}
              className='bg-[#FF5722] hover:bg-[#E64A19] text-white'
            >
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
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle className='text-[#FF5722]'>Xác nhận xóa đánh giá</DialogTitle>
          <DialogDescription>
            Bạn chắc chắn muốn xóa đánh giá khóa học <span className='font-semibold'>{course.tenKhoaHoc}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => mutate()} disabled={isPending} className='bg-[#FF5722] hover:bg-[#E64A19] text-white'>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
