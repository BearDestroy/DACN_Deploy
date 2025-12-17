import type { KhoaHocChiTietResponse } from '@/@types/KhoaHoc'
import type { KhoaHocFormData } from '@/validations/khoahoc.schema'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
export function createURLDM(
  location: string,
  soTrang: number,
  soLuongHienThi: number,
  trangThai: string,
  tuKhoa?: string
) {
  let url = `${location}?soTrang=${soTrang}&soLuong=${soLuongHienThi}&trangThai=${trangThai}`

  if (tuKhoa) {
    url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`
  }
  return url
}
export function createURLNguoiDung(location: string, soTrang: number, soLuongHienThi: number, tuKhoa?: string) {
  let url = `${location}?soTrang=${soTrang}&soLuong=${soLuongHienThi}`

  if (tuKhoa) {
    url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`
  }
  return url
}

export function createURLTheLoai(
  location: string,
  soTrang: number,
  soLuongHienThi: number,
  trangThai: string,
  tuKhoa?: string,
  idDanhMuc?: number | string
) {
  let url = `${location}?soTrang=${soTrang}&soLuong=${soLuongHienThi}&trangThai=${trangThai}&idDanhMuc=${idDanhMuc}`

  if (tuKhoa) {
    url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`
  }
  return url
}

export function createURLChuDe(
  location: string,
  soTrang: number,
  soLuongHienThi: number,
  trangThai: string,
  tuKhoa?: string,
  idDanhMuc?: number | string
) {
  let url = `${location}?soTrang=${soTrang}&soLuong=${soLuongHienThi}&trangThai=${trangThai}&idTheLoai=${idDanhMuc}`

  if (tuKhoa) {
    url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`
  }
  return url
}

export function createURLBaoCaoDanhGia(
  location: string,
  soTrang: number = 1,
  soLuong: number = 10,
  trangThai?: string,
  tuKhoa?: string,
  ngayBatDau?: Date | null,
  ngayKetThuc?: Date | null,
  idLoaiBaoCao?: number | string
) {
  let url = `${location}?soTrang=${soTrang}&soLuong=${soLuong}`

  if (trangThai) {
    url += `&trangThai=${encodeURIComponent(trangThai)}`
  }
  if (tuKhoa) {
    url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`
  }
  if (ngayBatDau) {
    url += `&ngayBatDau=${encodeURIComponent(toDMY(ngayBatDau))}`
  }

  if (ngayKetThuc) {
    url += `&ngayKetThuc=${encodeURIComponent(toDMY(ngayKetThuc))}`
  }
  if (idLoaiBaoCao !== undefined && idLoaiBaoCao !== null && idLoaiBaoCao !== '') {
    url += `&idLoaiBaoCao=${idLoaiBaoCao}`
  }

  return url
}

export function createURLKhoaHoc(location: string, filters: KhoaHocFilter) {
  let url = `${location}?soTrang=${filters.soTrang ?? 1}&soLuong=${filters.soLuong ?? 10}`

  if (filters.trangThai !== undefined) url += `&trangThai=${filters.trangThai}`
  if (filters.tuKhoa) url += `&tuKhoa=${encodeURIComponent(filters.tuKhoa)}`
  if (filters.idGiangVien !== undefined) url += `&idGiangVien=${filters.idGiangVien}`
  if (filters.idDanhMuc !== undefined) url += `&idDanhMuc=${filters.idDanhMuc}`
  if (filters.idChuDe !== undefined) url += `&idChuDe=${filters.idChuDe}`
  if (filters.idTheLoai !== undefined) url += `&idTheLoai=${filters.idTheLoai}`
  if (filters.idMucDich !== undefined) url += `&idMucDich=${filters.idMucDich}`
  if (filters.idNgheNghiep !== undefined) url += `&idNgheNghiep=${filters.idNgheNghiep}`
  if (filters.giaTu !== undefined) url += `&giaTu=${filters.giaTu}`
  if (filters.giaDen !== undefined) url += `&giaDen=${filters.giaDen}`
  return url
}

export function createURLLoTrinh(location: string, filters: LoTrinhFilter) {
  let url = `${location}?soTrang=${filters.soTrang ?? 1}&soLuong=${filters.soLuong ?? 10}`

  if (filters.trangThai !== undefined) url += `&trangThai=${filters.trangThai}`
  if (filters.tuKhoa) url += `&tuKhoa=${encodeURIComponent(filters.tuKhoa)}`

  if (filters.idTrinhDo !== undefined) url += `&idTrinhDo=${filters.idTrinhDo}`
  if (filters.idMucDich !== undefined) url += `&idMucDich=${filters.idMucDich}`
  if (filters.idNgheNghiep !== undefined) url += `&idNgheNghiep=${filters.idNgheNghiep}`

  return url
}

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  if (dateString === '') {
    return ' '
  }
  return `${day}/${month}/${year}`
}

export function toDMY(date: Date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

export function formatPrice(price: string, thousandSeparator: string = ','): string {
  const str = price.toString()
  const len = str.length
  if (len <= 3) return str

  let result = ''
  let count = 0

  for (let i = len - 1; i >= 0; i--) {
    result = str[i] + result
    count++
    if (count % 3 === 0 && i !== 0) {
      result = thousandSeparator + result
    }
  }

  return result
}
export const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
}
export function mapApiToForm(data: KhoaHocChiTietResponse | null): KhoaHocFormData {
  return {
    maKhoaHoc: data?.maKhoaHoc ?? '',
    tenKhoaHoc: data?.tenKhoaHoc ?? '',
    moTaNgan: data?.moTaNgan ?? '',
    noiDungHocDuoc: data?.noiDungHocDuoc ?? '',
    yeuCauKhoaHoc: data?.yeuCauKhoaHoc ?? '',
    noiDungKhoaHoc: data?.noiDungKhoaHoc ?? '',
    doiTuongKhoaHoc: data?.doiTuongKhoaHoc ?? '',
    idTrinhDo: data?.idTrinhDo ?? 0,
    idGiangVien: data?.idGiangVien ?? 0,
    idMucDich: data?.idMucDich ?? 0,
    idNgheNghiep: data?.idNgheNghiep ?? 0,
    idChuDe: data?.idChuDe ?? [],
    anhDaiDienFile: null,
    anhDaiDien: data?.hinhDaiDien ?? '',

    danhSachChuongHoc:
      data?.danhSachChuongHoc?.map((c) => ({
        idChuongHoc: c.idChuongHoc ?? null,
        tenChuongHoc: c.tenChuongHoc ?? '',
        thuTu: c.thuTu ?? 0,
        danhSachBaiHoc:
          c.danhSachBaiHoc?.map((b) => ({
            idBaiHoc: b.idBaiHoc ?? null,
            tenBaiHoc: b.tenBaiHoc ?? '',
            thuTu: b.thuTu ?? 0,
            taiLieuKemTheo: null,
            taiNguyenUrl: b.taiNguyenUrl ?? '',
            taiNguyenFile: null
          })) ?? []
      })) ?? []
  }
}

export const formatTimeAgo = (date: Date) => {
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  } catch {
    return date.toString()
  }
}
