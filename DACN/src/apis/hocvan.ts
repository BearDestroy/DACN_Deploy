import type { HocVan } from '@/@types/HocVan.type'
import { http } from '@/utils/interceptor'
import type { hocVanFormData } from '@/validations/hocvan.schema'

export const layDSHocVan = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<HocVan>>('/hocvans', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themHocVan = (request: hocVanFormData) => {
  return http.post<null>('/hocvans', request)
}

export const suaHocVan = (request: hocVanFormData, id: number) => {
  return http.put<null>(`/hocvans/${id}`, request)
}

export const xoaHocVan = (id: number) => {
  return http.delete<null>(`/hocvans/${id}`)
}

export const layTatCaHocVan = () => {
  return http.get<HocVan[]>(`/hocvans/tatca`)
}
