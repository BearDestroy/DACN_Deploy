import { useState } from 'react'
import Sidebar from '@/components/SideBarAdmin'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      <div className='transition-all duration-300 ease-in-out' style={{ width: collapsed ? 64 : 256 }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      <div className='flex-1 flex flex-col bg-white overflow-hidden'>
        <main className='flex-1 overflow-auto p-3'>
          <div className='w-full h-full animate-in fade-in duration-500 px-3'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
