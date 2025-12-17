import type { TheLoai } from '@/@types/TheLoai.type'
import { http } from '@/utils/interceptor'
import type { theLoaiFormData } from '@/validations/theloai.schema'

export const layDSTheLoai = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null,
  idDanhMuc: string | number
) => {
  return http.get<PhanTrang<TheLoai>>('/theloais', {
    params: { soTrang, soLuong, trangThai, tuKhoa, idDanhMuc }
  })
}

export const themTheLoai = (request: theLoaiFormData) => {
  return http.post<null>('/theloais', request)
}

export const suaTheLoai = (request: theLoaiFormData, id: number) => {
  return http.put<null>(`/theloais/${id}`, request)
}

export const xoaTheLoai = (id: number) => {
  return http.delete<null>(`/theloais/${id}`)
}

export const layTatCaTheLoai = () => {
  return http.get<TheLoai[]>(`/theloais/tatca`)
}
