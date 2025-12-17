import type { IGetCurrentUser } from '@/@types/Auth'
import type { NguoiDungChiTiet, NguoiDungResponse } from '@/@types/NguoiDung'
import { http } from '@/utils/interceptor'
import type { NguoiDungFormData } from '@/validations/nguoidung.schema'

export const layDSNguoiDung = (
  soTrang: number | string = 1,
  soLuong: number | string = 10,
  tuKhoa: string | null = null
) => {
  return http.get<PhanTrang<NguoiDungResponse>>('/nguoidungs', {
    params: { soTrang, soLuong, tuKhoa }
  })
}

export const layChiTietNguoiDung = (id: number) => {
  return http.get<NguoiDungChiTiet>(`/nguoidungs/${id}`)
}

export const buildNguoiDungFormData = (nguoiDungRequest: NguoiDungFormData) => {
  const formData = new FormData()

  formData.append('TenNguoiDung', nguoiDungRequest.tenNguoiDung)
  formData.append('Email', nguoiDungRequest.email ?? '')
  formData.append('IdNgheNghiep', (nguoiDungRequest.idNgheNghiep ?? '').toString())
  formData.append('IdMucDich', (nguoiDungRequest.idMucDich ?? '').toString())

  if (nguoiDungRequest.anhDaiDienFile instanceof File) {
    formData.append('AnhDaiDienFile', nguoiDungRequest.anhDaiDienFile)
  }

  ;(nguoiDungRequest.idVaiTro ?? []).forEach((idVaiTro, i) => {
    formData.append(`IdVaiTro[${i}]`, idVaiTro.toString())
  })

  return formData
}

export const themNguoiDung = (nguoiDungRequest: NguoiDungFormData) => {
  const formData = buildNguoiDungFormData(nguoiDungRequest)
  return http.post<null>('/nguoidungs', formData)
}

export const suaNguoiDung = (id: number, nguoiDungRequest: NguoiDungFormData) => {
  const formData = buildNguoiDungFormData(nguoiDungRequest)
  return http.put<null>(`/nguoidungs/${id}`, formData)
}

export const xoaNguoiDung = (id: number) => {
  return http.delete<null>(`/nguoidungs/${id}`)
}

export const DoiMatKhauAPI = (matKhauHienTai: string, matKhauMoi: string) => {
  return http.post<null>('/auth/doi-mat-khau', {
    matKhauHienTai,
    matKhauMoi
  })
}

export const QuenMatKhauAPI = (matKhauMoi: string) => {
  return http.post<null>('/auth/quen-mat-khau', {
    matKhauMoi
  })
}

export const CapNhatThongTinNguoiDungAPI = (formData: FormData) => {
  const urlApi = `/auth/cap-nhat-thong-tin`
  return http.post<null>(urlApi, formData)
}

export const LayThongTinNguoiDungAPI = () => {
  const urlApi = `auth/thong-tin-nguoi-dung`
  return http.get<IGetCurrentUser>(urlApi)
}

export const CapNhatNgheNghiep = (idMucDich?: number, idNgheNghiep?: number) => {
  const urlApi = `/auth/chon-nghe-nghiep`
  return http.post<null>(urlApi, null, {
    params: { idMucDich, idNgheNghiep }
  })
}
