import type { KhoaHocNguoiDung } from './KhoaHoc'
export interface QLLoTrinhHocResponse {
  id: number
  maLoTrinhHoc: string
  tenLoTrinhHoc: string
  soLuongDangKy: number
  soLuongKhoaHoc: number
}
export interface IChiTietLoTrinh {
  idLoTrinhHoc: number
  tenLoTrinh: string
  hinhAnh: string
  moTaNgan: string
  noiDungHocDuoc: string
  thoiGianCapNhat: string | null | Date
  danhSachKhoaHoc: IKhoaHocChiTiet[]
  tenTrinhDo: string
}
export interface LoTrinhNguoiDung {
  idLoTrinhHoc: number
  tenLoTrinh: string
  hinhAnh: string
  moTaNgan: string
  noiDungHocDuoc: string
  thoiGianCapNhat: string | null | Date
  danhSachKhoaHoc: KhoaHocNguoiDung[]
  tenTrinhDo: string
  tiLeHoanThanh: number
}
export interface IKhoaHocChiTiet {
  moTaNgan: string
  idKhoaHoc: number
  tenKhoaHoc: string
  thuTu?: number
  soLuongChuongHoc: number
  soLuongBaiGiang: number
  soLuongGioHoc: number
  chuongHoc: IChuongHoc[]
  noiDungKhoaHoc: string
  yeuCauKhoaHoc: string
  moTaChiTiet: string
  hinhAnh: string
  danhGia: IDanhGiaKhoaHoc
  giangVien: IGiangVien
  tenTrinhDo: string
}
export interface IDanhGiaKhoaHoc {
  soLuongDanhGia: number
  danhGiaTrungBinh: number
  namSao: number
  bonSao: number
  baSao: number
  haiSao: number
  motSao: number
  danhSachBinhLuan: IDanhGia[]
  soLuongHocVien: number
}

export interface IDanhGia {
  idDanhGia: number
  hoTen: string
  ngayDanhGia: string | Date
  loiDanhGia: string
  soDiemDanhGia: number
}

export interface IGiangVien {
  tenGiangVien: string
  chuyenMon: string
  gioiThieu?: string
  hinhAnh?: string
}

export interface IChuongHoc {
  idChuongHoc?: number
  tenChuongHoc: string
  thuTu: number
  baiHoc: IBaiHocResponse[]
  thoiGianDay?: number
}
export interface IBaiHocResponse {
  idBaiHoc: number
  tenBaiHoc: string
  thuTu: number
  thoiLuongBaiHoc: number
  hoanThanh?: boolean
  lanCuoiHoc?: number | 0
  videoUrl?: string
}

export interface KhoaHocChiTietTrangChu {
  idKhoaHoc: number
  tenKhoaHoc: string
  moTaNgan?: string | null
  noiDungHocDuoc?: string | null
  thoiLuong: number
  soLuongBaiHoc: number
  tenTrinhDo?: string | null
  tenMucDich?: string | null
  tenGiangVien?: string | null
  hinhDaiDien?: string | null
  thoiGianCapNhat?: string | null | Date
  danhGiaTrungBinh: number
  tongSoDanhGia: number
}
export interface ILoTrinhHocResponse {
  idLoTrinhHoc: number
  tenLoTrinh: string
  hinhAnh: string
  soLuongDangKy: number
  soLuongKhoaHoc: number
  soLuongBaiHoc: number
  thoiGianHoc: number
}
export interface LoTrinhHoc {
  idLoTrinhHoc: number
  tenLoTrinh: string
  moTa?: string | null
  noiDungHocDuoc?: string | null
  hinhDaiDien?: string | null
  hinhAnh?: string | null
  danhSachKhoaHoc: KhoaHocChiTietTrangChu[]
  tenTrinhDo: string
  thoiGianChinhSua: Date
}

export interface KhoaHocTrongLoTrinhResponse {
  idKhoaHocLoTrinh: number
  idKhoaHoc: number
  tenKhoaHoc: string
  maKhoaHoc: string
  tenGiangVien: string
  thoiLuong: number
  thuTu: number
}

export interface QLLoTrinhHocChiTietResponse {
  idLoTrinhHoc: number
  maLoTrinhHoc: string
  tenLoTrinhHoc: string
  moTaNgan: string | null
  noiDungHocDuoc: string | null
  idTrinhDo: number | null
  idMucDich: number | null
  idNgheNghiep: number | null
  anhDaiDien: string | null
  ngayTao: string
  danhSachKhoaHoc: KhoaHocTrongLoTrinhResponse[]
  trangThai: boolean
}
