import type { QLChuongHocResponse } from './ChuongHoc'

export interface QLKhoaHocResponse {
  id: number
  maKhoaHoc?: string
  tenKhoaHoc?: string
  tenGiangVien?: string
  danhGiaTrungBinh?: number
  soLuongDanhGia?: number
}

export interface KhoaHocChiTietResponse {
  idKhoaHoc: number
  maKhoaHoc: string
  tenKhoaHoc: string
  moTaNgan?: string | null
  noiDungHocDuoc?: string | null
  yeuCauKhoaHoc?: string | null
  noiDungKhoaHoc?: string | null
  doiTuongKhoaHoc?: string | null
  thoiLuong: number
  soLuongBaiHoc: number
  idTrinhDo?: number
  idMucDich?: number
  idNgheNghiep?: number
  idGiangVien?: number
  hinhDaiDien?: string | null
  thoiGianCapNhat?: Date
  danhGiaTrungBinh: number
  tongSoDanhGia: number
  danhSachChuongHoc?: QLChuongHocResponse[]
  idChuDe: number[] | []
}

export interface KhoaHocChiTietHomePage {
  idKhoaHoc: number
  tenKhoaHoc: string
  moTaNgan?: string | null
  noiDungHocDuoc?: string | null
  thoiLuong: number
  soLuongBaiHoc: number
  soLuongChuongHoc: number
  tenTrinhDo?: number
  tenMucDich?: number
  tenNgheNghiep?: number
  tenGiangVien?: number
  hinhDaiDien?: string | null
  thoiGianCapNhat?: Date
  danhGiaTrungBinh: number
  tongSoDanhGia: number
}
export interface KhoaHocNguoiDung {
  idKhoaHoc: number
  tenKhoaHoc: string
  moTaNgan?: string | null
  noiDungHocDuoc?: string | null
  thoiLuong: number
  soLuongBaiHoc: number
  soLuongChuongHoc: number
  tenTrinhDo?: number
  tenGiangVien?: number
  hinhDaiDien?: string | null
  ngayTao?: string
  thoiGianCapNhat?: string
  danhGiaTrungBinh: number
  tongSoDanhGia: number
  tiLeHoanThanh: number
  daDanhGia: DanhGiaKhoaHoc
  baiHocGanNhat: BaiHocGanNhat[] | null
  hoanThanhMotBai: boolean
}
export interface BaiHocGanNhat {
  id: number
  tenBaiHoc?: string
  lanCuoiXem: number
  thoiLuongBaiHoc: number
}
export interface BaiHocGanNhatHinhAnh {
  id: number
  tenBaiHoc?: string
  lanCuoiXem: number
  hinhAnh: string
  tenKhoaHoc: string
  idKhoaHoc: number
}

export interface DanhGiaKhoaHoc {
  soDiemDanhGia: number
  loiDanhGia: string
}

export interface IGoiYResponse {
  tieuDe: string
  tieuDeCon: string
  url: string
}

export interface IGoiYResponseFull {
  khoaHoc: IGoiYResponse[]
  loTrinhHoc: IGoiYResponse[]
}

export interface BaiHocOption {
  id: number
  tenBaiHoc: string
}

export interface HoiDapAIResponse {
  answer: string
}

export interface HoiDapAIRequest {
  Prompt: string
  IdBaiHoc: number
}
