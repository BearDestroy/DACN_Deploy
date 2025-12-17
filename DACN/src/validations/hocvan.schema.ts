import * as z from 'zod'

export const hocVanSchema = z.object({
  maHocVan: z
    .string()
    .min(4, 'Mã học vấn phải ít nhất 4 ký tự')
    .max(50, 'Mã học vấn không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenHocVan: z.string().min(1, 'Tên học vấn bắt buộc').max(255, 'Tên học vấn không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type hocVanFormData = z.infer<typeof hocVanSchema>
