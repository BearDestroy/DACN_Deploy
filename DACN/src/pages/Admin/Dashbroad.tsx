import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, MoreHorizontal, ArrowUpRight, ArrowDownRight, Map, AlertCircle, Loader2 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { LayDuLieuDashboard } from '@/apis/dashbroad'

export default function Dashboard() {
  const {
    data: response,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: LayDuLieuDashboard,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })

  const dashboardData = response?.data

  const chartRegistrationData = useMemo(() => {
    return (
      dashboardData?.bieuDo.dangKyMoi.map((item) => ({
        name: item.thu,
        students: item.soLuong,
        fullDate: item.ngayDayDu
      })) || []
    )
  }, [dashboardData])

  const chartCategoryData = useMemo(() => {
    return (
      dashboardData?.bieuDo.danhMuc.map((item) => ({
        name: item.ten,
        value: item.soLuong,
        color: item.mauSac || '#cbd5e1'
      })) || []
    )
  }, [dashboardData])

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-slate-50'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-orange-600' />
          <p className='text-sm text-slate-500'>Đang tải dữ liệu hệ thống...</p>
        </div>
      </div>
    )
  }

  if (isError || !dashboardData) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <AlertCircle className='mx-auto h-10 w-10 text-red-500 mb-2' />
          <h3 className='text-lg font-bold text-slate-800'>Không thể tải dữ liệu</h3>
          <p className='text-slate-500'>Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6 bg-slate-50 min-h-screen'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>Tổng quan hệ thống</h1>
          <p className='text-slate-500 text-sm'>Chào mừng trở lại! Dưới đây là báo cáo hôm nay.</p>
        </div>
        <div className='flex gap-2'>
          <button className='px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors'>
            Xuất báo cáo
          </button>
          <button className='px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm shadow-orange-200 transition-colors'>
            Cập nhật dữ liệu
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard
          title={dashboardData.chiSo.hocVienMoi.tieuDe}
          value={dashboardData.chiSo.hocVienMoi.giaTri.toLocaleString('vi-VN')}
          change={`${dashboardData.chiSo.hocVienMoi.thayDoi > 0 ? '+' : ''}${dashboardData.chiSo.hocVienMoi.thayDoi}%`}
          trend={dashboardData.chiSo.hocVienMoi.xuHuong === 'giam' ? 'down' : 'up'}
          icon={<Users className='w-5 h-5 text-blue-600' />}
          bgIcon='bg-blue-100'
          description={dashboardData.chiSo.hocVienMoi.moTa}
        />
        <StatCard
          title={dashboardData.chiSo.khoaHocHoatDong.tieuDe}
          value={dashboardData.chiSo.khoaHocHoatDong.giaTri.toLocaleString('vi-VN')}
          change={`${dashboardData.chiSo.khoaHocHoatDong.thayDoi > 0 ? '+' : ''}${dashboardData.chiSo.khoaHocHoatDong.thayDoi}%`}
          trend={dashboardData.chiSo.khoaHocHoatDong.xuHuong === 'giam' ? 'down' : 'up'}
          icon={<BookOpen className='w-5 h-5 text-orange-600' />}
          bgIcon='bg-orange-100'
          description={dashboardData.chiSo.khoaHocHoatDong.moTa}
        />
        <StatCard
          title={dashboardData.chiSo.baoCaoViPham.tieuDe}
          value={dashboardData.chiSo.baoCaoViPham.giaTri.toLocaleString('vi-VN')}
          change={`${dashboardData.chiSo.baoCaoViPham.thayDoi > 0 ? '+' : ''}${dashboardData.chiSo.baoCaoViPham.thayDoi}%`}
          trend={dashboardData.chiSo.baoCaoViPham.xuHuong === 'tang' ? 'up' : 'down'}
          icon={<AlertCircle className='w-5 h-5 text-red-600' />}
          bgIcon='bg-red-100'
          description={dashboardData.chiSo.baoCaoViPham.moTa}
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Biểu đồ đăng ký */}
        <div className='lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-bold text-slate-800'>Lượng đăng ký học viên (7 ngày)</h3>
            <button className='text-slate-400 hover:text-slate-600'>
              <MoreHorizontal className='w-5 h-5' />
            </button>
          </div>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={chartRegistrationData}>
                <defs>
                  <linearGradient id='colorStudents' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#f97316' stopOpacity={0.2} />
                    <stop offset='95%' stopColor='#f97316' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
                <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: number) => [value, 'Học viên']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return `Ngày: ${payload[0].payload.fullDate}`
                    }
                    return label
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type='monotone'
                  dataKey='students'
                  stroke='#f97316'
                  strokeWidth={3}
                  fillOpacity={1}
                  fill='url(#colorStudents)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ danh mục */}
        <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
          <h3 className='font-bold text-slate-800 mb-2'>Danh mục phổ biến</h3>
          <p className='text-xs text-slate-500 mb-6'>Phân bổ theo lĩnh vực</p>
          <div className='h-[200px] w-full relative'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={chartCategoryData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {chartCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Khóa học/Học viên']} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
              <span className='text-2xl font-bold text-slate-800'>
                {chartCategoryData.reduce((acc, item) => acc + item.value, 0).toLocaleString('vi-VN')}
              </span>
              <span className='text-xs text-slate-500'>Tổng số</span>
            </div>
          </div>
          {/* Legend */}
          <div className='mt-6 space-y-3'>
            {chartCategoryData.map((item) => (
              <div key={item.name} className='flex justify-between items-center text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                  <span className='text-slate-600 truncate max-w-[150px]'>{item.name}</span>
                </div>
                {/* Tính phần trăm tương đối */}
                <span className='font-medium text-slate-800'>
                  {Math.round((item.value / chartCategoryData.reduce((a, b) => a + b.value, 0)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- POPULAR LISTS SECTION --- */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Khóa học phổ biến */}
        <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <BookOpen className='w-5 h-5 text-orange-600' /> Top Khóa học
            </h3>
            <button className='text-sm text-orange-600 hover:underline font-medium'>Xem tất cả</button>
          </div>
          <div className='space-y-4'>
            {dashboardData.danhSach.khoaHocTieuBieu.map((course) => (
              <div
                key={course.id}
                className='flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors'
              >
                <div className='w-10 h-10 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center text-orange-500 font-bold'>
                  {course.tenKhoaHoc.charAt(0)}
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-slate-800 truncate'>{course.tenKhoaHoc}</h4>
                  <p className='text-sm text-slate-500'>{course.giangVien}</p>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-slate-800'>{course.soLuongHocVien.toLocaleString('vi-VN')}</div>
                  <div className='text-xs text-slate-500'>học viên</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <Map className='w-5 h-5 text-blue-600' /> Top Lộ trình
            </h3>
            <button className='text-sm text-orange-600 hover:underline font-medium'>Xem tất cả</button>
          </div>
          <div className='space-y-6'>
            {dashboardData.danhSach.loTrinhTieuBieu.length > 0 ? (
              dashboardData.danhSach.loTrinhTieuBieu.map((path) => (
                <div key={path.id}>
                  <div className='flex justify-between items-center mb-2'>
                    <div>
                      <h4 className='font-semibold text-slate-800'>{path.tenLoTrinh}</h4>
                      <p className='text-xs text-slate-500'>
                        {path.soKhoaHoc} khóa học • {path.tongHocVien.toLocaleString('vi-VN')} người theo học
                      </p>
                    </div>
                    <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold'>#{path.id}</div>
                  </div>
                  <div className='w-full bg-slate-100 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full transition-all duration-500'
                      style={{ width: `${path.tienDoTrungBinh}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-slate-400 text-sm py-4'>Chưa có dữ liệu lộ trình nổi bật</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT: STAT CARD ---
interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  bgIcon: string
  description?: string
}

function StatCard({ title, value, change, trend, icon, bgIcon, description }: StatCardProps) {
  // Logic màu sắc:
  // Nếu là báo cáo: Tăng (up) là Xấu (Đỏ), Giảm (down) là Tốt (Xanh)
  // Các cái khác: Tăng (up) là Tốt (Xanh), Giảm (down) là Xấu (Đỏ)
  const isReport = title.toLowerCase().includes('báo cáo') || title.toLowerCase().includes('khiếu nại')

  let trendColorClass = ''
  let TrendIcon = ArrowUpRight

  if (trend === 'up') {
    TrendIcon = ArrowUpRight
    trendColorClass = isReport ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
  } else {
    TrendIcon = ArrowDownRight
    trendColorClass = isReport ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  }

  return (
    <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div className={`p-3 rounded-lg ${bgIcon}`}>{icon}</div>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendColorClass}`}>
          <TrendIcon className='w-3 h-3 mr-1' />
          {change}
        </div>
      </div>
      <div>
        <h3 className='text-sm font-medium text-slate-500 mb-1'>{title}</h3>
        <div className='text-2xl font-bold text-slate-900'>{value}</div>
        {description && <p className='text-xs text-slate-400 mt-1'>{description}</p>}
      </div>
    </div>
  )
}
