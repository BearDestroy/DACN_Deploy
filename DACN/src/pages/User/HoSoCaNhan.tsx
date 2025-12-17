import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Camera, Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react'

// Hooks & Utils
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { formatDate } from '@/utils/function'

import { CapNhatThongTinNguoiDungAPI, DoiMatKhauAPI, LayThongTinNguoiDungAPI } from '@/apis/nguoidung'
import { CapNhatThongTinSchema, DoiMatKhauSchema } from '@/validations/nguoidung.schema'
import type { CapNhatThongTin, DoiMatKhauForm } from '@/@types/NguoiDung'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function HoSoCaNhan() {
  const { currentUser, setCurrentUser } = useNguoiDung()
  const [isLoading, setIsLoading] = useState(false)

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register: registerProfile,
    handleSubmit: submitProfile,
    setValue,
    formState: { errors: profileErrors }
  } = useForm<CapNhatThongTin>({
    resolver: zodResolver(CapNhatThongTinSchema),
    defaultValues: {
      hoTen: '',
      email: '',
      anhDaiDien: null
    }
  })

  const {
    register: registerPassword,
    handleSubmit: submitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm<DoiMatKhauForm>({
    resolver: zodResolver(DoiMatKhauSchema)
  })

  useEffect(() => {
    if (currentUser) {
      setValue('hoTen', currentUser.hoTen)
      setValue('email', currentUser.email)
      setPreviewUrl('1.55.203.158:5154' + currentUser.anhDaiDien || null)
    }
  }, [currentUser, setValue])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const onSubmitProfile = async (data: CapNhatThongTin) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('TenNguoiDung', data.hoTen)
      formData.append('Email', data.email)

      if (data.anhDaiDien && data.anhDaiDien.length > 0) {
        formData.append('AnhDaiDien', data.anhDaiDien[0])
      }

      const response = await CapNhatThongTinNguoiDungAPI(formData)

      if (response.statusCode === 200) {
        const res = await LayThongTinNguoiDungAPI()
        setCurrentUser(res.data || null)
      } else {
        showErrorToast({ message: response.message })
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast({ message: 'Có lỗi xảy ra khi cập nhật hồ sơ.' })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPassword = async (data: DoiMatKhauForm) => {
    setIsLoading(true)
    try {
      const response = await DoiMatKhauAPI(data.matKhauHienTai, data.matKhauMoi)

      if (response.statusCode === 200) {
        showSuccessToast({ message: response.message })
        resetPasswordForm()
      } else {
        showErrorToast({ message: response.message })
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast({ message: 'Có lỗi xảy ra khi đổi mật khẩu.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className='min-h-screen bg-[#F7F9FA] py-6 font-sans text-slate-900'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6'>
        {/* Header Title */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-slate-900'>Cài đặt tài khoản</h1>
          <p className='text-slate-500 mt-1'>Quản lý thông tin cá nhân và tùy chọn bảo mật.</p>
        </div>

        <Tabs defaultValue='profile' className='w-full'>
          <Card className='flex flex-col md:flex-row overflow-hidden border-slate-200 shadow-md bg-white min-h-[600px]'>
            <div className='md:w-64 lg:w-72 bg-slate-50/80 border-b md:border-b-0 md:border-r border-slate-200 p-6 shrink-0'>
              <div className='flex flex-col items-center text-center mb-8'>
                <h3 className='font-bold text-slate-900 text-lg mt-2'>{currentUser.hoTen}</h3>
                <p className='text-sm text-slate-500 mb-2 truncate max-w-[200px]'>{currentUser.email}</p>
              </div>

              {/* Navigation Tabs */}
              <TabsList className='flex flex-col w-full h-auto bg-transparent p-0 space-y-1'>
                <TabItem value='profile' icon={<User className='w-4 h-4' />} label='Hồ sơ cá nhân' />
                <TabItem value='security' icon={<Lock className='w-4 h-4' />} label='Mật khẩu & Bảo mật' />
              </TabsList>

              <div className='mt-8 pt-6 border-t border-slate-200'>
                <p className='text-xs text-slate-400 text-center'>
                  Thành viên từ {formatDate ? formatDate(new Date().toISOString()) : '2024'}
                </p>
              </div>
            </div>
            <div className='flex-1 p-6 lg:p-10 min-w-0'>
              {/* --- TAB 1: PROFILE FORM --- */}
              <TabsContent value='profile' className='mt-0 space-y-6 animate-in fade-in-50'>
                <div>
                  <h2 className='text-xl font-bold text-slate-900'>Hồ sơ công khai</h2>
                  <p className='text-sm text-slate-500'>Thông tin hiển thị trên trang cá nhân của bạn.</p>
                </div>
                <Separator />

                <form onSubmit={submitProfile(onSubmitProfile)} className='space-y-6 max-w-2xl'>
                  {/* Avatar Upload Area (Fancy UI) */}
                  <div className='space-y-4'>
                    <Label className='text-base font-semibold'>Ảnh đại diện</Label>
                    <div className='flex items-center gap-6'>
                      {/* Preview Image */}
                      <div className='relative w-24 h-24 sm:w-32 sm:h-32 shrink-0'>
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt='Avatar Preview'
                            className='w-full h-full object-cover rounded-full border-4 border-white shadow-md'
                          />
                        ) : (
                          <div className='w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-md'>
                            <User className='w-10 h-10 text-slate-400' />
                          </div>
                        )}
                        <div className='absolute bottom-0 right-0 bg-[#FF5722] p-2 rounded-full border-4 border-white text-white shadow-sm'>
                          <Camera className='w-4 h-4' />
                        </div>
                      </div>

                      {/* Upload Button & Hidden Input */}
                      <div className='flex flex-col gap-2'>
                        <div className='relative'>
                          <input
                            type='file'
                            id='avatar-upload'
                            accept='image/*'
                            className='hidden'
                            {...registerProfile('anhDaiDien', {
                              onChange: handleAvatarChange
                            })}
                          />
                          <label
                            htmlFor='avatar-upload'
                            className='inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors select-none'
                          >
                            <Camera className='w-4 h-4 mr-2 text-[#FF5722]' />
                            Tải ảnh mới
                          </label>
                        </div>
                        {profileErrors.anhDaiDien && (
                          <p className='text-red-500 text-xs font-medium'>{profileErrors.anhDaiDien.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label>Họ và tên</Label>
                      <Input {...registerProfile('hoTen')} className='focus-visible:ring-[#FF5722]' />
                      {profileErrors.hoTen && <p className='text-red-500 text-xs'>{profileErrors.hoTen.message}</p>}
                    </div>

                    <div className='space-y-2'>
                      <Label>Email</Label>
                      <Input disabled {...registerProfile('email')} className='bg-slate-50 text-slate-500' />
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='bg-[#FF5722] text-white hover:bg-[#F4511E] transition-colors'
                  >
                    {isLoading ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <>
                        <Save className='w-4 h-4 mr-2' /> Lưu thay đổi
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* --- TAB 2: SECURITY FORM --- */}
              <TabsContent value='security' className='mt-0 space-y-6 animate-in fade-in-50'>
                <div>
                  <h2 className='text-xl font-bold text-slate-900'>Đổi mật khẩu</h2>
                  <p className='text-sm text-slate-500'>Nhập mật khẩu hiện tại và tạo mật khẩu mới.</p>
                </div>
                <Separator />

                <form onSubmit={submitPassword(onSubmitPassword)} className='space-y-5 max-w-lg'>
                  {/* --- MẬT KHẨU HIỆN TẠI --- */}
                  <div className='space-y-2'>
                    <Label>Mật khẩu hiện tại</Label>
                    <div className='relative'>
                      <Input
                        type={showCurrentPass ? 'text' : 'password'} // Đổi type dựa theo state
                        {...registerPassword('matKhauHienTai')}
                        className='pr-10' // Thêm padding phải để chữ không đè lên icon
                      />
                      <button
                        type='button'
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
                      >
                        {showCurrentPass ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                    {passwordErrors.matKhauHienTai && (
                      <p className='text-red-500 text-xs'>{passwordErrors.matKhauHienTai.message}</p>
                    )}
                  </div>

                  {/* --- MẬT KHẨU MỚI --- */}
                  <div className='space-y-2'>
                    <Label>Mật khẩu mới</Label>
                    <div className='relative'>
                      <Input
                        type={showNewPass ? 'text' : 'password'}
                        {...registerPassword('matKhauMoi')}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowNewPass(!showNewPass)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
                      >
                        {showNewPass ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                    {passwordErrors.matKhauMoi && (
                      <p className='text-red-500 text-xs'>{passwordErrors.matKhauMoi.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label>Nhập lại mật khẩu mới</Label>
                    <div className='relative'>
                      <Input
                        type={showConfirmPass ? 'text' : 'password'}
                        {...registerPassword('xacNhanMatKhauMoi')}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
                      >
                        {showConfirmPass ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                    {passwordErrors.xacNhanMatKhauMoi && (
                      <p className='text-red-500 text-xs'>{passwordErrors.xacNhanMatKhauMoi.message}</p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60'
                  >
                    {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Cập nhật mật khẩu'}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}

// Helper Component: Sidebar Tab Item
function TabItem({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'w-full justify-start px-4 py-3 rounded-md text-sm font-medium transition-all',
        'data-[state=active]:bg-white data-[state=active]:text-[#FF5722] data-[state=active]:shadow-sm data-[state=active]:border-l-4 data-[state=active]:border-[#FF5722]',
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
      )}
    >
      <span className='mr-3'>{icon}</span>
      {label}
    </TabsTrigger>
  )
}
