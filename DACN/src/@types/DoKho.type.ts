export interface DoKho {
  id: number
  maDoKho: string
  tenDoKho: string
  thoiGianTao: string
  trangThai: boolean
}

export interface DoKhoRequest {
  maDoKho?: string
  tenDoKho: string
  trangThai?: boolean
}
