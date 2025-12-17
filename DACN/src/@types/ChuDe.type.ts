export interface ChuDe {
  id: number
  maChuDe: string
  tenChuDe: string
  thoiGianTao: string
  trangThai: boolean
  idTheLoai: number
}

export interface ChuDeRequest {
  maChuDe?: string
  tenChuDe: string
  trangThai?: boolean
  idTheLoai: number
}
