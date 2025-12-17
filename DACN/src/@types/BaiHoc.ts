export interface QLBaiHocResponse {
  idBaiHoc: number | null
  tenBaiHoc: string
  thuTu: number
  thoiLuongBaiHoc: number
  taiLieuKemTheo?: string | null
  taiNguyenUrl: string | null
}

export interface IGhiChuResponse {
  idGhiChu: number
  idBaiHoc: number
  thoiDiemGhiChu: number
  noiDungGhiChu: string
}

export interface HoiDapResponse {
  idHoiDap: number
  tieuDeCauHoi: string
  noiDung: string
  thoiGianHoi: string
  soLuongPhanHoi: number
  hoTen: string
  hinhAnh: string | null
}
export interface PhanHoiResponse {
  idPhanHoi: number
  noiDung: string
  thoiGianPhanHoi: Date
  nguoiPhanHoi: string
  hinhAnh: string | null
  phanHoiCuaMinh: boolean
  thoiGianChinhSua: Date
}

export interface HoiDapChiTietResponse {
  idHoiDap: number
  tieuDeCauHoi: string
  noiDung: string
  thoiGianTao: Date
  hoTen: string
  hinhAnh: string | null
  phanHoi: PhanHoiResponse[]
}

export interface ILoaiBaoCao {
  tenLoai: string
  idLoai: number
}
