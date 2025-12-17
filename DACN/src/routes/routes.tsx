import { BrowserRouter } from 'react-router-dom'
import AdminRoute from './AdminRoutes'
import UserRoutes from './UserRoutes'
import { NguoiDungProvider } from '@/contexts/NguoiDungProvider'
export default function Routes() {
  return (
    <BrowserRouter>
      <NguoiDungProvider>
        <AdminRoute />
        <UserRoutes />
      </NguoiDungProvider>
    </BrowserRouter>
  )
}
