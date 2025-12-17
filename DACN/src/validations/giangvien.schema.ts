import { z } from 'zod'

export const giangVienSchema = z.object({
  maGiangVien: z.string().max(100, { message: 'Tên giảng viên không được quá 100 ký tự' }).optional().nullable(),
  tenGiangVien: z
    .string()
    .min(1, { message: 'Tên giảng viên là bắt buộc' })
    .max(100, { message: 'Tên giảng viên không được quá 100 ký tự' }),
  namSinh: z
    .date('Ngày sinh không hợp lệ')
    .refine((date) => date.getFullYear() > 1900, {
      message: 'Năm sinh không hợp lệ'
    })
    .refine((date) => date <= new Date(), {
      message: 'Ngày sinh không được lớn hơn hiện tại'
    }),
  soDienThoai: z
    .string()
    .min(1, { message: 'Số điện thoại là bắt buộc' })
    .max(20, { message: 'Số điện thoại không được quá 20 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional().nullable(),
  kinhNghiem: z.string().max(500).optional().nullable(),
  idChuyenMon: z.number().int().positive({ message: 'Chuyên môn là bắt buộc' }),
  idHocVan: z.number().int().positive().optional().nullable(),
  anhDaiDienFile: z.instanceof(File).optional().nullable()
})

export type GiangVienFormData = z.infer<typeof giangVienSchema>
