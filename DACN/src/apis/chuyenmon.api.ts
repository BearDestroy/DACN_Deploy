import type { ChuyenMon } from '@/@types/ChuyenMon.type'
import { http } from '@/utils/interceptor'
import type { ChuyenMonFormData } from '@/validations/chuyenMon.schema'

export const layDSChuyenMon = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<ChuyenMon>>('/chuyenmons', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themChuyenMon = (request: ChuyenMonFormData) => {
  return http.post<null>('/chuyenmons', request)
}

export const suaChuyenMon = (request: ChuyenMonFormData, id: number) => {
  return http.put<null>(`/chuyenmons/${id}`, request)
}

export const xoaChuyenMon = (id: number) => {
  return http.delete<null>(`/chuyenmons/${id}`)
}

export const layTatCaChuyenMon = () => {
  return http.get<ChuyenMon[]>(`/chuyenmons/tatca`)
}
