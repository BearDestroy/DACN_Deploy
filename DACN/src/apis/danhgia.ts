import { http } from '@/utils/interceptor'
import type { DanhGiaRequest } from '@/validations/danhgia.schema'

export const themDanhGia = (request: DanhGiaRequest) => {
  return http.post<null>('/danhgia/them', request)
}

// Sửa đánh giá
export const suaDanhGia = (request: DanhGiaRequest) => {
  return http.put<null>('/danhgia/sua', request)
}

// Xóa đánh giá theo id khóa học
export const xoaDanhGia = (idKhoaHoc: number) => {
  return http.delete<null>(`/danhgia/xoa/${idKhoaHoc}`)
}
