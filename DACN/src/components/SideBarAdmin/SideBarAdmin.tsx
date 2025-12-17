// src/components/SideBarAdmin.tsx
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  Layers,
  PieChart
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useNguoiDung } from '@/hooks/useNguoiDung' // Import hook
import { showSuccessToast } from '@/utils/toast'
import { useQueryClient } from '@tanstack/react-query'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  path?: string
  children?: { label: string; path: string }[]
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const { currentUser, setCurrentUser } = useNguoiDung()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className='h-5 w-5' />,
      path: '/admin/dashbroad'
    },
    {
      label: 'Quản lý Danh mục',
      icon: <Layers className='h-5 w-5' />,
      children: [
        { label: 'Chuyên môn', path: '/admin/chuyen-mon' },
        { label: 'Danh mục', path: '/admin/danh-muc' },
        { label: 'Thể loại', path: '/admin/the-loai' },
        { label: 'Chủ đề', path: '/admin/chu-de' }
      ]
    },
    {
      label: 'Cấu hình Thuộc tính',
      icon: <Settings className='h-5 w-5' />,
      children: [
        { label: 'Độ khó', path: '/admin/do-kho' },
        { label: 'Trình độ', path: '/admin/trinh-do' },
        { label: 'Học vấn', path: '/admin/hoc-van' },
        { label: 'Mục đích', path: '/admin/muc-dich' },
        { label: 'Nghề nghiệp', path: '/admin/nghe-nghiep' }
      ]
    },
    {
      label: 'Đào tạo & Khảo thí',
      icon: <BookOpen className='h-5 w-5' />,
      children: [
        { label: 'Khóa học', path: '/admin/khoa-hoc' },
        { label: 'Lộ trình học', path: '/admin/lo-trinh-hoc' },
        { label: 'Loại bài tập', path: '/admin/loai-bai-tap' },
        { label: 'Loại câu hỏi', path: '/admin/loai-cau-hoi' },
        { label: 'Loại đánh giá', path: '/admin/loai-danh-gia' }
      ]
    },
    {
      label: 'Người dùng & Hệ thống',
      icon: <Users className='h-5 w-5' />,
      children: [
        { label: 'Người dùng', path: '/admin/nguoi-dung' },
        { label: 'Giảng viên', path: '/admin/giang-vien' },
        { label: 'Vai trò', path: '/admin/vai-tro' }
      ]
    },
    {
      label: 'Báo cáo & Thống kê',
      icon: <PieChart className='h-5 w-5' />,
      children: [
        { label: 'BC Đánh giá', path: '/admin/bao-cao-danh-gia' },
        { label: 'BC Khóa học', path: '/admin/bao-cao-khoa-hoc' }
      ]
    }
  ]

  // ... (Giữ nguyên logic useEffect, toggleExpanded, handleNavigate, isActive) ...
  useEffect(() => {
    const currentPath = location.pathname
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => currentPath.includes(child.path))
        if (hasActiveChild && !expandedItems.includes(item.label)) {
          setExpandedItems((prev) => [...prev, item.label])
        }
      }
    })
  }, [location.pathname])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const isActive = (path: string) => {
    if (path === '/admin/dashbroad' && (location.pathname === '/admin' || location.pathname === '/admin/dashbroad')) {
      return true
    }
    return location.pathname.startsWith(path)
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

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className='flex flex-col h-full'>
        {/* Toggle Button */}
        <div className='flex justify-end p-2 border-b border-gray-100'>
          <Button variant='ghost' size='icon' onClick={onToggle} className='hover:bg-gray-100'>
            {collapsed ? (
              <ChevronRight className='h-5 w-5 text-gray-500' />
            ) : (
              <ChevronLeft className='h-5 w-5 text-gray-500' />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className='flex-1 overflow-y-auto p-2 scrollbar-hide'>
          <ul className='space-y-1'>
            {menuItems.map((item) => {
              const isParentActive = item.children?.some((child) => isActive(child.path))
              const isExpanded = expandedItems.includes(item.label)

              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      if (item.children) {
                        if (!collapsed) toggleExpanded(item.label)
                      } else if (item.path) {
                        handleNavigate(item.path)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200 group ${
                      !item.children && item.path && isActive(item.path)
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                        : isParentActive
                          ? 'bg-orange-50 text-orange-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`${!item.children && item.path && isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`}
                      >
                        {item.icon}
                      </div>
                      {!collapsed && <span className='text-sm'>{item.label}</span>}
                    </div>

                    {!collapsed && item.children && (
                      <span className='text-slate-400'>
                        {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {!collapsed && item.children && isExpanded && (
                    <ul className='mt-1 ml-4 space-y-1 border-l-2 border-slate-100 pl-2 animate-in slide-in-from-top-2 duration-200'>
                      {item.children.map((child) => {
                        const active = isActive(child.path)
                        return (
                          <li key={child.label}>
                            <button
                              onClick={() => handleNavigate(child.path)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                active
                                  ? 'bg-orange-100 text-orange-700 font-medium'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {child.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer User Info - CẬP NHẬT PHẦN NÀY */}
        <div className='border-t border-gray-100 p-4 bg-gray-50/50'>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <Avatar className='h-9 w-9 border border-white shadow-sm cursor-pointer'>
              <AvatarImage
                src={
                  '1.55.203.158:5154/' + currentUser?.anhDaiDien ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
                }
              />
              <AvatarFallback>{currentUser?.hoTen?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className='flex flex-col overflow-hidden'>
                <span className='font-semibold text-sm text-slate-800 truncate'>
                  {currentUser?.hoTen || 'Người dùng'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={xuLyDangXuat}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full mt-4 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors group`}
          >
            <LogOut className='h-5 w-5 group-hover:scale-110 transition-transform' />
            {!collapsed && <span className='text-sm font-medium'>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
