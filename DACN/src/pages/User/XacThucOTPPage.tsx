import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { DangNhap, XacThuc, GuiLaiMa } from '@/apis/auth'
import { QuenMatKhauAPI } from '@/apis/nguoidung'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { UdemyLogo } from '@/components/common/UdemyLogo'
import { ButtonCustom } from '@/components/common/ButtonCustom'
import type { ILoginRequest, IVerifyOTPRequest } from '@/@types/Auth'
import { Loader2 } from 'lucide-react'

export function TrangXacThucOTP() {
  const [maOTP, setMaOTP] = useState<string[]>(Array(6).fill(''))
  const [thoiGianDem, setThoiGianDem] = useState(60)
  const dieuHuong = useNavigate()
  const viTri = useLocation()

  const email = viTri.state?.email ?? ''
  const quenMatKhau = viTri.state?.quenMatKhau === true
  const matKhau = viTri.state?.matKhau || ''
  const matKhauMoi = viTri.state?.matKhauMoi || ''
  const oNhapRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (thoiGianDem <= 0) return
    const boDem = setTimeout(() => setThoiGianDem((prev) => prev - 1), 1000)
    return () => clearTimeout(boDem)
  }, [thoiGianDem])

  const xuLyThayDoi = (chiSo: number, giaTri: string) => {
    const giaTriSo = giaTri.replace(/\D/g, '')
    if (giaTriSo.length > 1) return

    const maOTPmoi = [...maOTP]
    maOTPmoi[chiSo] = giaTriSo
    setMaOTP(maOTPmoi)

    if (giaTriSo && chiSo < 5) {
      oNhapRef.current[chiSo + 1]?.focus()
    } else if (!giaTriSo && chiSo > 0) {
      oNhapRef.current[chiSo - 1]?.focus()
    }
  }

  const xuLyNhanPhim = (chiSo: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !maOTP[chiSo] && chiSo > 0) {
      oNhapRef.current[chiSo - 1]?.focus()
      const maOTPmoi = [...maOTP]
      maOTPmoi[chiSo - 1] = ''
      setMaOTP(maOTPmoi)
    }
  }

  const xuLyDan = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const duLieuDan = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '')
    const maOTPmoi = duLieuDan.split('')
    setMaOTP([...maOTPmoi, ...Array(6 - maOTPmoi.length).fill('')])
    oNhapRef.current[Math.min(duLieuDan.length, 5)]?.focus()
  }

  const { mutate: guiLaiMaMutate, isPending: dangGuiLai } = useMutation({
    mutationFn: (emailGui: string) => GuiLaiMa(emailGui),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        setThoiGianDem(60)
        showSuccessToast({ message: res.message || 'Mã OTP mới đã được gửi tới email của bạn' })
      } else {
        showErrorToast({ message: res.message || 'Gửi lại mã thất bại' })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi kết nối máy chủ' })
    }
  })
  const { mutate: xuLyXacThucOTP, isPending: dangXacThuc } = useMutation({
    mutationFn: (request: IVerifyOTPRequest) => XacThuc(request),
    onSuccess: async (phanHoi) => {
      if (phanHoi.statusCode === 200 || phanHoi.statusCode === 307) {
        if (quenMatKhau) {
          dieuHuong('/dat-lai-mat-khau', {
            state: { email }
          })
          return
        }
        if (matKhauMoi) {
          const phanHoiDoiMK = await QuenMatKhauAPI(matKhauMoi)
          if (phanHoiDoiMK.statusCode === 200) {
            showSuccessToast({ message: phanHoiDoiMK.message || 'Đặt lại mật khẩu thành công!' })
            dieuHuong('/')
          } else {
            showErrorToast({ message: phanHoiDoiMK.message || 'Đặt lại mật khẩu thất bại' })
          }
          return
        }

        const yeuCauDangNhap: ILoginRequest = { email, matKhau }
        const phanHoiDangNhap = await DangNhap(yeuCauDangNhap)
        if (phanHoiDangNhap.statusCode === 307) {
          localStorage.setItem('access_token', phanHoiDangNhap.data?.token.accessToken || '')
          localStorage.setItem('refresh_token', phanHoiDangNhap.data?.token.refreshToken || '')
          dieuHuong('/')
        }
        if (phanHoiDangNhap.statusCode === 200) {
          localStorage.setItem('access_token', phanHoiDangNhap.data?.token.accessToken || '')
          localStorage.setItem('refresh_token', phanHoiDangNhap.data?.token.refreshToken || '')

          showSuccessToast({ message: phanHoiDangNhap.message || 'Đăng nhập thành công' })

          if (phanHoiDangNhap.statusCode === 200) {
            dieuHuong('/')
          }
        } else {
          console.log('TAO NÈ HIPHOP')
          showErrorToast({ message: phanHoiDangNhap.message })
        }
      } else {
        showErrorToast({ message: phanHoi.message })
      }
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
    }
  })

  const xuLyKiemTra = () => {
    const giaTriOTP = maOTP.join('')
    if (giaTriOTP.length !== 6) {
      showErrorToast({ message: 'Vui lòng nhập đủ 6 chữ số OTP' })
      return
    }
    xuLyXacThucOTP({ email, maotp: giaTriOTP })
  }

  // --- HÀM XỬ LÝ GỬI LẠI ĐÃ SỬA ---
  const xuLyGuiLai = () => {
    if (!email) {
      showErrorToast({ message: 'Không tìm thấy email' })
      return
    }
    // Gọi API
    guiLaiMaMutate(email)
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 py-12 px-4'>
      <div className='w-full max-w-[480px]'>
        <div className='text-center mb-8'>
          <div className='inline-block text-[#FF7E36] mb-6'>
            <UdemyLogo />
          </div>
          <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-2'>Xác thực email của bạn</h1>
          <p className='text-[16px] text-[#6A6C70]'>
            Chúng tôi đã gửi mã 6 chữ số tới <span className='font-bold text-[#1C1D1F]'>{email}</span>
          </p>
        </div>

        <div className='bg-white border border-[#D1D7E0] rounded p-6 shadow-lg'>
          <div className='mb-6'>
            <label className='block text-[14px] font-bold text-[#1C1D1F] mb-3 text-center'>Nhập mã xác thực</label>
            <div className='flex gap-2 justify-center' onPaste={xuLyDan}>
              {maOTP.map((chuSo, chiSo) => (
                <input
                  key={chiSo}
                  ref={(el: HTMLInputElement | null) => {
                    oNhapRef.current[chiSo] = el
                  }}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={chuSo}
                  onChange={(e) => xuLyThayDoi(chiSo, e.target.value)}
                  onKeyDown={(e) => xuLyNhanPhim(chiSo, e)}
                  disabled={dangXacThuc}
                  className='w-12 h-14 text-center text-[24px] font-bold border-2 border-[#D1D7E0] rounded focus:border-[#FF7E36] focus:outline-none transition-all duration-200 disabled:opacity-50'
                />
              ))}
            </div>
          </div>

          <ButtonCustom
            onClick={xuLyKiemTra}
            disabled={dangXacThuc || maOTP.join('').length !== 6}
            fullWidth
            size='lg'
            className='bg-[#FF7E36] hover:bg-[#E06927] text-white flex gap-2 items-center justify-center'
          >
            {dangXacThuc && <Loader2 className='animate-spin h-5 w-5' />}
            {dangXacThuc ? 'Đang xác thực...' : 'Xác thực'}
          </ButtonCustom>

          <div className='mt-6 text-center'>
            {thoiGianDem > 0 ? (
              <p className='text-[14px] text-[#6A6C70]'>
                Gửi lại mã sau <span className='font-bold text-[#1C1D1F]'>{thoiGianDem}s</span>
              </p>
            ) : (
              <button
                onClick={xuLyGuiLai}
                disabled={dangGuiLai}
                className='text-[14px] text-[#FF7E36] font-bold hover:text-[#E06927] hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {dangGuiLai && <Loader2 className='animate-spin h-4 w-4' />}
                {dangGuiLai ? 'Đang gửi...' : 'Gửi lại mã OTP'}
              </button>
            )}
          </div>

          <div className='mt-4 text-center'>
            <button onClick={() => dieuHuong(-1)} className='text-[14px] text-[#6A6C70] hover:text-[#1C1D1F]'>
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
