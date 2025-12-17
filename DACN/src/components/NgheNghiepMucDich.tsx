import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Briefcase, Target, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery, useMutation } from '@tanstack/react-query'
import { layDSMucDich } from '@/apis/mucdich'
import { layDSNgheNghiepPhoBien } from '@/apis/nghenghiep'
import { CapNhatNgheNghiep } from '@/apis/nguoidung'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { debounce } from 'lodash'
import type { NgheNghiep } from '@/@types/NgheNghiep.type'
import type { MucDich } from '@/@types/MucDich.type'
import { useNguoiDung } from '@/hooks/useNguoiDung'

interface CareerGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function NgheNghiepMucDichModal({ open, onOpenChange, onSuccess }: CareerGoalModalProps) {
  const { currentUser } = useNguoiDung()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null)
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null)

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value)
      }, 300),
    []
  )

  useEffect(() => {
    debouncedUpdateSearch(searchTerm)
    return () => {
      debouncedUpdateSearch.cancel()
    }
  }, [searchTerm, debouncedUpdateSearch])

  useEffect(() => {
    if (open && currentUser) {
      if (currentUser.idMucDich) {
        setTimeout(() => {
          setSelectedGoalId(currentUser.idMucDich)
        })
      }
      if (currentUser.idNgheNghiep) {
        setTimeout(() => {
          setSelectedCareerId(currentUser.idNgheNghiep)
        })
      }
    } else if (!open) {
      setTimeout(() => {
        setSearchTerm('')
        setDebouncedSearchTerm('')
        setSelectedCareerId(null)
        setSelectedGoalId(null)
      })
    }
  }, [open, currentUser])

  const soTrang = 1
  const soLuong = 50

  const { data: careerRes, isLoading: loadingCareers } = useQuery({
    queryKey: ['dsNgheNghiepPhoBien', debouncedSearchTerm],
    queryFn: () => layDSNgheNghiepPhoBien(debouncedSearchTerm.trim()),
    enabled: open
  })

  const careers: NgheNghiep[] = careerRes?.data || []

  const { data: goalsRes, isLoading: loadingGoals } = useQuery({
    queryKey: ['dsMucDich', soTrang, soLuong],
    queryFn: () => layDSMucDich(soTrang, soLuong, 1, ''),
    enabled: open
  })

  const goals: MucDich[] = goalsRes?.data?.ketQua || []

  // Mutation Cập Nhật
  const { mutate: submitNgheNghiep, isPending: isUpdating } = useMutation({
    mutationFn: ({ idMucDich, idNgheNghiep }: { idMucDich: number; idNgheNghiep: number }) =>
      CapNhatNgheNghiep(idMucDich, idNgheNghiep),

    onSuccess: () => {
      showSuccessToast({ message: 'Cập nhật lộ trình thành công!' })
      if (onSuccess) onSuccess()
      onOpenChange(false)
    },

    onError: (err: Error) => {
      console.error(err)
      showErrorToast({ message: 'Lỗi cập nhật nghề nghiệp' })
    }
  })

  const handleSubmit = () => {
    const finalCareerId = selectedCareerId || currentUser?.idNgheNghiep
    const finalGoalId = selectedGoalId || currentUser?.idMucDich

    if (!finalCareerId || !finalGoalId) {
      showErrorToast({ message: 'Vui lòng chọn đầy đủ thông tin' })
      return
    }

    submitNgheNghiep({ idMucDich: finalGoalId, idNgheNghiep: finalCareerId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] bg-white text-slate-900 max-h-[98vh] overflow-y-auto z-999'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-center text-slate-800'>
            Định hướng lộ trình học tập
          </DialogTitle>
          <p className='text-center text-slate-500 text-sm'>Giúp chúng tôi gợi ý các khóa học phù hợp nhất với bạn</p>
        </DialogHeader>

        <div className='space-y-2 py-2 -mt-2.5'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-orange-600 font-semibold'>
              <Briefcase className='w-5 h-5' />
              <h3>1. Bạn muốn làm nghề gì?</h3>
            </div>
            <div className='relative flex items-center'>
              <Search className='absolute left-3 w-4 h-4 text-slate-400 pointer-events-none' />
              <Input
                placeholder='Tìm kiếm nghề nghiệp (VD: Java Backend...)'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Thay đổi ring focus sang orange-500
                className='pl-10 h-10 bg-slate-50 border-slate-200 focus-visible:ring-orange-500'
              />
            </div>

            <div>
              <p className='text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide'>
                {debouncedSearchTerm ? 'Kết quả tìm kiếm:' : 'Phổ biến:'}
              </p>

              {loadingCareers ? (
                <div className='flex items-center justify-center py-4'>
                  {/* Thay đổi loader sang orange-600 */}
                  <Loader2 className='w-5 h-5 animate-spin text-orange-600' />
                </div>
              ) : careers.length === 0 ? (
                <p className='text-sm text-slate-400 italic'>Không tìm thấy nghề nghiệp phù hợp</p>
              ) : (
                <div className='flex flex-wrap gap-2 max-h-[130px] overflow-y-auto scrollbar-thin p-1'>
                  {careers.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCareerId(item.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all',
                        selectedCareerId === item.id
                          ? // Active: bg-orange-600, border-orange-600
                            'bg-orange-600 text-white border-orange-600 shadow-md'
                          : // Hover: border-orange-300, bg-orange-50
                            'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                      )}
                    >
                      {item.tenNgheNghiep}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            {/* Thay đổi màu icon và text tiêu đề sang orange-600 */}
            <div className='flex items-center gap-2 text-orange-600 font-semibold'>
              <Target className='w-5 h-5' />
              <h3>2. Mục tiêu của bạn là gì?</h3>
            </div>

            {loadingGoals ? (
              <div className='flex items-center justify-center py-2'>
                <Loader2 className='w-5 h-5 animate-spin text-orange-600' />
              </div>
            ) : (
              <div className='space-y-2'>
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalId(goal.id)}
                    className={cn(
                      'flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all relative hover:bg-slate-50',
                      // Logic Active: border-orange-600, bg-orange-50/50
                      selectedGoalId === goal.id ? 'border-orange-600 bg-orange-50/50' : 'border-slate-100'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0',
                        // Radio circle border
                        selectedGoalId === goal.id ? 'border-orange-600' : 'border-slate-300'
                      )}
                    >
                      {/* Radio dot active */}
                      {selectedGoalId === goal.id && <div className='w-2.5 h-2.5 rounded-full bg-orange-600' />}
                    </div>

                    <div className='flex-1'>
                      <p
                        className={cn(
                          'font-medium text-sm',
                          // Text active
                          selectedGoalId === goal.id ? 'text-orange-900' : 'text-slate-700'
                        )}
                      >
                        {goal.tenMucDich}
                      </p>
                    </div>

                    {selectedGoalId === goal.id && (
                      // Check icon active
                      <Check className='w-5 h-5 text-orange-600 absolute right-3 top-1/2 -translate-y-1/2' />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='-mt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isUpdating}>
            Bỏ qua
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              (!selectedCareerId && !currentUser?.idNgheNghiep) ||
              (!selectedGoalId && !currentUser?.idMucDich) ||
              isUpdating
            }
            // Button submit: bg-orange-600 hover:bg-orange-700
            className='bg-orange-600 hover:bg-orange-700 min-w-[120px]'
          >
            {isUpdating ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
            Hoàn tất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
