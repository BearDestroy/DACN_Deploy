import type { NgheNghiep } from '@/@types/NgheNghiep.type'
import { http } from '@/utils/interceptor'
import type { ngheNghiepFormData } from '@/validations/nghenghiep.schema'

export const layDSNgheNghiep = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<NgheNghiep>>('/nghenghieps', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themNgheNghiep = (request: ngheNghiepFormData) => {
  return http.post<null>('/nghenghieps', request)
}

export const suaNgheNghiep = (request: ngheNghiepFormData, id: number) => {
  return http.put<null>(`/nghenghieps/${id}`, request)
}

export const xoaNgheNghiep = (id: number) => {
  return http.delete<null>(`/nghenghieps/${id}`)
}

export const layTatCaNgheNghiep = () => {
  return http.get<NgheNghiep[]>(`/nghenghieps/tatca`)
}

export const layDSNgheNghiepPhoBien = (tuKhoa: string | null) => {
  return http.get<NgheNghiep[]>('/nghenghieps/pho-bien', {
    params: { tuKhoa }
  })
}
