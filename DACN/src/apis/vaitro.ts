import type { VaiTro } from '@/@types/VaiTro.type'
import { http } from '@/utils/interceptor'
import type { vaiTroFormData } from '@/validations/vaitro.schema'

export const layDSVaiTro = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<VaiTro>>('/vaitros', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themVaiTro = (request: vaiTroFormData) => {
  return http.post<null>('/vaitros', request)
}

export const suaVaiTro = (request: vaiTroFormData, id: number) => {
  return http.put<null>(`/vaitros/${id}`, request)
}

export const xoaVaiTro = (id: number) => {
  return http.delete<null>(`/vaitros/${id}`)
}

export const layTatCaVaiTro = () => {
  return http.get<VaiTro[]>(`/vaitros/tatca`)
}
