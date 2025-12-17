import * as z from 'zod'

export const ngheNghiepSchema = z.object({
  maNgheNghiep: z
    .string()
    .min(4, 'Mã nghề nghiệp phải ít nhất 4 ký tự')
    .max(50, 'Mã nghề nghiệp không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenNgheNghiep: z.string().min(1, 'Tên nghề nghiệp bắt buộc').max(255, 'Tên nghề nghiệp không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type ngheNghiepFormData = z.infer<typeof ngheNghiepSchema>
