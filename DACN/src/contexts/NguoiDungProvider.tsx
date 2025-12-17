import { useEffect, useState, type ReactNode } from 'react'
import { NguoiDungContext } from './NguoiDungContext'
import type { IGetCurrentUser, IJobSearchResponse, IMucDichResponse } from '@/@types/Auth'
import { LayThongTinNguoiDungAPI } from '@/apis/nguoidung'

interface Props {
  children: ReactNode
}

export function NguoiDungProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<IGetCurrentUser | null>(null)
  const [selectedJob, setSelectedJob] = useState<IJobSearchResponse | null>(null)
  const [selectedMucDich, setSelectedMucDich] = useState<IMucDichResponse | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await LayThongTinNguoiDungAPI()
        setCurrentUser(res.data ?? null)
      } catch {
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const isAuthenticated = !!currentUser

  return (
    <NguoiDungContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedJob,
        setSelectedJob,
        selectedMucDich,
        setSelectedMucDich,
        isAuthenticated,
        loading
      }}
    >
      {children}
    </NguoiDungContext.Provider>
  )
}
