import type { HocTapContextType } from '@/@types/ContextType/ContextType'
import { HocTapContext } from './HocTapContex'
import { DangKyKhoaHoc, danhDauHoanThanh, layDanhSachKhoaHocNguoiDung } from '@/apis/khoahoc'
import { useEffect, useState, type ReactNode, useCallback } from 'react'
import type { KhoaHocNguoiDung } from '@/@types/KhoaHoc'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import type { LoTrinhNguoiDung } from '@/@types/LoTrinhHoc'
import { DangKyLoTrinhHoc, layDanhSachLoTrinhHocNguoiDung } from '@/apis/loTrinhHoc'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export function HocTapProvider({ children }: Props) {
  const { currentUser } = useNguoiDung()
  const navigate = useNavigate()

  const [khoaHocDaGhiDanh, setKhoaHocDaGhiDanh] = useState<KhoaHocNguoiDung[] | []>([])
  const [loTrinhHocDaGhiDanh, setLoTrinhHocDaGhiDanh] = useState<LoTrinhNguoiDung[] | []>([])

  const loadKhoaHocDaGhiDanh = useCallback(async () => {
    if (!currentUser) {
      console.warn('Hủy load khóa học vì chưa có User')
      return
    }

    try {
      const response = await layDanhSachKhoaHocNguoiDung()
      setKhoaHocDaGhiDanh(response.data ?? [])
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học đã ghi danh:', error)
    }
  }, [currentUser])

  const loadLoTrinhHocDaGhiDanh = useCallback(async () => {
    if (!currentUser) {
      console.warn('Hủy load khóa học vì chưa có User')
      return
    }

    try {
      const response = await layDanhSachLoTrinhHocNguoiDung()
      setLoTrinhHocDaGhiDanh(response.data ?? [])
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học đã ghi danh:', error)
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        loadKhoaHocDaGhiDanh()
        loadLoTrinhHocDaGhiDanh()
      })
    }
  }, [currentUser, loadKhoaHocDaGhiDanh, loadLoTrinhHocDaGhiDanh])

  const danhDauHoanThanhBaiHoc = async (idBaiHoc: number) => {
    if (!currentUser) return false

    const result = await danhDauHoanThanh(idBaiHoc)

    if (result.statusCode === 200) {
      if (result.data === true) {
        return true
      } else {
        return false
      }
    } else {
      showErrorToast({ message: 'Lỗi khi đánh dấu hoàn thành: ' + result.message })
      return false
    }
  }

  const daDangKyKhoaHoc = useCallback(
    (idKhoaHoc: number): boolean => {
      if (!currentUser) return false
      return khoaHocDaGhiDanh?.some((kh) => kh.idKhoaHoc === idKhoaHoc) ?? false
    },
    [currentUser, khoaHocDaGhiDanh]
  )

  const daDangKyLoTrinhHoc = useCallback(
    (idKhoaHoc: number): boolean => {
      if (!currentUser) return false
      return loTrinhHocDaGhiDanh?.some((kh) => kh.idLoTrinhHoc === idKhoaHoc) ?? false
    },
    [currentUser, loTrinhHocDaGhiDanh]
  )

  const dangKyKhoaHocMutation = useMutation({
    mutationFn: (idKhoaHoc: number) => DangKyKhoaHoc(idKhoaHoc),
    onSuccess: () => {
      showSuccessToast({ message: 'Đăng ký khóa học thành công!' })
      loadKhoaHocDaGhiDanh()
    },
    onError: () => {
      showErrorToast({ message: 'Có lỗi xảy ra khi đăng ký!' })
    }
  })

  const dangKyLoTrinhHocMutation = useMutation({
    mutationFn: (idLoTrinhHoc: number) => DangKyLoTrinhHoc(idLoTrinhHoc),
    onSuccess: () => {
      showSuccessToast({ message: 'Đăng ký khóa học thành công!' })
      loadLoTrinhHocDaGhiDanh()
    },
    onError: () => {
      showErrorToast({ message: 'Có lỗi xảy ra khi đăng ký!' })
    }
  })

  // 3. Sửa logic xử lý Đăng ký khóa học
  const dangKyKhoaHocHandler = (idKhoaHoc: number) => {
    if (!currentUser) {
      // Có thể thêm toast thông báo nhẹ trước khi chuyển trang nếu muốn
      // toast.warning('Vui lòng đăng nhập để tiếp tục')
      navigate('/dang-nhap') // Chuyển hướng tới trang đăng nhập
      return
    }
    dangKyKhoaHocMutation.mutate(idKhoaHoc)
  }

  // 4. Sửa logic xử lý Đăng ký lộ trình
  const dangKyLoTrinhHocHandler = (idKhoaHoc: number) => {
    if (!currentUser) {
      navigate('/dang-nhap') // Chuyển hướng tới trang đăng nhập
      return
    }
    dangKyLoTrinhHocMutation.mutate(idKhoaHoc)
  }

  const value: HocTapContextType = {
    khoaHocDaGhiDanh,
    daDangKyKhoaHoc,
    danhDauHoanThanhBaiHoc,
    dangKyKhoaHoc: dangKyKhoaHocHandler,
    dangKyKhoaHocLoading: dangKyKhoaHocMutation.isPending,
    loadKhoaHocDaGhiDanh,
    dangKyLoTrinhHoc: dangKyLoTrinhHocHandler,
    dangKyLoTrinhHocLoading: dangKyLoTrinhHocMutation.isPending,
    loadLoTrinhHocDaGhiDanh,
    daDangKyLoTrinhHoc,
    loTrinhHocDaGhiDanh
  }

  return <HocTapContext.Provider value={value}>{children}</HocTapContext.Provider>
}
