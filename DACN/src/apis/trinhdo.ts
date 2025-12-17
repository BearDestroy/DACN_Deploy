import type { TrinhDo } from '@/@types/TrinhDo.type'
import { http } from '@/utils/interceptor'
import type { trinhDoFormData } from '@/validations/trinhdo.schema'

export const layDSTrinhDo = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<TrinhDo>>('/trinhdos', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themTrinhDo = (request: trinhDoFormData) => {
  return http.post<null>('/trinhdos', request)
}

export const suaTrinhDo = (request: trinhDoFormData, id: number) => {
  return http.put<null>(`/trinhdos/${id}`, request)
}

export const xoaTrinhDo = (id: number) => {
  return http.delete<null>(`/trinhdos/${id}`)
}

export const layTatCaTrinhDo = () => {
  return http.get<TrinhDo[]>(`/trinhdos/tatca`)
}
