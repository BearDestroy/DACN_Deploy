import type {
  BaiTap,
  IBaiTapTomTat,
  IChiTietBaiTap,
  IKetQuaLamBai,
  INopBaiTapRequest,
  QLBaiTapRequest
} from '@/@types/BaiTap'
import { http } from '@/utils/interceptor'

export const LayDanhSachBaiTap = (idBaiHoc: number) => {
  const urlApi = `/BaiTap/LayDanhSach/${idBaiHoc}`
  return http.get<IBaiTapTomTat[]>(urlApi)
}

export const LayChiTietBaiTap = (idBaiTap: number) => {
  const urlApi = `/BaiTap/${idBaiTap}`
  return http.get<IChiTietBaiTap>(urlApi)
}

export const NopBaiTap = (duLieuNop: INopBaiTapRequest) => {
  const urlApi = `/BaiTap/nop-bai`
  return http.post<IKetQuaLamBai>(urlApi, duLieuNop)
}

export const layDanhSachBaiTap = (
  soTrang: number | string,
  soLuong: number | string,
  trangThai: number | string,
  tuKhoa: string | null,
  idBaiHoc: number | string | null,
  idLoaiBaiTap: number | string | null
) => {
  return http.get<PhanTrang<BaiTap>>('/baitap', {
    params: { soTrang, soLuong, trangThai, tuKhoa, idBaiHoc, idLoaiBaiTap }
  })
}

export const layChiTietBaiTap = (id: number) => {
  return http.get<IChiTietBaiTap>(`/baitap/${id}`)
}

export const themBaiTap = (request: QLBaiTapRequest) => {
  return http.post('/baitap', request)
}

export const suaBaiTap = (id: number, request: QLBaiTapRequest) => {
  return http.put(`/baitap/${id}`, request)
}

export const xoaBaiTap = (id: number) => {
  return http.delete(`/baitap/${id}`)
}
