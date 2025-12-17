export interface NguoiDungResponse {
  id: number
  tenNguoiDung: string
  email?: string | null
  tenNgheNghiep?: string | null
  tenMucDich?: string | null
}

export interface NguoiDungChiTiet {
  id: number
  anhDaiDien?: string | null
  tenNguoiDung: string
  email?: string | null
  idNgheNghiep?: number | null
  idMucDich?: number | null
  idVaiTro?: number[]
  soLuongDanhGia?: number
  danhGiaTrungBinh?: number | null
  soLuongKhoaHoc?: number
  soLuongBaiHocHoanThanh?: number
}

export interface CapNhatThongTin {
  hoTen: string
  email: string
  anhDaiDien?: FileList | null
}

export interface DoiMatKhauForm {
  matKhauHienTai: string
  matKhauMoi: string
  xacNhanMatKhauMoi: string
}
