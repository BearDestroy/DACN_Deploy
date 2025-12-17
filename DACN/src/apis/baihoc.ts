import type { HoiDapChiTietResponse, HoiDapResponse, IGhiChuResponse, ILoaiBaoCao } from '@/@types/BaiHoc'
import { http } from '@/utils/interceptor'

export const LayDanhSachGhiChu = (idBaiHoc: number) => {
  const urlApi = `/GhiChus/${idBaiHoc}`
  return http.get<IGhiChuResponse[]>(urlApi)
}

export const ThemGhiChu = (idBaiHoc: number, thoiGian: number, noiDung: string) => {
  const urlApi = `/GhiChus/${idBaiHoc}`
  return http.post<null>(urlApi, null, {
    params: { thoiGian, noiDung }
  })
}

export const XoaGhiChu = (idGhiChu: number) => {
  const urlApi = `/GhiChus/`
  return http.delete<null>(urlApi, {
    params: { idGhiChu }
  })
}

export const SuaGhiChu = (idGhiChu: number, noiDung: string) => {
  const urlApi = `/GhiChus/`
  return http.put<null>(urlApi, null, {
    params: { idGhiChu, noiDung }
  })
}

export const LayDanhSachHoiDap = (idBaiHoc: number) => {
  const urlApi = `/HoiDaps`
  return http.get<HoiDapResponse[]>(urlApi, {
    params: { idBaiHoc }
  })
}

export const LayChiTietHoiDap = (idHoiDap: number) => {
  const urlApi = `/HoiDaps/${idHoiDap}`
  return http.get<HoiDapChiTietResponse>(urlApi)
}

export const ThemHoiDap = (idBaiHoc: number, tieuDeCauHoi: string, noiDung: string) => {
  const urlApi = `/HoiDaps`
  return http.post<null>(urlApi, {
    IdBaiHoc: idBaiHoc,
    TieuDeCauHoi: tieuDeCauHoi,
    NoiDung: noiDung
  })
}

export const ThemPhanHoi = (idHoiDap: number, noiDung: string) => {
  const urlApi = `/HoiDaps/${idHoiDap}/phan-hoi`
  return http.post<null>(urlApi, null, {
    params: { noiDung }
  })
}

export const SuaPhanHoi = (idPhanHoi: number, noiDung: string) => {
  const urlApi = `/HoiDaps/phan-hoi/${idPhanHoi}`
  return http.put<null>(urlApi, { NoiDung: noiDung })
}

export const XoaPhanHoi = (idPhanHoi: number) => {
  const urlApi = `/HoiDaps/phan-hoi/${idPhanHoi}`
  return http.delete<null>(urlApi)
}

export const LayLoaiBaoCao = () => {
  const urlApi = `/LoaiBaoCaos/`
  return http.get<ILoaiBaoCao[]>(urlApi)
}
export const BaoCaoKhoaHoc = (idKhoaHoc: number, idLoaiBaoCao: number, noiDung: string) => {
  const urlApi = ` /BaoCaos/khoa-hoc`
  return http.post<null>(
    urlApi,
    {
      IdKhoaHoc: idKhoaHoc,
      IdLoaiBaoCao: idLoaiBaoCao,
      NoiDungBaoCao: noiDung
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export const BaoCaoDanhGia = (idDanhGia: number, idLoaiBaoCao: number, noiDung: string) => {
  const urlApi = `/BaoCaos/danh-gia`
  return http.post<null>(
    urlApi,
    {
      IdDanhGia: idDanhGia,
      IdLoaiBaoCao: idLoaiBaoCao,
      NoiDungBaoCao: noiDung
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
