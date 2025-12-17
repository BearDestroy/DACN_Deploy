import type { MucDich } from '@/@types/MucDich.type'
import { http } from '@/utils/interceptor'
import type { mucDichFormData } from '@/validations/mucdich.schema'

export const layDSMucDich = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<MucDich>>('/mucdichs', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themMucDich = (request: mucDichFormData) => {
  return http.post<null>('/mucdichs', request)
}

export const suaMucDich = (request: mucDichFormData, id: number) => {
  return http.put<null>(`/mucdichs/${id}`, request)
}

export const xoaMucDich = (id: number) => {
  return http.delete<null>(`/mucdichs/${id}`)
}

export const layTatCaMucDich = () => {
  return http.get<MucDich[]>(`/mucdichs/tatca`)
}
