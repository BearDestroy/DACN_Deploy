import type { QLBaiHocResponse } from './BaiHoc'

export interface QLChuongHocResponse {
  idChuongHoc: number
  tenChuongHoc: string
  thuTu: number
  soLuongBaiHoc: number
  ngayTao: string
  thoiLuongChuongHoc: string
  danhSachBaiHoc: QLBaiHocResponse[]
}

export interface ChuongHocRequest {
  IdChuongHoc: number
  TenChuongHoc: string
  ThuTu: number
  DanhSachBaiHoc: QLBaiHocResponse[]
}
