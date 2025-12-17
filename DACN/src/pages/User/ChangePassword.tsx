import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { Input } from '@/components/ui/input'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { DoiMatKhauAPI } from '@/apis/nguoidung'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { ButtonCustom } from '@/components/common/ButtonCustom'

export function DoiMatKhauPage() {
  const [matKhauHienTai, setMatKhauHienTai] = useState('')
  const [matKhauMoi, setMatKhauMoi] = useState('')
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const navigate = useNavigate()
  const { currentUser } = useNguoiDung()

  const { mutate: doiMatKhauMutate, isPending: isLoading } = useMutation({
    mutationFn: ({ matKhauMoi, matKhauHienTai }: { matKhauMoi: string; matKhauHienTai: string }) =>
      DoiMatKhauAPI(matKhauMoi, matKhauHienTai),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        showSuccessToast({ message: res.message || 'Đổi mật khẩu thành công!' })
        navigate('/')
      } else {
        showErrorToast({ message: res.message || 'Đổi mật khẩu thất bại' })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ, vui lòng thử lại' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!matKhauHienTai || !matKhauMoi || !xacNhanMatKhau) {
      showErrorToast({ message: 'Vui lòng điền đầy đủ thông tin' })
      return
    }
    if (matKhauMoi.length < 6) {
      showErrorToast({ message: 'Mật khẩu phải ít nhất 6 ký tự' })
      return
    }
    if (matKhauMoi !== xacNhanMatKhau) {
      showErrorToast({ message: 'Mật khẩu xác nhận không khớp' })
      return
    }
    doiMatKhauMutate({ matKhauMoi, matKhauHienTai })
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-white py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF5722] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Đổi mật khẩu</h1>
          <p className='text-[16px] text-[#6A6C70]'>
            Đổi mật khẩu cho tài khoản <span className='font-bold text-[#1C1D1F]'>{currentUser?.hoTen}</span>
          </p>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Mật khẩu hiện tại */}
            <div>
              <label className='block text-[14px] font-bold text-[#1C1D1F] mb-2'>Mật khẩu hiện tại</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A6C70]' />
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu hiện tại'
                  value={matKhauHienTai}
                  onChange={(e) => setMatKhauHienTai(e.target.value)}
                  className='w-full h-12 pl-10 pr-10 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A6C70] hover:text-[#FF5722]'
                >
                  {showCurrentPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className='block text-[14px] font-bold text-[#1C1D1F] mb-2'>Mật khẩu mới</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A6C70]' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu mới'
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                  className='w-full h-12 pl-10 pr-10 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A6C70] hover:text-[#FF5722]'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className='block text-[14px] font-bold text-[#1C1D1F] mb-2'>Xác nhận mật khẩu</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A6C70]' />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập lại mật khẩu'
                  value={xacNhanMatKhau}
                  onChange={(e) => setXacNhanMatKhau(e.target.value)}
                  className='w-full h-12 pl-10 pr-10 border-[#1C1D1F] text-[16px] focus:border-[#FF5722] focus:border-2'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6A6C70] hover:text-[#FF5722]'
                >
                  {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            <ButtonCustom
              type='submit'
              disabled={isLoading}
              fullWidth
              size='lg'
              className='bg-[#FF5722] hover:bg-[#E64A19]'
            >
              {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </ButtonCustom>
          </form>
        </div>
      </div>
    </div>
  )
}
