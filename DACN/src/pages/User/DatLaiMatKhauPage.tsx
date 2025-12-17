import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { ButtonCustom } from '@/components/common/ButtonCustom'
import { useState, useEffect } from 'react'
import { DatLaiMatKhau } from '@/apis/auth'

const resetPasswordSchema = z
  .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function DatLaiMatKhauPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const email: string | undefined = location.state?.email
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!email) {
      showErrorToast({ message: 'Không tìm thấy thông tin xác thực. Vui lòng thử lại.' })
      navigate('/dang-nhap', { replace: true })
    }
  }, [email, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const { mutate: doiMatKhauMutate, isPending: isLoading } = useMutation({
    mutationFn: (matKhauMoi: string) => DatLaiMatKhau(email!, matKhauMoi)
  })
  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email) return

    doiMatKhauMutate(data.matKhau, {
      onSuccess: (res) => {
        if (res.statusCode === 200) {
          showSuccessToast({ message: res.message || 'Đặt lại mật khẩu thành công!' })
          navigate('/dang-nhap')
        } else {
          showErrorToast({ message: res.message || 'Đặt lại mật khẩu thất bại' })
        }
      },
      onError: () => {
        showErrorToast({ message: 'Lỗi máy chủ, vui lòng thử lại sau' })
      }
    })
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        {/* HEADER */}
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Đặt lại mật khẩu</h1>
          <p className='text-[16px] text-[#6A6C70]'>
            Nhập mật khẩu mới cho tài khoản <span className='font-bold'>{email}</span>
          </p>
        </div>
        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* MẬT KHẨU */}
            <div>
              <label className='text-[14px] font-bold text-[#1C1D1F]'>
                Mật khẩu mới <span className='text-red-500'>*</span>
              </label>

              <div className='relative'>
                <Input
                  {...register('matKhau')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Mật khẩu'
                  className='w-full h-12 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2 pr-12'
                />

                <button
                  type='button'
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
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
                  aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
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

            {/* SUBMIT */}
            <ButtonCustom
              type='submit'
              fullWidth
              disabled={isLoading}
              className='flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#E64A19]'
            >
              {isLoading && <Loader2 className='animate-spin h-5 w-5 text-white' />}
              Đổi mật khẩu
            </ButtonCustom>
          </form>
        </div>
      </div>
    </div>
  )
}
