import * as z from 'zod'

export const mucDichSchema = z.object({
  maMucDich: z
    .string()
    .min(4, 'Mã mục đích phải ít nhất 4 ký tự')
    .max(50, 'Mã mục đích không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenMucDich: z.string().min(1, 'Tên mục đích bắt buộc').max(255, 'Tên mục đích không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type mucDichFormData = z.infer<typeof mucDichSchema>
