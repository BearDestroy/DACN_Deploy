export {}

declare global {
  interface IBackendRes<T> {
    statusCode: number
    message: string
    data?: T
  }
  interface PhanTrang<T> {
    trangTruoc: number
    trangTiepTheo: number
    ketQua: T[]
    tongSoLuong: number
  }
  interface KhoaHocFilter {
    soTrang: number
    soLuong: number
    trangThai: number
    tuKhoa?: string
    idGiangVien?: number
    idDanhMuc?: number
    idChuDe?: number
    idTheLoai?: number
    idMucDich?: number
    idNgheNghiep?: number
    giaTu?: number
    giaDen?: number
  }

  interface LoTrinhFilter {
    tuKhoa?: string
    soTrang?: number
    soLuong?: number
    trangThai?: number
    idTrinhDo?: number
    idMucDich?: number
    idNgheNghiep?: number
  }
  export interface KhoaHocCard {
    id: number
    tenKhoaHoc: string
    moTaNgan: string
    noiDungHocDuoc: string
    tenTrinhDo: string
    tenGiangVien: string
    anhDaiDien?: string
    thoiGianTao: Date
    thoiGianChinhSua?: Date
    thoiGianHoc: number
    danhGiaTrungBinh: number
  }
}
