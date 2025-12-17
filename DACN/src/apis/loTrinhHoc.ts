import type {
  IChiTietLoTrinh,
  LoTrinhHoc,
  LoTrinhNguoiDung,
  QLLoTrinhHocChiTietResponse,
  QLLoTrinhHocResponse
} from '@/@types/LoTrinhHoc'
import type { KhoaHocOption } from '@/components/KhoaHocCarousel/KhoaHocCarousel'
import { http } from '@/utils/interceptor'
import type { LoTrinhHocFormData } from '@/validations/lotrinhhoc.schema'

export const LayDanhSachLoTrinhHoc = (refAPI: string) => {
  const urlApi = refAPI
  return http.get<IChiTietLoTrinh[]>(urlApi)
}

export const layChiTietLoTrinhHoc = (idLoTrinh: number) => {
  const urlApi = `/lo-trinh-hoc-chi-tiet/${idLoTrinh}`
  return http.get<IChiTietLoTrinh>(urlApi)
}

export const layLoTrinhHocTheoURL = (urlAPI: string) => {
  return http.get<LoTrinhHoc[]>(urlAPI)
}

export interface LoTrinhSearchParams {
  tuKhoa?: string
  idDanhMuc?: number
  sapXepTheo?: number
  idTrinhDo?: number
  soTrang: number
  soLuong: number
}
export const layLoTrinhSearch = (params: LoTrinhSearchParams) => {
  return http.get<PhanTrang<LoTrinhHoc>>('lo-trinh-hoc/search', { params })
}

export const layDanhSachLoTrinhHocNguoiDung = () => {
  return http.get<LoTrinhNguoiDung[]>('lo-trinh-hoc/nguoi-dung')
}

export const DangKyLoTrinhHoc = (idLoTrinhHoc: number) => {
  const urlApi = `/DangKyHoc/lo-trinh-hoc`
  return http.post<null>(urlApi, null, {
    params: { idLoTrinhHoc }
  })
}
export const layDSLoTrinhHoc = (params: {
  tuKhoa?: string | null
  soTrang?: number | string
  soLuong?: number | string
  trangThai?: number
  idMucDich?: number | null
  idTrinhDo?: number | null
  idNgheNghiep?: number | null
}) => {
  return http.get<PhanTrang<QLLoTrinhHocResponse>>('/QLLoTrinhHocs', { params })
}

export const layChiTietQLLoTrinhHoc = (id: number) => {
  return http.get<QLLoTrinhHocChiTietResponse>(`/QLLoTrinhHocs/${id}`)
}

export const buildLoTrinhHocFormData = (loTrinhHocRequest: LoTrinhHocFormData) => {
  const formData = new FormData()
  formData.append('tenLoTrinhHoc', loTrinhHocRequest.tenLoTrinhHoc)
  formData.append('maLoTrinhHoc', loTrinhHocRequest.maLoTrinhHoc ?? '')
  formData.append('moTaNgan', loTrinhHocRequest.moTaNgan ?? '')
  formData.append('noiDungHocDuoc', loTrinhHocRequest.noiDungHocDuoc ?? '')
  if (loTrinhHocRequest.idTrinhDo != null) formData.append('idTrinhDo', loTrinhHocRequest.idTrinhDo.toString())
  if (loTrinhHocRequest.idMucDich != null) formData.append('idMucDich', loTrinhHocRequest.idMucDich.toString())
  if (loTrinhHocRequest.idNgheNghiep != null) formData.append('idNgheNghiep', loTrinhHocRequest.idNgheNghiep.toString())
  formData.append('trangThai', loTrinhHocRequest.trangThai ? 'true' : 'false')

  if (loTrinhHocRequest.anhDaiDienFile instanceof File) {
    formData.append('anhDaiDienFile', loTrinhHocRequest.anhDaiDienFile)
  }

  ;(loTrinhHocRequest.danhSachKhoaHoc ?? []).forEach((kh, i) => {
    formData.append(`danhSachKhoaHoc[${i}].idKhoaHoc`, kh.idKhoaHoc.toString())
    formData.append(`danhSachKhoaHoc[${i}].idKhoaHocLoTrinh`, kh.idKhoaHocLoTrinh?.toString() ?? '')
    formData.append(`danhSachKhoaHoc[${i}].thuTu`, kh.thuTu.toString())
  })

  return formData
}

export const themLoTrinhHoc = (loTrinhHocRequest: LoTrinhHocFormData) => {
  const formData = buildLoTrinhHocFormData(loTrinhHocRequest)
  return http.post<null>('/QLLoTrinhHocs', formData)
}

export const suaLoTrinhHoc = (id: number, loTrinhHocRequest: LoTrinhHocFormData) => {
  const formData = buildLoTrinhHocFormData(loTrinhHocRequest)
  return http.put<null>(`/QLLoTrinhHocs/${id}`, formData)
}

export const xoaLoTrinhHoc = (id: number) => {
  return http.delete<null>(`/QLLoTrinhHocs/${id}`)
}

export const xoaKhoaHocTrongLoTrinh = (idKhoaHocLoTrinh: number) => {
  return http.delete<null>(`/QLLoTrinhHocs/khoahoc/${idKhoaHocLoTrinh}`)
}

export const layTatCaKhoaHoc = () => {
  return http.get<KhoaHocOption[]>(`/QLKhoaHocs/tat-ca`)
}
