import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { showErrorToast } from '@/utils/toast'
import { CheckEmail } from '@/apis/auth'
import { ButtonCustom } from '@/components/common/ButtonCustom'

export function QuenMatKhauPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const { mutate: checkEmailMutate, isPending } = useMutation({
    mutationFn: (email: string) => CheckEmail(email),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        navigate('/xac-thuc-otp', { state: { email: email, quenMatKhau: true } })
      } else {
        showErrorToast({ message: res.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ, vui lòng thử lại' })
    }
  })

  const xuLyGuiForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      showErrorToast({ message: 'Vui lòng nhập email' })
      return
    }
    checkEmailMutate(email)
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Quên mật khẩu?</h1>
          <p className='text-[16px] text-[#6A6C70]'>Nhập email của bạn và chúng tôi sẽ gửi mã để đặt lại mật khẩu</p>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={xuLyGuiForm} className='space-y-6'>
            <div>
              <label className='block text-[14px] font-bold text-[#1C1D1F] mb-2'>Địa chỉ email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A6C70]' />
                <Input
                  type='email'
                  placeholder='Nhập email của bạn'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full h-12 pl-10 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
                  required
                />
              </div>
            </div>

            <ButtonCustom type='submit' disabled={isPending} fullWidth size='lg'>
              {isPending ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </ButtonCustom>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-[14px] text-[#6A6C70]'>
              Bạn đã nhớ mật khẩu?{' '}
              <button
                onClick={() => navigate('/dang-nhap')}
                className='text-[#FF5722] font-bold hover:text-[#E64A19] hover:underline'
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
