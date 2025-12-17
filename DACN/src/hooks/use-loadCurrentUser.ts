// hooks/use-loadCurrentUser.ts
import { LayThongTinNguoiDungAPI } from '@/apis/nguoidung'
import { useNguoiDung } from './useNguoiDung'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
export const useLoadCurrentUser = () => {
  const { setCurrentUser } = useNguoiDung()
  const token = localStorage.getItem('access_token')

  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: LayThongTinNguoiDungAPI,
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (data?.data) {
      setCurrentUser(data.data)
    }
    if (!token) {
      setCurrentUser(null)
    }
  }, [data, token, setCurrentUser])
  return isLoading
}
