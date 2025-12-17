export interface LoaiCauHoi {
  id: number
  maLoaiCauHoi: string
  tenLoaiCauHoi: string
  thoiGianTao: string
  trangThai: boolean
}

export interface LoaiCauHoiRequest {
  maLoaiCauHoi?: string
  tenLoaiCauHoi: string
  trangThai?: boolean
}
