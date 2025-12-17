import type { BaoCaoKhoaHoc, BaoCaoKhoaHocChiTiet, BaoCaoKhoaHocRequest } from '@/@types/BaoCaoKhoaHoc'
import { http } from '@/utils/interceptor'

export const layChiTietBaoCaoKhoaHoc = (id: number) => {
  return http.get<BaoCaoKhoaHocChiTiet>(`/QLBaoCao/khoahoc/${id}`)
}

export const xoaBaoCaoKhoaHoc = (id: number) => {
  return http.delete(`/QLBaoCao/khoahoc/${id}`)
}

export const layDSBaoCaoKhoaHoc = (
  soTrang: number | string,
  soLuong: number | string,
  tuKhoa: string | null,
  ngayBatDau: string | null,
  ngayKetThuc: string | null,
  idLoaiBaoCao: number | string | null,
  trangThai: string
) => {
  return http.get<PhanTrang<BaoCaoKhoaHoc>>(`/QLBaoCao/khoahoc`, {
    params: {
      tuKhoa,
      soTrang,
      soLuong,
      ngayBatDau,
      ngayKetThuc,
      idLoaiBaoCao,
      trangThai
    }
  })
}
export const duyetBaoCaoKhoaHoc = (id: number) => {
  return http.put<null>(`/QLBaoCao/khoahoc/duyet/${id}`)
}

export const suaBaoCaoKhoaHoc = (id: number, idLoaiBaoCao: number) => {
  return http.put<null>(`/QLBaoCao/khoahoc/sua/${id}`, null, {
    params: {
      idLoaiBaoCao
    }
  })
}

export const baoCaoKhoaHoc = (data: BaoCaoKhoaHocRequest) => {
  return http.post<null>(`/BaoCao/khoa-hoc`, data)
}
