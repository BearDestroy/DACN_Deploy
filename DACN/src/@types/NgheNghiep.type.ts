export interface NgheNghiep {
  id: number
  maNgheNghiep: string
  tenNgheNghiep: string
  thoiGianTao: string
  trangThai: boolean
}

export interface NgheNghiepRequest {
  maNgheNghiep?: string
  tenNgheNghiep: string
  trangThai?: boolean
}
