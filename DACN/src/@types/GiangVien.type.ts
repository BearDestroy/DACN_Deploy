export interface GiangVien {
  id: number
  tenGiangVien?: string
  maGiangVien?: string
  thoiGianTao: string
  trangThai: boolean
}
export interface GiangVienChiTiet {
  id: number
  maGiangVien?: string
  tenGiangVien?: string
  namSinh?: Date | null
  soDienThoai?: string
  email?: string
  idChuyenMon?: number
  tenChuyenMon?: string
  idHocVan?: number | null
  tenHocVan?: string | null
  kinhNghiem?: string | null
  anhDaiDien?: string | null
  soLuongDanhGia: number
  danhGiaTrungBinh: number | null
  soLuongKhoaHoc: number
  soLuongHocSinh: number
}

export interface GiangVienResponse {
  id: number
  maGiangVien: string
  tenGiangVien: string
  email: string | null
  tenChuyenMon: string
  tenHocVan: string
}
