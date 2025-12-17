import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { ButtonCustom } from '@/components/common/ButtonCustom'
import { Input } from '@/components/ui/input'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { CheckEmail } from '@/apis/auth'

export function ResetPasswordPage() {
  const [emailInput, setEmailInput] = useState('')
  const navigate = useNavigate()
  const { mutate: checkEmailMutate, isPending: isLoading } = useMutation({
    mutationFn: (email: string) => CheckEmail(email),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message || 'Email hợp lệ, vui lòng xác thực OTP!' })
        navigate('/xac-thuc-otp', { state: { email: emailInput } })
      } else {
        showErrorToast({ message: res.message || 'Email không hợp lệ' })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ, vui lòng thử lại' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) {
      showErrorToast({ message: 'Vui lòng nhập email' })
      return
    }
    checkEmailMutate(emailInput)
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Đặt lại mật khẩu</h1>
          <p className='text-[16px] text-[#6A6C70]'>Nhập email để xác thực và đặt lại mật khẩu</p>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-[14px] font-bold text-[#1C1D1F] mb-2'>Email</label>
              <div className='relative'>
                <Input
                  type='email'
                  placeholder='Nhập email của bạn'
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className='w-full h-12 pl-3 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
                  required
                />
              </div>
            </div>

            <ButtonCustom
              type='submit'
              fullWidth
              disabled={isLoading || isLoading}
              className='bg-[#FF5722] hover:bg-[#E64A19]'
            >
              {isLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
            </ButtonCustom>
          </form>
        </div>
      </div>
    </div>
  )
}
