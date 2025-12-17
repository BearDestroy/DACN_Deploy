export interface TrinhDo {
  id: number
  maTrinhDo: string
  tenTrinhDo: string
  thoiGianTao: string
  trangThai: boolean
}

export interface TrinhDoRequest {
  maTrinhDo?: string
  tenTrinhDo: string
  trangThai?: boolean
}
