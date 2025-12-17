import * as z from 'zod'

export const doKhoSchema = z.object({
  maDoKho: z
    .string()
    .min(4, 'Mã độ khóphải ít nhất 4 ký tự')
    .max(50, 'Mã độ khókhông vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenDoKho: z.string().min(1, 'Tên độ khóbắt buộc').max(255, 'Tên độ khókhông vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type doKhoFormData = z.infer<typeof doKhoSchema>
