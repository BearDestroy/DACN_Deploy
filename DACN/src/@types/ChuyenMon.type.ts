export interface ChuyenMon {
  id: number
  maChuyenMon: string
  tenChuyenMon: string
  thoiGianTao: string
  trangThai: boolean
}

export interface ChuyenMonRequest {
  maChuyenMon?: string
  tenChuyenMon: string
  trangThai?: boolean
}
