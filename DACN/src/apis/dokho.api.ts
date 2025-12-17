import type { DoKho } from '@/@types/DoKho.type'
import { http } from '@/utils/interceptor'
import type { doKhoFormData } from '@/validations/dokho.schema'

export const layDSDoKho = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null
) => {
  return http.get<PhanTrang<DoKho>>('/dokhos', {
    params: { soTrang, soLuong, trangThai, tuKhoa }
  })
}

export const themDoKho = (request: doKhoFormData) => {
  return http.post<null>('/dokhos', request)
}

export const suaDoKho = (request: doKhoFormData, id: number) => {
  return http.put<null>(`/dokhos/${id}`, request)
}

export const xoaDoKho = (id: number) => {
  return http.delete<null>(`/dokhos/${id}`)
}
