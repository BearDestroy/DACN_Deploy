import type { LoaiDanhGia } from '@/@types/LoaiDanhGia.type'
import { http } from '@/utils/interceptor'
import type { loaiDanhGiaFormData } from '@/validations/loaidanhgia.schema'

export const layDSLoaiDanhGia = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<LoaiDanhGia>>('/loaidanhgias', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themLoaiDanhGia = (request: loaiDanhGiaFormData) => {
  return http.post<null>('/loaidanhgias', request)
}

export const suaLoaiDanhGia = (request: loaiDanhGiaFormData, id: number) => {
  return http.put<null>(`/loaidanhgias/${id}`, request)
}

export const xoaLoaiDanhGia = (id: number) => {
  return http.delete<null>(`/loaidanhgias/${id}`)
}

export const layTatCaLoaiDanhGia = () => {
  return http.get<LoaiDanhGia[]>(`/loaidanhgias/tatca`)
}
