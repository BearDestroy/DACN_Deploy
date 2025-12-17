import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { DangKy } from '@/apis/auth'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { Loader2 } from 'lucide-react'
import { ButtonCustom } from '@/components/common/ButtonCustom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNguoiDung } from '@/hooks/useNguoiDung'
const signupSchema = z
  .object({
    hoTen: z.string().min(3, 'Tên phải có ít nhất 3 ký tự').max(100, 'Tên không được vượt quá 100 ký tự'),
    email: z.string().email('Email không hợp lệ').max(100, 'Email không được vượt quá 100 ký tự'),
    matKhau: z
      .string()
      .min(6, 'Mật khẩu phải ít nhất 6 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
      ),
    xacNhanMatKhau: z.string()
  })
  .refine((data) => data.matKhau === data.xacNhanMatKhau, {
    message: 'Mật khẩu không khớp',
    path: ['xacNhanMatKhau']
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupPage() {
  const navigate = useNavigate()
  const { currentUser } = useNguoiDung()
  if (currentUser) {
    navigate('/')
  }
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { mutate: dangKyMutate, isPending: isLoading } = useMutation({
    mutationFn: ({ email, matKhau, hoTen }: { email: string; matKhau: string; hoTen: string }) =>
      DangKy({ email, matKhau, hoTen })
  })

  const onSubmit = (data: SignupFormData) => {
    const { hoTen, email, matKhau } = data
    dangKyMutate(
      { email, matKhau, hoTen },
      {
        onSuccess: (res) => {
          if (res.statusCode === 200) {
            navigate('/xac-thuc-otp', { state: { email, matKhau } })
            showSuccessToast({ message: 'Đăng ký thành công!' })
          } else {
            showErrorToast({ message: res.message || 'Đăng ký thất bại' })
          }
        },
        onError: () => showErrorToast({ message: 'Lỗi máy chủ' })
      }
    )
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Đăng ký và bắt đầu học</h1>
          <p className='text-[16px] text-[#6A6C70]'>Tạo tài khoản Udemy của bạn</p>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Họ và tên <span className='text-red-500'>*</span>
              </label>
              <Input
                {...register('hoTen')}
                placeholder='Họ và tên'
                className='w-full h-12 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
              />
              {errors.hoTen && <p className='text-red-500 text-[12px] mt-1'>{errors.hoTen.message}</p>}
            </div>

            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Email <span className='text-red-500'>*</span>
              </label>
              <Input
                {...register('email')}
                type='email'
                placeholder='Email'
                className='w-full h-12 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
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
        focus:border-[#FF5722]
        focus:border-2
        pr-12
      '
                />

                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.matKhau && <p className='text-red-500 text-[12px] mt-1'>{errors.matKhau.message}</p>}
            </div>

            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Xác nhận mật khẩu <span className='text-red-500'>*</span>
              </label>

              <div className='relative'>
                <Input
                  {...register('xacNhanMatKhau')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Xác nhận mật khẩu'
                  className='w-full h-12 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2 pr-12'
                />

                <button
                  type='button'
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.xacNhanMatKhau && (
                <p className='text-red-500 text-[12px] mt-1'>{errors.xacNhanMatKhau.message}</p>
              )}
            </div>

            <ButtonCustom
              type='submit'
              fullWidth
              disabled={isLoading}
              className='flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#E64A19]'
            >
              {isLoading && <Loader2 className='animate-spin h-5 w-5 text-white' />}
              Đăng ký
            </ButtonCustom>
          </form>

          <div className='text-center mt-6'>
            <p className='text-[14px] text-[#1C1D1F]'>
              Đã có tài khoản?{' '}
              <Link to='/dang-nhap' className='text-[#FF5722] font-bold hover:text-[#E64A19] hover:underline'>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
