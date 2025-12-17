import { http } from '@/utils/interceptor'

export interface LoTrinhTieuBieu {
  id: number
  tenLoTrinh: string
  soKhoaHoc: number
  tongHocVien: number
  tienDoTrungBinh: number
}
export interface DuLieuBangDieuKhien {
  chiSo: {
    hocVienMoi: ChiSoKPI
    khoaHocHoatDong: ChiSoKPI
    baoCaoViPham: ChiSoKPI
  }
  bieuDo: {
    dangKyMoi: DuLieuBieuDoMien[]
    danhMuc: DuLieuBieuDoTron[]
  }
  danhSach: {
    khoaHocTieuBieu: KhoaHocHot[]
    loTrinhTieuBieu: LoTrinhTieuBieu[]
  }
}

// Các interface con
export interface ChiSoKPI {
  tieuDe: string
  giaTri: number
  thayDoi: number
  xuHuong: 'tang' | 'giam' | 'giu_nguyen'
  moTa: string
}

export interface DuLieuBieuDoMien {
  thu: string
  ngayDayDu: string
  soLuong: number
}

export interface DuLieuBieuDoTron {
  id: number
  ten: string
  soLuong: number
  mauSac: string
}

export interface KhoaHocHot {
  id: number
  tenKhoaHoc: string
  giangVien: string
  soLuongHocVien: number
}

export const LayDuLieuDashboard = () => {
  const urlApi = `Dashbroad`
  return http.get<DuLieuBangDieuKhien>(urlApi)
}
