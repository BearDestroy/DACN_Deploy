import type { IGetCurrentUser, IJobSearchResponse, IMucDichResponse } from '../Auth'
import type { KhoaHocNguoiDung } from '../KhoaHoc'
import type { LoTrinhNguoiDung } from '../LoTrinhHoc'

export interface NguoiDungContextType {
  currentUser: IGetCurrentUser | null
  setCurrentUser: (v: IGetCurrentUser | null) => void
  selectedJob: IJobSearchResponse | null
  setSelectedJob: (job: IJobSearchResponse | null) => void
  selectedMucDich: IMucDichResponse | null
  setSelectedMucDich: (goal: IMucDichResponse | null) => void
  isAuthenticated: boolean
  loading: boolean
}

export interface TienDoKhoaHoc {
  idKhoaHoc: number
  tienDo: number
  baiHocCuoiCung: number
  danhSachBaiHocHoanThanh: number[]
}

export interface HocTapContextType {
  khoaHocDaGhiDanh: KhoaHocNguoiDung[]
  daDangKyKhoaHoc: (idKhoaHoc: number) => boolean
  danhDauHoanThanhBaiHoc: (idBaiHoc: number) => Promise<boolean>
  dangKyKhoaHoc: (idKhoaHoc: number) => void
  dangKyKhoaHocLoading: boolean
  loadKhoaHocDaGhiDanh: () => void
  dangKyLoTrinhHoc: (idKhoaHoc: number) => void
  dangKyLoTrinhHocLoading: boolean
  loadLoTrinhHocDaGhiDanh: () => void
  daDangKyLoTrinhHoc: (idLoTrinhHoc: number) => boolean
  loTrinhHocDaGhiDanh: LoTrinhNguoiDung[]
}
