import type { DanhMuc } from '@/@types/DanhMuc.type'
import { http } from '@/utils/interceptor'
import type { DanhMucFormData } from '@/validations/danhMuc.schema'

export const layDSDanhMuc = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<DanhMuc>>('/danhmucs', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themDanhMuc = (request: DanhMucFormData) => {
  return http.post<null>('/danhmucs', request)
}

export const suaDanhMuc = (request: DanhMucFormData, id: number) => {
  return http.put<null>(`/danhmucs/${id}`, request)
}

export const xoaDanhMuc = (id: number) => {
  return http.delete<null>(`/danhmucs/${id}`)
}

export const layTatCaDanhMuc = () => {
  return http.get<DanhMuc[]>(`/danhmucs/tatca`)
}
