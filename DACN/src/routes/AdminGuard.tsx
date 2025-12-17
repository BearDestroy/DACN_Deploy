import { Navigate, Outlet } from 'react-router-dom'
import { useNguoiDung } from '@/hooks/useNguoiDung'

export default function AdminGuard() {
  const { currentUser, loading } = useNguoiDung()

  if (loading) {
    return null
  }

  if (!currentUser) {
    return <Navigate to='/dang-nhap' replace />
  }

  if (!currentUser.vaiTro?.includes('ADMIN')) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
