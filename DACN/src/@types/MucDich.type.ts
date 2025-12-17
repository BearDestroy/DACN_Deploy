export interface MucDich {
  id: number
  maMucDich: string
  tenMucDich: string
  thoiGianTao: string
  trangThai: boolean
}

export interface MucDichRequest {
  maMucDich?: string
  tenMucDich: string
  trangThai?: boolean
}
