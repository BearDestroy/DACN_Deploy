import type { BaoCaoDanhGia, BaoCaoDanhGiaChiTiet, BaoCaoDanhGiaRequest } from '@/@types/BaoCaoDanhGia'
import { http } from '@/utils/interceptor'

// Lấy chi tiết báo cáo
export const layChiTietBaoCaoDanhGia = (id: number) => {
  return http.get<BaoCaoDanhGiaChiTiet>(`/QLBaoCao/danhgia/${id}`)
}

// Xóa báo cáo
export const xoaBaoCaoDanhGia = (id: number) => {
  return http.delete<null>(`/QLBaoCao/danhgia/${id}`)
}

// Lấy danh sách báo cáo
export const layDSBaoCaoDanhGia = (
  soTrang: number | string,
  soLuong: number | string,
  tuKhoa: string | null,
  ngayBatDau: string | null,
  ngayKetThuc: string | null,
  idLoaiBaoCao: number | string | null,
  trangThai: string
) => {
  return http.get<PhanTrang<BaoCaoDanhGia>>(`/QLBaoCao/danhgia`, {
    params: {
      soTrang,
      soLuong,
      tuKhoa,
      ngayBatDau,
      ngayKetThuc,
      idLoaiBaoCao,
      trangThai
    }
  })
}

export const duyetBaoCaoDanhGia = (id: number) => {
  return http.put<null>(`/QLBaoCao/danhgia/duyet/${id}`)
}

export const suaLoaiBaoCaoDanhGia = (id: number, idLoaiBaoCao: number) => {
  return http.put<null>(`/QLBaoCao/danhgia/sua/${id}`, null, {
    params: {
      idLoaiBaoCao
    }
  })
}
export const baoCaoDanhGia = (data: BaoCaoDanhGiaRequest) => {
  return http.post<null>(`/BaoCao/danh-gia`, data)
}
