import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { useHoctap } from '@/hooks/useHocTap'

export default function HocTapGuard() {
  const { currentUser } = useNguoiDung()
  const { daDangKyKhoaHoc, khoaHocDaGhiDanh } = useHoctap()
  const { id, idKhoaHoc } = useParams()

  const khoaHocId = Number(id ?? idKhoaHoc)

  if (!currentUser) {
    return <Navigate to='/dang-nhap' replace />
  }

  if (!khoaHocDaGhiDanh) {
    return null
  }

  if (!khoaHocId) {
    return <Navigate to='/' replace />
  }

  if (!daDangKyKhoaHoc(khoaHocId)) {
    return <Navigate to={`/thong-tin-khoa-hoc/${khoaHocId}`} replace />
  }

  return <Outlet />
}
