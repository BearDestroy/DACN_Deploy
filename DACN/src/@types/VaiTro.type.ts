export interface VaiTro {
  id: number
  maVaiTro: string
  tenVaiTro: string
  thoiGianTao: string
  trangThai: boolean
}

export interface VaiTroRequest {
  maVaiTro?: string
  tenVaiTro: string
  trangThai?: boolean
}
