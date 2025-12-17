import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronDown, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import React, { useState } from 'react'
import { UdemyLogo } from './common/UdemyLogo'
import { useNguoiDung } from '@/hooks/useNguoiDung'
import { layTatCaDanhMuc } from '@/apis/danhmuc.api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { DanhMuc } from '@/@types/DanhMuc.type'
import { useLoadCurrentUser } from '@/hooks/use-loadCurrentUser'
import { showSuccessToast } from '@/utils/toast'

interface LayoutProps {
  children: React.ReactNode
}
interface ChildWithDanhMuc {
  danhMuc?: DanhMuc[]
}

export function Layout({ children }: LayoutProps) {
  const loadingUser = useLoadCurrentUser()

  const { currentUser, isAuthenticated, setCurrentUser } = useNguoiDung()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`khoa-hoc/search?tuKhoa=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const queryClient = useQueryClient()
  const xuLyDangXuat = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    queryClient.clear()
    showSuccessToast({ message: 'Đăng xuất thành công' })
    navigate('/dang-nhap')
  }

  const { data: danhMucs = [] } = useQuery({
    queryKey: ['danhmucs'],
    queryFn: async () => {
      const res = await layTatCaDanhMuc()
      return res.data || []
    },
    staleTime: 10 * 60 * 1000
  })

  if (loadingUser) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-white'>
        <div className='h-10 w-10 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <header className='border-b border-[#D1D7E0] sticky top-0 bg-white z-50 shadow-sm'>
        <div className='px-6'>
          <div className='flex items-center h-[72px] gap-6'>
            <Link to='/' className='flex items-center gap-2 shrink-0'>
              <UdemyLogo />
            </Link>

            <div
              className='hidden lg:block relative'
              onMouseEnter={() => setShowCategoriesMenu(true)}
              onMouseLeave={() => setShowCategoriesMenu(false)}
            >
              <button className='px-3 py-2 text-[#1C1D1F] hover:text-[#FF5722] hover:bg-[#F7F9FA] rounded flex items-center gap-1 text-[14px] font-normal transition-all duration-200'>
                Danh mục
                <ChevronDown className='h-4 w-4' />
              </button>

              {showCategoriesMenu && (
                <div className='absolute top-full left-0 mt-0 bg-white border border-[#D1D7E0] shadow-lg rounded min-w-60 py-2 z-50'>
                  {danhMucs.slice(0, 12).map((dm) => (
                    <Link
                      key={dm.id}
                      to={`/khoa-hoc/search?idDanhMuc=${dm.id}`}
                      className='block px-4 py-2 text-[14px] text-[#1C1D1F] hover:bg-[#F7F9FA] hover:text-[#FF5722] transition-all duration-200'
                    >
                      {dm.tenDanhMuc}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className='hidden md:flex flex-1 max-w-[750px]'>
              <div className='relative flex-1'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1C1D1F]' />
                <input
                  type='text'
                  placeholder='Tìm kiếm khóa học'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 border border-[#1C1D1F] rounded-full text-[14px] text-[#1C1D1F] placeholder-[#6A6C70] focus:outline-none focus:border-[#FF5722] focus:border-2 transition-all duration-200 bg-white'
                />
              </div>
            </form>

            <div className='flex items-center gap-2 ml-auto'>
              {isAuthenticated ? (
                <>
                  <Link
                    to='/khoa-hoc-cua-toi/'
                    className='hidden sm:block p-2 hover:bg-[#F7F9FA] rounded transition-all duration-200 hover:scale-110'
                  >
                    <BookOpen className='h-5 w-5 text-[#1C1D1F]' />
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className='p-2 hover:bg-[#FFF3E0] rounded transition-all duration-200 hover:scale-110'>
                        {currentUser?.anhDaiDien ? (
                          <img
                            src={'1.55.203.158:5154' + currentUser.anhDaiDien}
                            alt={currentUser.hoTen}
                            className='h-8 w-8 rounded-full object-cover'
                          />
                        ) : (
                          <div className='h-8 w-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[14px] font-bold'>
                            {currentUser?.hoTen?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-56 bg-white border-[#D1D7E0]'>
                      <div className='px-3 py-2'>
                        <p className='text-[14px] font-bold text-[#1C1D1F]'>{currentUser?.hoTen}</p>
                        <p className='text-[#6A6C70]'>{currentUser?.email}</p>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link to='/ho-so-ca-nhan' className='cursor-pointer text-[14px]'>
                          Thông tin cá nhân
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={xuLyDangXuat} className='cursor-pointer text-[14px] text-[#EC5252]'>
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant='outline'
                    className='hidden sm:flex border-[#FF5722] text-[#FF5722] hover:bg-[#FFCCBC] text-[14px] font-bold h-10 px-4'
                  >
                    <Link to='/dang-nhap'>Đăng nhập</Link>
                  </Button>

                  <Button
                    asChild
                    className='bg-[#FF5722] hover:bg-[#E64A19] text-white text-[14px] font-bold h-10 px-4'
                  >
                    <Link to='/dang-ky'>Đăng ký</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className='flex-1 bg-white'>
        <div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<ChildWithDanhMuc>(child)) {
              return React.cloneElement(child, { danhMuc: danhMucs.slice(0, 12) })
            }
            return child
          })}
        </div>
      </main>

      <footer className='bg-[#1C1D1F] text-white mt-20'>
        <div className='max-w-[1340px] mx-auto px-6 py-12'>
          <h3 className='text-[16px] font-bold mb-4'>Liên hệ & Hỗ trợ</h3>
          <ul className='space-y-2 text-[14px]'>
            <li>
              <a href='#' className='text-[#6A6C70] hover:text-[#FF5722] hover:underline'>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href='#' className='text-[#6A6C70] hover:text-[#FF5722] hover:underline'>
                Liên hệ
              </a>
            </li>
            <li>
              <a href='#' className='text-[#6A6C70] hover:text-[#FF5722] hover:underline'>
                Hỗ trợ
              </a>
            </li>
            <li>
              <a href='#' className='text-[#6A6C70] hover:text-[#FF5722] hover:underline'>
                Điều khoản
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
