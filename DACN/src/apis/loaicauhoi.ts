import type { LoaiCauHoi } from '@/@types/LoaiCauHoi.type'
import { http } from '@/utils/interceptor'
import type { loaiCauHoiFormData } from '@/validations/loaicauhoi.schema'

export const layDSLoaiCauHoi = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<LoaiCauHoi>>('/loaicauhois', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themLoaiCauHoi = (request: loaiCauHoiFormData) => {
  return http.post<null>('/loaicauhois', request)
}

export const suaLoaiCauHoi = (request: loaiCauHoiFormData, id: number) => {
  return http.put<null>(`/loaicauhois/${id}`, request)
}

export const xoaLoaiCauHoi = (id: number) => {
  return http.delete<null>(`/loaicauhois/${id}`)
}

export const layTatCaLoaiCauHoi = () => {
  return http.get<LoaiCauHoi[]>(`/loaicauhois/tatca`)
}
