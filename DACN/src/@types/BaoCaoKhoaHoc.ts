export interface BaoCaoKhoaHoc {
  id: number
  tenNguoiBaoCaoKhoaHoc: string | null
  noiDungBaoCao: string | null
  maKhoaHoc: string | null
  tenKhoaHoc: string | null
  tenGiangVien: string | null
}

export interface BaoCaoKhoaHocChiTiet {
  id: number
  tenNguoiBaoCaoKhoaHoc: string
  noiDungBaoCao: string
  idLoaiBaoCao: number
  ngayBaoCao: string
  anhDaiDienUrl: string | null
  maKhoaHoc: string
  tenKhoaHoc: string
  moTaNgan: string
  soDiemTrungBinh: number | null
  soLuongDanhGia: null | number
  tenGiangVien: string
  tenMucDich: string
  tenNgheNghiep: string
  tenTrinhDo: string
  ngayTaoKhoaHoc: Date
  thoiGianCapNhat: Date | null
}

export interface BaoCaoKhoaHocRequest {
  idKhoaHoc: number
  idLoaiBaoCao: number
  noiDung: string
}
