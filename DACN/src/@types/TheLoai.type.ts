export interface TheLoai {
  id: number
  maTheLoai: string
  tenTheLoai: string
  thoiGianTao: string
  trangThai: boolean
  idDanhMuc: number
}

export interface TheLoaiRequest {
  maTheLoai?: string
  tenTheLoai: string
  trangThai?: boolean
  idDanhMuc: number
}
