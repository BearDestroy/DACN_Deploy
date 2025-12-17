import type { LoaiBaiTap } from '@/@types/LoaiBaiTap.type'
import { http } from '@/utils/interceptor'
import type { loaiBaiTapFormData } from '@/validations/loaibaitap.schema'

export const layDSLoaiBaiTap = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<LoaiBaiTap>>('/loaibaitaps', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themLoaiBaiTap = (request: loaiBaiTapFormData) => {
  return http.post<null>('/loaibaitaps', request)
}

export const suaLoaiBaiTap = (request: loaiBaiTapFormData, id: number) => {
  return http.put<null>(`/loaibaitaps/${id}`, request)
}

export const xoaLoaiBaiTap = (id: number) => {
  return http.delete<null>(`/loaibaitaps/${id}`)
}

export const layTatCaLoaiBaiTap = () => {
  return http.get<LoaiBaiTap[]>(`/loaibaitaps/tatca`)
}
