import type { GiangVien, GiangVienChiTiet, GiangVienResponse } from '@/@types/GiangVien.type'
import type { giangVienChiTiet } from '@/pages/User/ChiTietGiangVien'
import { http } from '@/utils/interceptor'
import type { GiangVienFormData } from '@/validations/giangvien.schema'

export const layTatCaGiangVien = () => {
  return http.get<GiangVien[]>(`/qlgiangviens/tatca`)
}

export const layDSGiangVien = (
  soTrang: number | string = 1,
  soLuong: number | string = 10,
  tuKhoa: string | null = null
) => {
  return http.get<PhanTrang<GiangVienResponse>>('/qlgiangviens', {
    params: { soTrang, soLuong, tuKhoa }
  })
}

export const layChiTietGiangVien = (id: number) => {
  return http.get<GiangVienChiTiet>(`/qlgiangviens/${id}`)
}

export const buildGiangVienFormData = (giangVienRequest: GiangVienFormData) => {
  const formData = new FormData()

  formData.append('TenGiangVien', giangVienRequest.tenGiangVien)
  formData.append('MaGiangVien', giangVienRequest.maGiangVien ?? '')
  formData.append('Email', giangVienRequest.email ?? '')
  formData.append('SoDienThoai', giangVienRequest.soDienThoai)
  formData.append('IdChuyenMon', giangVienRequest.idChuyenMon.toString())
  formData.append('IdHocVan', (giangVienRequest.idHocVan ?? '').toString())
  formData.append('KinhNghiem', giangVienRequest.kinhNghiem ?? '')

  if (giangVienRequest.anhDaiDienFile instanceof File) {
    formData.append('AnhDaiDienFile', giangVienRequest.anhDaiDienFile)
  }

  return formData
}

// Thêm giảng viên
export const themGiangVien = (giangVienRequest: GiangVienFormData) => {
  const formData = buildGiangVienFormData(giangVienRequest)
  return http.post<null>('/qlgiangviens', formData)
}

// Sửa giảng viên
export const suaGiangVien = (id: number, giangVienRequest: GiangVienFormData) => {
  const formData = buildGiangVienFormData(giangVienRequest)
  return http.put<null>(`/qlgiangviens/${id}`, formData)
}

// Xóa (ẩn hiện) giảng viên
export const xoaGiangVien = (id: number) => {
  return http.delete<null>(`/qlgiangviens/${id}`)
}

export const layThongTinGiangVien = (id: number) => {
  return http.get<giangVienChiTiet>(`/giang-vien/${id}`)
}
