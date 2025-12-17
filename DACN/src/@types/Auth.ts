export interface IVerifyOTPRequest {
  email: string
  maotp: string
}

export interface ILoginRequest {
  email: string
  matKhau: string
}

export interface IGetCurrentUser {
  email: string
  hoTen: string
  anhDaiDien: string | null
  ngheNghiep: string
  mucDich: string
  idNgheNghiep: number
  idMucDich: number
  vaiTro: string[]
}

export interface ILoginResponse {
  token: {
    accessToken: string
    refreshToken: string
  }
  thongTinNguoiDung: IGetCurrentUser
}

export interface IRegisterRequest {
  email: string
  hoTen: string
  matKhau: string
}

export interface IJobSearchResponse {
  idNgheNghiep: number
}

export interface IMucDichResponse {
  idMucDich: number
}
