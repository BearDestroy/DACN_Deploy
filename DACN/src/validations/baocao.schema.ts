import * as z from 'zod'

export const vaiTroSchema = z.object({
  maVaiTro: z
    .string()
    .min(4, 'Mã vai trò phải ít nhất 4 ký tự')
    .max(50, 'Mã vai trò không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenVaiTro: z.string().min(1, 'Tên vai trò bắt buộc').max(255, 'Tên vai trò không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type vaiTroFormData = z.infer<typeof vaiTroSchema>
