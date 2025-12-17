import type { ILoginRequest, ILoginResponse, IRegisterRequest, IVerifyOTPRequest } from '@/@types/Auth'
import { http } from '@/utils/interceptor'

export const DangKy = (dangKyRequest: IRegisterRequest) => {
  const urlApi = `/auth/dang-ky`
  return http.post<null>(urlApi, dangKyRequest)
}

export const XacThuc = (data: IVerifyOTPRequest) => {
  const urlApi = `/auth/xac-thuc-otp`
  return http.post<null>(urlApi, data)
}

export const CheckEmail = (data: string) => {
  const urlApi = `/auth/kiem-tra-email?email=${data}`
  return http.post<null>(urlApi)
}

export const GuiLaiMa = (email: string) => {
  const urlApi = `/auth/gui-lai-otp`
  return http.post<null>(urlApi, null, {
    params: { email }
  })
}

export const DangNhap = (data: ILoginRequest) => {
  const urlApi = `/auth/dang-nhap`
  return http.post<ILoginResponse>(urlApi, data)
}

export const DatLaiMatKhau = (email: string, matKhauMoi: string) => {
  const urlApi = `/auth/quen-mat-khau/dat-lai`
  return http.post<null>(urlApi, {
    email,
    matKhauMoi
  })
}
