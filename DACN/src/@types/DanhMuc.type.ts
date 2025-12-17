export interface DanhMuc {
  id: number
  maDanhMuc: string
  tenDanhMuc: string
  thoiGianTao: string
  trangThai: boolean
}

export interface DanhMucRequest {
  maDanhMuc?: string
  tenDanhMuc: string
  trangThai?: boolean
}
