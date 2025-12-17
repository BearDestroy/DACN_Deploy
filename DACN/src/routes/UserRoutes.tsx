import { Layout } from '@/components/Layout'
import { HocTapProvider } from '@/contexts/HocTapProvider'
import { ChiTietGiangVien } from '@/pages/User/ChiTietGiangVien'
import { ChiTietKhoaHoc } from '@/pages/User/ChiTietKhoaHoc'
import { KhoaHocCuaToi } from '@/pages/User/KhoaHocCuaToi'
import { QuenMatKhauPage } from '@/pages/User/QuenMatKhauPage'
import { HomePage } from '@/pages/User/TrangChuPage'
import { TrangDangNhap } from '@/pages/User/DangNhapPage'
import { ResetPasswordPage } from '@/pages/User/DoiMatKhauPage'
import { TrangTimKiem } from '@/pages/User/TimKiemPage'
import { SignupPage } from '@/pages/User/DangKyPage'
import { TrangHoc } from '@/pages/User/HocTapPage'
import { useRoutes } from 'react-router-dom'
import { ChiTietLoTrinh } from '@/pages/User/ChiTietLoTrinhHoc'
import { TrangTimKiemLoTrinhHoc } from '@/pages/User/TimKiemLoTrinhHocPage'
import { HoSoCaNhan } from '@/pages/User/HoSoCaNhan'
import { TrangXacThucOTP } from '@/pages/User/XacThucOTPPage'
import HocTapGuard from './HocTapGuard'
import { DatLaiMatKhauPage } from '@/pages/User/DatLaiMatKhauPage'

export default function UserRoutes() {
  const element = useRoutes([
    {
      path: '/',
      element: (
        <Layout>
          <HomePage />
        </Layout>
      )
    },

    {
      path: '/dang-nhap',
      element: (
        <Layout>
          <TrangDangNhap />
        </Layout>
      )
    },

    {
      path: '/dang-ky',
      element: (
        <Layout>
          <SignupPage />
        </Layout>
      )
    },

    {
      path: '/quen-mat-khau',
      element: (
        <Layout>
          <QuenMatKhauPage />
        </Layout>
      )
    },

    {
      path: '/xac-thuc-otp',
      element: (
        <Layout>
          <TrangXacThucOTP />
        </Layout>
      )
    },
    {
      path: '/dat-lai-mat-khau',
      element: (
        <Layout>
          <DatLaiMatKhauPage />
        </Layout>
      )
    },
    {
      path: '/doi-mat-khau',
      element: (
        <Layout>
          <ResetPasswordPage />
        </Layout>
      )
    },

    {
      path: '/khoa-hoc/*',
      element: (
        <Layout>
          <TrangTimKiem />
        </Layout>
      )
    },
    {
      path: '/lo-trinh-hoc/*',
      element: (
        <Layout>
          <TrangTimKiemLoTrinhHoc />
        </Layout>
      )
    },
    {
      path: '/thong-tin-khoa-hoc/:id',
      element: (
        <Layout>
          <ChiTietKhoaHoc />
        </Layout>
      )
    },

    {
      path: '/giang-vien/:giangVienId',
      element: (
        <Layout>
          <ChiTietGiangVien />
        </Layout>
      )
    },
    {
      path: '/thong-tin-lo-trinh-hoc/:id',
      element: (
        <Layout>
          <ChiTietLoTrinh />
        </Layout>
      )
    },
    {
      path: '/khoa-hoc/*',
      element: (
        <Layout>
          <TrangTimKiemLoTrinhHoc />
        </Layout>
      )
    },

    {
      path: '/khoa-hoc-cua-toi/',
      element: (
        <Layout>
          <KhoaHocCuaToi />
        </Layout>
      )
    },
    {
      path: '/ho-so-ca-nhan/',
      element: (
        <Layout>
          <HoSoCaNhan />
        </Layout>
      )
    },
    {
      path: '/hoc-tap/:id/',
      element: (
        <div className='min-h-screen flex flex-col'>
          <TrangHoc />
        </div>
      )
    },
    {
      element: <HocTapGuard />,
      children: [
        {
          path: '/hoc-tap/:id',
          element: (
            <div className='min-h-screen flex flex-col'>
              <TrangHoc />
            </div>
          )
        },
        {
          path: '/hoc-tap/:idKhoaHoc/:idBaiHoc',
          element: (
            <div className='min-h-screen flex flex-col'>
              <TrangHoc />
            </div>
          )
        }
      ]
    }
  ])

  return <HocTapProvider>{element}</HocTapProvider>
}
