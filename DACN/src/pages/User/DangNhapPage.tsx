import { DangNhap } from '@/apis/auth'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { Input } from '@/components/ui/input'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { showErrorToast } from '@/utils/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ButtonCustom } from '@/components/common/ButtonCustom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
const dangNhapSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Vui lòng nhập email'),
  matKhau: z.string().min(1, 'Vui lòng nhập mật khẩu')
})

type DangNhapFormData = z.infer<typeof dangNhapSchema>

export function TrangDangNhap() {
  const { currentUser, setCurrentUser } = useNguoiDung()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DangNhapFormData>({
    resolver: zodResolver(dangNhapSchema)
  })
  if (currentUser) {
    navigate('/')
  }
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: dangNhapMutate, isPending: dangNhapDangXuLy } = useMutation({
    mutationFn: ({ email, matKhau }: DangNhapFormData) => DangNhap({ email, matKhau }),
    onSuccess: async (res, variables) => {
      if (res.statusCode === 200) {
        localStorage.setItem('access_token', res?.data?.token.accessToken || '')
        localStorage.setItem('refresh_token', res?.data?.token.refreshToken || '')
        setCurrentUser(res.data?.thongTinNguoiDung ?? null)
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        navigate(from, { replace: true })
      } else if (res.statusCode === 301) {
        navigate('/xac-thuc-otp', { state: variables })
      } else if (res.statusCode === 307) {
        localStorage.setItem('access_token', res?.data?.token.accessToken || '')
        localStorage.setItem('refresh_token', res?.data?.token.refreshToken || '')
        setCurrentUser(res.data?.thongTinNguoiDung ?? null)
      } else if (res.statusCode === 500) {
        showErrorToast({ message: res.message || 'Đăng nhập thất bại' })
      }
    },
    onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
  })

  const onSubmit = (data: DangNhapFormData) => {
    dangNhapMutate(data)
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[380px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Đăng nhập vào tài khoản của bạn</h1>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Email <span className='text-red-500'>*</span>
              </label>
              <Input
                {...register('email')}
                type='email'
                placeholder='Email'
                className='w-full h-12 border-[#1C1D1F] text-[16px] placeholder-[#6A6C70] focus:border-[#FF5722] focus:border-2'
              />
              {errors.email && <p className='text-red-500 text-[12px] mt-1'>{errors.email.message}</p>}
            </div>
            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Mật khẩu <span className='text-red-500'>*</span>
              </label>

              <div className='relative'>
                <Input
                  {...register('matKhau')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Mật khẩu'
                  className='
        w-full h-12
        border-[#1C1D1F]
        text-[16px]
        placeholder-[#6A6C70]
        focus:border-[#FF5722]
        focus:border-2
        pr-12
      '
                />

                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='
        absolute right-3 top-1/2 -translate-y-1/2
        text-gray-500 hover:text-gray-700
      '
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.matKhau && <p className='text-red-500 text-[12px] mt-1'>{errors.matKhau.message}</p>}
            </div>

            <ButtonCustom
              type='submit'
              disabled={dangNhapDangXuLy}
              fullWidth
              className='flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#E64A19]'
            >
              {dangNhapDangXuLy && <Loader2 className='animate-spin h-5 w-5 text-white' />}
              {dangNhapDangXuLy ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </ButtonCustom>
          </form>

          <div className='text-center mt-4'>
            <Link to='/quen-mat-khau' className='text-[14px] text-[#FF5722] hover:text-[#E64A19] hover:underline'>
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className='text-center mt-6'>
          <p className='text-[14px] text-[#1C1D1F]'>
            Chưa có tài khoản?{' '}
            <Link to='/dang-ky' className='text-[#FF5722] font-bold hover:text-[#E64A19] hover:underline'>
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
