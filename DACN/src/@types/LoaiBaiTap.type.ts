export interface LoaiBaiTap {
  id: number
  maLoaiBaiTap: string
  tenLoaiBaiTap: string
  thoiGianTao: string
  trangThai: boolean
}

export interface LoaiBaiTapRequest {
  maLoaiBaiTap?: string
  tenLoaiBaiTap: string
  trangThai?: boolean
}
