import { NguoiDungContext } from '@/contexts/NguoiDungContext'
import { useContext } from 'react'

export function useNguoiDung() {
  const ctx = useContext(NguoiDungContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
