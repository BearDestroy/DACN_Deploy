import type {
  BaiHocOption,
  HoiDapAIRequest,
  HoiDapAIResponse,
  IGoiYResponseFull,
  KhoaHocChiTietHomePage,
  KhoaHocChiTietResponse,
  KhoaHocNguoiDung,
  QLKhoaHocResponse
} from '@/@types/KhoaHoc'
import { http } from '@/utils/interceptor'
import type { KhoaHocFormData } from '@/validations/khoahoc.schema'

export const layDSKhoaHoc = (params: {
  tuKhoa?: string | null
  soTrang?: number | string
  soLuong?: number | string
  trangThai?: number
  idGiangVien?: number | null
  idDanhMuc?: number | null
  idChuDe?: number | null
  idTheLoai?: number | null
  idMucDich?: number | null
  idTrinhDo?: number | null
  idNgheNghiep?: number | null
}) => {
  return http.get<PhanTrang<QLKhoaHocResponse>>('/QLKhoaHocs', { params })
}

export const layChiTietKhoaHoc = (id: number) => {
  return http.get<KhoaHocChiTietResponse>(`/QLKhoaHocs/${id}`)
}

export const buildKhoaHocFormData = (khoaHocRequest: KhoaHocFormData) => {
  const formData = new FormData()
  formData.append('tenKhoaHoc', khoaHocRequest.tenKhoaHoc)
  formData.append('maKhoaHoc', khoaHocRequest.maKhoaHoc ?? '')
  formData.append('moTaNgan', khoaHocRequest.moTaNgan)
  formData.append('noiDungHocDuoc', khoaHocRequest.noiDungHocDuoc)
  formData.append('yeuCauKhoaHoc', khoaHocRequest.yeuCauKhoaHoc ?? '')
  formData.append('noiDungKhoaHoc', khoaHocRequest.noiDungKhoaHoc)
  formData.append('doiTuongKhoaHoc', khoaHocRequest.doiTuongKhoaHoc ?? '')
  formData.append('idTrinhDo', khoaHocRequest.idTrinhDo.toString())
  formData.append('idGiangVien', khoaHocRequest.idGiangVien.toString())
  formData.append('idMucDich', khoaHocRequest.idMucDich.toString())
  formData.append('idNgheNghiep', khoaHocRequest.idNgheNghiep.toString())

  formData.append('trangThai', khoaHocRequest.trangThai ? 'true' : 'false')

  if (khoaHocRequest.anhDaiDienFile instanceof File) {
    formData.append('anhDaiDienFile', khoaHocRequest.anhDaiDienFile)
  }
  khoaHocRequest.idChuDe.forEach((id) => {
    formData.append('IdChuDe', id.toString())
  })

  const danhSachChuongHoc = khoaHocRequest.danhSachChuongHoc ?? []

  danhSachChuongHoc.forEach((chuong, i) => {
    if (chuong.idChuongHoc) {
      formData.append(`danhSachChuongHoc[${i}].idChuongHoc`, chuong.idChuongHoc.toString())
    }
    formData.append(`danhSachChuongHoc[${i}].tenChuongHoc`, chuong.tenChuongHoc)
    formData.append(`danhSachChuongHoc[${i}].thuTu`, chuong.thuTu.toString())
    ;(chuong.danhSachBaiHoc ?? []).forEach((baiHoc, j) => {
      if (baiHoc.idBaiHoc) {
        formData.append(`danhSachChuongHoc[${i}].danhSachBaiHoc[${j}].idBaiHoc`, baiHoc.idBaiHoc.toString())
      }

      formData.append(`danhSachChuongHoc[${i}].danhSachBaiHoc[${j}].tenBaiHoc`, baiHoc.tenBaiHoc)
      formData.append(`danhSachChuongHoc[${i}].danhSachBaiHoc[${j}].thuTu`, baiHoc.thuTu.toString())
      if (baiHoc.taiNguyenFile instanceof File) {
        formData.append(`danhSachChuongHoc[${i}].danhSachBaiHoc[${j}].taiNguyenFile`, baiHoc.taiNguyenFile)
      }
    })
  })
  return formData
}

export const themKhoaHoc = (khoaHocRequest: KhoaHocFormData) => {
  const formData = buildKhoaHocFormData(khoaHocRequest)
  return http.post<null>('/QLKhoaHocs', formData)
}

export const suaKhoaHoc = (id: number, khoaHocRequest: KhoaHocFormData) => {
  const formData = buildKhoaHocFormData(khoaHocRequest)
  return http.put<null>(`/QLKhoaHocs/${id}`, formData)
}

export const xoaKhoaHoc = (id: number) => {
  return http.delete<null>(`/QLKhoaHocs/${id}`)
}

export const xoaChuongHoc = (id: number) => {
  return http.delete<null>(`/QLChuongHocs/${id}`)
}

export const xoaBaiHoc = (id: number) => {
  return http.delete<null>(`/QLBaiHocs/${id}`)
}

export const layKhoaHocTheoURL = (urlAPI: string) => {
  return http.get<KhoaHocChiTietHomePage[]>(urlAPI)
}

export const layGoiY = () => {
  const urlApi = `/auth/goi-y`
  return http.get<IGoiYResponseFull>(urlApi)
}

export const layDanhSachKhoaHocNguoiDung = () => {
  return http.get<KhoaHocNguoiDung[]>('khoa-hoc/nguoi-dung')
}

export const danhDauHoanThanh = (idBaiHoc: number) => {
  const urlApi = `/tiendohoctaps/${idBaiHoc}/danh-dau`
  return http.post<boolean>(urlApi)
}
export interface KhoaHocSearchParams {
  tuKhoa?: string
  idDanhMuc?: number
  sapXepTheo?: number
  idTrinhDo?: number
  soTrang: number
  soLuong: number
}
export const layKhoaHocSearch = (params: KhoaHocSearchParams) => {
  return http.get<PhanTrang<KhoaHocChiTietHomePage>>('khoa-hoc/search', { params })
}

export const layChiTietKhoaHocTrangChu = (idKhoaHoc: number) => {
  const urlApi = `/khoa-hoc-chi-tiet/${idKhoaHoc}`
  return http.get<IKhoaHocChiTiet>(urlApi)
}
export const layKhoaHocNguoiDungChiTiet = (idKhoaHoc: number) => {
  return http.get<IKhoaHocChiTiet>(`khoa-hoc/${idKhoaHoc}/nguoi-dung`)
}
export const layDanhGiaKhoaHoc = (idKhoaHoc: number, soSao?: number | null, tuKhoa?: string) => {
  const urlApi = `/khoa-hoc/${idKhoaHoc}/danh-gia`

  return http.get<IDanhGiaKhoaHoc>(urlApi, {
    params: {
      soSao,
      tuKhoa
    }
  })
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

export interface IChuongHoc {
  idChuongHoc?: number
  tenChuongHoc: string
  thuTu: number
  baiHoc: IBaiHocResponse[]
  thoiGianDay?: number
}

export interface IKhoaHocChiTiet {
  moTaNgan: string
  idKhoaHoc: number
  tenKhoaHoc: string
  soLuongChuongHoc: number
  soLuongBaiGiang: number
  soLuongGioHoc: number
  soLuongHocVien: number
  chuongHoc: IChuongHoc[]
  noiDungKhoaHoc: string
  yeuCauKhoaHoc: string
  moTaChiTiet: string
  hinhAnh: string
  danhGia: IDanhGiaKhoaHoc
  giangVien: IGiangVien
  thoiGianCapNhat: Date
  yeuThich: boolean
  tenTrinhDo: string
  noiDungHocDuoc: string
  thoiGianTao: Date
}
export interface IDanhGia {
  idDanhGia: number
  hoTen: string
  ngayDanhGia: string
  loiDanhGia: string
  soDiemDanhGia: number
  anhDaiDien?: string
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
export interface IGiangVien {
  idGiangVien: number
  tenGiangVien: string
  chuyenMon: string
  gioiThieu?: string
  hinhAnh?: string
  soLuongHocVien?: number
  soLuongDanhGia?: number
  soLuongKhoaHoc?: number
  danhGiaTrungBinh?: number
}

export interface ITienDoBaiHoc {
  hoanThanh: boolean
  thoiGianXem: number
}

export const LuuTienDo = (idBaiHoc: number, thoiGian: number) => {
  const urlApi = `/tiendohoctaps/${idBaiHoc}/luu-tien-do?thoiGian=${thoiGian}`
  return http.post<null>(urlApi)
}

export const DangKyKhoaHoc = (idKhoaHoc: number) => {
  const urlApi = `/DangKyHoc/khoa-hoc`
  return http.post<null>(urlApi, null, {
    params: { idKhoaHoc }
  })
}

export const LayThoiGianXemBaiHoc = (idBaihoc: number) => {
  const urlApi = `/bai-hoc/${idBaihoc}`
  return http.get<number>(urlApi)
}

export const layTatCaBaiHoc = (id: number) => {
  return http.get<BaiHocOption[]>(`/QLKhoaHocs/tat-ca/${id}/bai-hoc`)
}

export const HoiDapAI = (Prompt: string, IdBaiHoc: number) => {
  const body: HoiDapAIRequest = {
    Prompt,
    IdBaiHoc
  }

  return http.post<HoiDapAIResponse>('/Gemini', body)
}
