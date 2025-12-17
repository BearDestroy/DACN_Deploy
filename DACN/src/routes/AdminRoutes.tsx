import { Navigate, useRoutes } from 'react-router'
import QuanLyChuyenMon from '@/pages/Admin/ChuyenMon'
import QuanLyDanhMuc from '@/pages/Admin/DanhMuc'
import QuanLyDoKho from '@/pages/Admin/DoKho'
import QuanLyHocVan from '@/pages/Admin/HocVan'
import QuanLyLoaiBaiTap from '@/pages/Admin/LoaiBaiTap'
import QuanLyLoaiCauHoi from '@/pages/Admin/LoaiCauHoi'
import QuanLyLoaiDanhGia from '@/pages/Admin/LoaiDanhGia'
import QuanLyMucDich from '@/pages/Admin/MucDich'
import QuanLyNgheNghiep from '@/pages/Admin/NgheNghiep'
import QuanLyTrinhDo from '@/pages/Admin/TrinhDo'
import QuanLyVaiTro from '@/pages/Admin/VaiTro'
import QuanLyTheLoai from '@/pages/Admin/TheLoai'
import QuanLyChuDe from '@/pages/Admin/ChuDe'
import QuanLyBaoCaoDanhGia from '@/pages/Admin/BaoCaoDanhGia'
import QuanLyBaoCaoKhoaHoc from '@/pages/Admin/BaoCaoKhoaHoc'
import QuanLyKhoaHoc from '@/pages/Admin/KhoaHoc'
import QuanLyNguoiDung from '@/pages/Admin/NguoiDung'
import QuanLyGiangVien from '@/pages/Admin/GiangVien'
import AdminLayout from '@/layouts/Admin'
import Dashboard from '@/pages/Admin/Dashbroad'
import QuanLyLoTrinhHoc from '@/pages/Admin/LoTrinhHoc'
import AdminGuard from './AdminGuard'

export default function AdminRoutes() {
  const element = useRoutes([
    {
      element: <AdminGuard />,
      children: [
        {
          path: '/admin/*',
          element: <AdminLayout />,
          children: [
            { path: 'chuyen-mon', element: <QuanLyChuyenMon /> },
            { path: 'danh-muc', element: <QuanLyDanhMuc /> },
            { path: 'do-kho', element: <QuanLyDoKho /> },
            { path: 'hoc-van', element: <QuanLyHocVan /> },
            { path: 'loai-bai-tap', element: <QuanLyLoaiBaiTap /> },
            { path: 'loai-cau-hoi', element: <QuanLyLoaiCauHoi /> },
            { path: 'loai-danh-gia', element: <QuanLyLoaiDanhGia /> },
            { path: 'muc-dich', element: <QuanLyMucDich /> },
            { path: 'nghe-nghiep', element: <QuanLyNgheNghiep /> },
            { path: 'trinh-do', element: <QuanLyTrinhDo /> },
            { path: 'vai-tro', element: <QuanLyVaiTro /> },
            { path: 'the-loai', element: <QuanLyTheLoai /> },
            { path: 'chu-de', element: <QuanLyChuDe /> },
            { path: 'bao-cao-danh-gia', element: <QuanLyBaoCaoDanhGia /> },
            { path: 'bao-cao-khoa-hoc', element: <QuanLyBaoCaoKhoaHoc /> },
            { path: 'khoa-hoc', element: <QuanLyKhoaHoc /> },
            { path: 'lo-trinh-hoc', element: <QuanLyLoTrinhHoc /> },
            { path: 'nguoi-dung', element: <QuanLyNguoiDung /> },
            { path: 'giang-vien', element: <QuanLyGiangVien /> },
            { path: '', element: <Navigate to='dashbroad' replace /> },
            { path: 'dashbroad', element: <Dashboard /> }
          ]
        }
      ]
    }
  ])

  return element
}
