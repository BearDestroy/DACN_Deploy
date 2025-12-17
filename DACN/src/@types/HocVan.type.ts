export interface HocVan {
  id: number
  maHocVan: string
  tenHocVan: string
  thoiGianTao: string
  trangThai: boolean
}

export interface HocVanRequest {
  maHocVan?: string
  tenHocVan: string
  trangThai?: boolean
}
