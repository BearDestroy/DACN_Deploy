// types/bai-tap.ts
export interface IBaiTapTomTat {
  idBaiTap: number
  tenBaiTap: string
  moTa: string
  thoiGianLam: number
  tenLoaiBaiTap: string
  soLuongCauHoi: number
  trangThai?: 'hoan_thanh' | 'chua_lam'
  diemSo?: number
}

export interface IDapAn {
  idDapAn: number
  noiDung: string
}

export interface ICauHoi {
  idBaiTapCauHoi: number
  idCauHoi: number
  noiDung: string
  dapAn: IDapAn[]
}

export interface IChiTietBaiTap {
  idBaiTap: number
  tenBaiTap: string
  thoiGianLam: number
  cauHoi: ICauHoi[]
}

export interface IKetQuaLamBai {
  diemSo: number
  soCauDung: number
  tongSoCau: number
  lanLam: number
}

export interface ICauHoiNopBai {
  IdBaiTapCauHoi: number
  IdCauHoi: number
  IdDapAn: number
}

export interface INopBaiTapRequest {
  IdBaiTap: number
  ThoiGianLamBai: Date
  CauHoi: ICauHoiNopBai[]
}

export interface BaiTap {
  id: number
  maBaiTap: string
  tenBaiTap: string
  moTa: string
  thoiGianLam: number
  soLuongCauHoi: number
  tenBaiHoc: string
  tenLoaiBaiTap: string
  trangThai: boolean
}

export interface QLBaiTapRequest {
  maBaiTap?: string | null
  tenBaiTap: string
  moTa?: string | null
  thoiGianLam: number
  idBaiHoc: number
  idLoaiBaiTap: number
  trangThai: boolean
  listCauHoi: {
    id?: number
    maCauHoi?: string
    noiDung: string
    idLoaiCauHoi: number
    idLoaiDoKho: number
    listQLDapAn: {
      noiDung: string
      dapAnDung: boolean
    }[]
  }[]
}
