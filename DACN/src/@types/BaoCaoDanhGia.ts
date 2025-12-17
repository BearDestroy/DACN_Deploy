export interface BaoCaoDanhGia {
  id: number
  tenNguoiBaoCao: string
  noiDungBaoCao: string
  tenNguoiDanhGia: string
  noiDungDanhGia: string | ''
  soDiemDanhGia: number
}

export interface BaoCaoDanhGiaChiTiet {
  id: number
  tenNguoiBaoCaoDanhGia: string
  noiDungBaoCao: string | null
  idLoaiBaoCao: number
  ngayBaoCao: Date
  idDanhGia: number
  soDiemDanhGia: number
  noiDungDanhGia: string
  tenNguoiDanhGia: string
  ngayDanhGia: Date
}

export interface BaoCaoDanhGiaRequest {
  idDanhGia: number
  idLoaiBaoCao: number
  noiDung: string
}
