import type { ChuDe } from '@/@types/ChuDe.type'
import { http } from '@/utils/interceptor'
import type { chuDeFormData } from '@/validations/chude.schema'

export const layDSChuDe = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null,
  idTheLoai: string | number
) => {
  return http.get<PhanTrang<ChuDe>>('/chudes', {
    params: { soTrang, soLuong, trangThai, tuKhoa, idTheLoai }
  })
}

export const themChuDe = (request: chuDeFormData) => {
  return http.post<null>('/chudes', request)
}

export const suaChuDe = (request: chuDeFormData, id: number) => {
  return http.put<null>(`/chudes/${id}`, request)
}

export const xoaChuDe = (id: number) => {
  return http.delete<null>(`/chudes/${id}`)
}

export const layTatCaChuDe = () => {
  return http.get<ChuDe[]>(`/chudes/tatca`)
}
