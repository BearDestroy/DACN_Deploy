export interface LoaiDanhGia {
  id: number
  maLoaiDanhGia: string
  tenLoaiDanhGia: string
  thoiGianTao: string
  trangThai: boolean
}

export interface LoaiDanhGiaRequest {
  maLoaiDanhGia?: string
  tenLoaiDanhGia: string
  trangThai?: boolean
}
