import { z } from 'zod'

export const nguoiDungSchema = z.object({
  tenNguoiDung: z
    .string()
    .min(1, { message: 'Tên người dùng là bắt buộc' })
    .max(100, { message: 'Tên người dùng không được quá 100 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional().nullable(),
  idNgheNghiep: z.number().int().positive().optional().nullable(),
  idMucDich: z.number().int().positive().optional().nullable(),
  idVaiTro: z.array(z.number().int().positive()).optional(),
  anhDaiDienFile: z.instanceof(File).optional().nullable()
})

export type NguoiDungFormData = z.infer<typeof nguoiDungSchema>

export const CapNhatThongTinSchema = z.object({
  hoTen: z.string().min(3, 'Họ tên phải ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  anhDaiDien: z.any().optional()
})

export const DoiMatKhauSchema = z
  .object({
    matKhauHienTai: z.string().min(6, 'Mật khẩu hiện tại ít nhất 6 ký tự'),
    matKhauMoi: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
    xacNhanMatKhauMoi: z.string().min(6, 'Xác nhận mật khẩu ít nhất 6 ký tự')
  })
  .refine((data) => data.matKhauMoi === data.xacNhanMatKhauMoi, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['xacNhanMatKhauMoi']
  })
